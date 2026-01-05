import { Suspense } from "react";
import { PollsTable } from "@/features/admin-dashboard/components/polls-table";
import { getPolls } from "@/features/admin/poll-actions";
import { AdminPageHeader } from "@/features/admin-dashboard/components/admin-page-header";
import { CreatePollDialog } from "@/features/admin-dashboard/components/create-poll-dialog";

export default async function AdminPollsPage() {
    const { data: polls } = await getPolls();

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Polls"
                description="Create and manage community polls."
                breadcrumbs={[{ label: "Polls" }]}
            />

            <div className="flex justify-end">
                <CreatePollDialog />
            </div>

            <Suspense fallback={<div>Loading polls...</div>}>
                <PollsTable polls={(polls as any) || []} />
            </Suspense>
        </div>
    );
}
