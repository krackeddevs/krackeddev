import { createClient } from "@/lib/supabase/server";
import { InquiryDetailsView } from "@/features/dashboard/components/inquiry-details/inquiry-details-view";
import { notFound } from "next/navigation";
import { BountyInquiry, Bounty, BountySubmissionRow } from "@/types/database";

// Since both Personal and Company use the same logic, we can reuse this page or copy it.
// This example is for Company but logic applies to both.

export default async function InquiryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return notFound();

    // 1. Fetch Inquiry (Confirm Ownership via RLS or explicit check)
    // RLS policy "Users can view own inquiries" handles security.
    const { data, error } = await supabase
        .from("bounty_inquiries")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id) // Strict ownership
        .single();

    const inquiry = data as BountyInquiry | null;

    if (error || !inquiry) {
        console.error("Error fetching inquiry details:", error);
        return notFound();
    }

    // 2. Fetch Active Bounty (if published)
    // We look for a bounty where inquiry_id matches
    const { data: activeBountyData } = await supabase
        .from("bounties")
        .select("*")
        .eq("inquiry_id", inquiry.id)
        .single();

    const activeBounty = activeBountyData as Bounty | null;

    // 3. Fetch Submissions (if active bounty exists)
    let submissions: BountySubmissionRow[] = [];
    if (activeBounty?.slug) {
        const { data: subs } = await supabase
            .from("bounty_submissions")
            .select("*")
            .eq("bounty_slug", activeBounty.slug)
            .order("created_at", { ascending: false });

        if (subs) submissions = subs;
    }

    return (
        <InquiryDetailsView
            inquiry={inquiry}
            activeBounty={activeBounty}
            submissions={submissions}
            isOwner={true}
            backLink="/dashboard/company/inquiries"
        />
    );
}
