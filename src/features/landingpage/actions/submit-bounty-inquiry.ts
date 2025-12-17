"use server";

import { createClient } from "@/lib/supabase/server";

export interface BountyInquiryData {
    company: string;
    email: string;
    budget: string;
    description: string;
}

export interface ActionResult<T> {
    data: T | null;
    error: string | null;
}

export async function submitBountyInquiry(data: BountyInquiryData): Promise<ActionResult<boolean>> {
    try {
        const supabase = await createClient();

        // Explicit casting to `any` because TS is failing to infer the table schema despite correct types
        const { error } = await (supabase.from("bounty_inquiries" as any) as any).insert({
            company_name: data.company,
            email: data.email,
            budget_range: data.budget,
            description: data.description,
            status: "new",
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
