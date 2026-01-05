import { createClient } from "@/lib/supabase/server";
import { InquiryDetailsView } from "@/features/dashboard/components/inquiry-details/inquiry-details-view";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/features/admin-dashboard/components/admin-page-header";

export default async function AdminInquiryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Fetch Inquiry (No user_id strict check, assumed Admin RLS policy allows access)
    // We can verify admin role here or trust RLS + Middleware
    const { data: inquiry, error } = await supabase
        .from("bounty_inquiries")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !inquiry) {
        return notFound();
    }

    // 2. Fetch Active Bounty
    const { data: activeBounty } = await supabase
        .from("bounties")
        .select("*")
        .eq("inquiry_id", inquiry.id)
        .single();

    // 3. Fetch Submissions
    let submissions = [];
    if (activeBounty?.slug) {
        const { data: subs } = await supabase
            .from("bounty_submissions")
            .select("*")
            .eq("bounty_slug", activeBounty.slug)
            .order("created_at", { ascending: false });

        if (subs) submissions = subs;
    }

    // Admins are "Owners" effectively in terms of ability to edit
    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Inquiry Details"
                description={`Managing inquiry: ${inquiry.title}`}
                breadcrumbs={[
                    { label: "Inquiries", href: "/admin/inquiries" },
                    { label: "Details", href: `/admin/inquiries/${id}` },
                ]}
            />
            <InquiryDetailsView
                inquiry={inquiry}
                activeBounty={activeBounty}
                submissions={submissions}
                isOwner={true} // Admins can edit
                backLink="/admin/inquiries"
            />
        </div>
    );
}
