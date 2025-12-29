import { fetchAllSubmissions } from "@/features/bounty-board";
import { AdminPageHeader } from "@/features/admin-dashboard/components/admin-page-header";
import { SubmissionsTableClient } from "@/features/admin-dashboard/components/submissions-table-client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminSubmissionsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: submissions } = await fetchAllSubmissions();

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Submission Review"
                description="Review and manage bounty submissions"
                breadcrumbs={[{ label: "Submissions" }]}
            />
            <SubmissionsTableClient
                submissions={submissions || []}
                userId={user.id}
                onReload={() => {
                    // This will be handled client-side with router.refresh()
                }}
            />
        </div>
    );
}
