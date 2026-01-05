"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function publishBounty(inquiryId: string) {
    try {
        const supabase = await createClient();

        // 1. Fetch the inquiry
        const { data: inquiry, error: fetchError } = await supabase
            .from("bounty_inquiries")
            .select("*")
            .eq("id", inquiryId)
            .single();

        if (fetchError || !inquiry) {
            return { success: false, error: "Inquiry not found" };
        }

        // 2. Generate Slice (kebab-case from title)
        let slug = inquiry.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        // Append random string to ensure uniqueness if needed
        const randomSuffix = Math.random().toString(36).substring(2, 7);
        slug = `${slug}-${randomSuffix}`;

        // 3. Insert into Bounties table
        const { error: insertError } = await supabase
            .from("bounties")
            .insert({
                title: inquiry.title,
                slug: slug,
                description: inquiry.description,
                reward_amount: inquiry.estimated_budget, // Already numeric RM
                difficulty: inquiry.difficulty || "intermediate",
                status: "open",
                type: "bounty", // DB type column (bounty/project/gig)
                skills: inquiry.skills,
                company_name: inquiry.company_name, // This triggers 'Community' type in UI
                deadline: inquiry.deadline,
                user_id: inquiry.user_id,         // Link to owner
                inquiry_id: inquiry.id,            // Link to original inquiry
                repository_url: inquiry.repository_url,
                requirements: inquiry.requirements,
                long_description: inquiry.long_description
            });

        if (insertError) {
            console.error("Error creating bounty:", insertError);
            return { success: false, error: "Failed to create bounty record" };
        }

        // 4. Update Inquiry Status
        const { error: updateError } = await supabase
            .from("bounty_inquiries")
            .update({ status: "approved" }) // 'approved' isn't explicitly in the check constraint in SQL but usually text
            .eq("id", inquiryId);

        if (updateError) {
            console.error("Error updating inquiry status:", updateError);
            // Non-fatal, bounty is already published
        }

        revalidatePath("/admin/inquiries");
        revalidatePath("/code/bounty");
        return { success: true, error: null };

    } catch (error) {
        console.error("Unexpected error publishing bounty:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

export async function updateInquiryStatus(inquiryId: string, status: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from("bounty_inquiries")
            .update({ status })
            .eq("id", inquiryId);

        if (error) throw error;
        revalidatePath("/admin/inquiries");
        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
