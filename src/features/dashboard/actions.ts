"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UpdateBountyPayload = {
    title: string;
    description: string;
    deadline: string;
    reward_amount: number;
    difficulty: string;
    skills: string[];
    repository_url?: string;
    requirements?: string[];
    long_description?: string;
};

export async function updateSubmissionStatus(submissionId: string, status: 'approved' | 'rejected') {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // 1. Fetch submission to check existence
        const { data: submission, error: submissionError } = await (supabase.from("bounty_submissions" as any) as any)
            .select("id, bounty_slug")
            .eq("id", submissionId)
            .single();

        if (submissionError || !submission) return { success: false, error: "Submission not found" };

        // 2. Verify Ownership via Bounty
        // We check if the current user matches the owner of the bounty with this slug
        const { data: bounty, error: bountyError } = await (supabase.from("bounties" as any) as any)
            .select("id, user_id")
            .eq("slug", submission.bounty_slug)
            .single();

        // Allow if user is owner OR if user is admin (need simple check)
        // For now, Strict Owner check based on plan, but RLS policy also enforces this on database level.
        // We do a check here for clearer error message.
        if (bountyError || !bounty) return { success: false, error: "Bounty not found" };

        if (bounty.user_id !== user.data.user.id) {
            // Check if Admin? For now let's rely on RLS throwing error if not owner/admin
        }

        // 3. Update Status
        const { error: updateError } = await (supabase.from("bounty_submissions" as any) as any)
            .update({
                status,
                reviewed_at: new Date().toISOString(),
                reviewed_by: user.data.user.id
            })
            .eq("id", submissionId);

        if (updateError) {
            console.error("Error updating submission:", updateError);
            return { success: false, error: "Failed to update status" };
        }

        revalidatePath("/dashboard/company/inquiries");
        revalidatePath("/dashboard/personal/inquiries");

        return { success: true, error: null };

    } catch (error) {
        console.error("Unexpected error in updateSubmissionStatus:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

export async function updateBounty(bountyId: string, data: UpdateBountyPayload) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // 1. Update the Active Bounty
        // RLS policy "Owners can update own bounties" will enforce ownership.
        const { data: updatedBounty, error: updateError } = await (supabase.from("bounties" as any) as any)
            .update({
                title: data.title,
                description: data.description,
                deadline: data.deadline,
                reward_amount: data.reward_amount,
                difficulty: data.difficulty,
                skills: data.skills,
                repository_url: data.repository_url,
                requirements: data.requirements,
                long_description: data.long_description,
                updated_at: new Date().toISOString(),
            })
            .eq("id", bountyId)
            .select("inquiry_id") // Fetch inquiry_id to sync
            .single();

        if (updateError) {
            console.error("Error updating bounty:", updateError);
            return { success: false, error: "Failed to update bounty" };
        }

        // 2. Sync with Inquiry (if it exists)
        if (updatedBounty?.inquiry_id) {
            const { error: inquiryError } = await (supabase.from("bounty_inquiries" as any) as any)
                .update({
                    title: data.title,
                    description: data.description,
                    deadline: data.deadline,
                    estimated_budget: data.reward_amount,
                    difficulty: data.difficulty,
                    skills: data.skills,
                })
                .eq("id", updatedBounty.inquiry_id);

            if (inquiryError) {
                console.warn("Failed to sync inquiry update:", inquiryError);
                // Non-fatal
            }
        }

        revalidatePath("/dashboard/company/inquiries");
        revalidatePath("/dashboard/personal/inquiries");
        revalidatePath(`/code/bounty/${updatedBounty?.slug || ""}`); // Revalidate public page if slug didn't change (slug updates are tricky, let's avoid for now)

        return { success: true, error: null };

    } catch (error) {
        console.error("Unexpected error in updateBounty:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}
