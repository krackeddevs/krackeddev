"use server";

import { createClient } from "@/lib/supabase/server";

export interface BountyInquiryData {
    company: string;
    email: string;
    budget: string;
    title: string;
    difficulty: string;
    deadline?: string;
    skills: string;
    description: string;
    submitter_type: 'individual' | 'company';
}

export interface ActionResult<T> {
    data: T | null;
    error: string | null;
}

export async function submitBountyInquiry(data: BountyInquiryData): Promise<ActionResult<boolean>> {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { data: null, error: "Authentication required to submit a bounty inquiry." };
        }

        // Parse skills
        const skillsArray = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

        // Explicit casting to `any` because TS might fail to infer the table schema
        const { error } = await (supabase.from("bounty_inquiries" as any) as any).insert({
            title: data.title,
            company_name: data.company,
            email: data.email,
            estimated_budget: parseFloat(data.budget) || 0,
            budget_range: `RM ${data.budget}`, // Legacy/Fallback
            description: data.description,
            difficulty: data.difficulty,
            skills: skillsArray,
            deadline: data.deadline || null,
            status: "new",
            user_id: user.id,
            submitter_type: data.submitter_type
        });

        if (error) {
            console.error("Error submitting bounty inquiry:", error);
            return { data: null, error: "Failed to submit inquiry" };
        }

        return { data: true, error: null };
    } catch (error) {
        console.error("Unexpected error in submitBountyInquiry:", error);
        return { data: null, error: "An unexpected error occurred" };
    }
}
