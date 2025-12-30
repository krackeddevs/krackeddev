import { getAllVerificationRequests } from "@/features/companies/verification/admin-actions";
import { AdminPageHeader } from "@/features/admin-dashboard/components/admin-page-header";
import { VerificationsTableClient } from "@/features/companies/verification/components/verifications-table-client";

export default async function AdminVerificationsPage() {
    const requests = await getAllVerificationRequests();

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Verification Requests"
                description="Review and manage company verification requests"
                breadcrumbs={[{ label: "Verifications" }]}
            />
            <VerificationsTableClient requests={requests} />
        </div>
    );
}
