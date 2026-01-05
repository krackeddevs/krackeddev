import { createClient } from "@/lib/supabase/server";
import { InquiryDetailsView } from "@/features/dashboard/components/inquiry-details/inquiry-details-view";
import { notFound } from "next/navigation";
import { BountyInquiry, Bounty, BountySubmissionRow } from "@/types/database";

export default async function InquiryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return notFound();

    // 1. Fetch Inquiry
    const { data, error } = await supabase
        .from("bounty_inquiries")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id) // Strict ownership
        .single();

    const inquiry = data as BountyInquiry | null;

    if (error || !inquiry) {
        return notFound();
    }

    // 2. Fetch Active Bounty
    const { data: activeBountyData } = await supabase
        .from("bounties")
        .select("*")
        .eq("inquiry_id", inquiry.id)
        .single();

    const activeBounty = activeBountyData as Bounty | null;

    // 3. Fetch Submissions
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
            backLink="/dashboard/personal/inquiries"
        />
    );
}
