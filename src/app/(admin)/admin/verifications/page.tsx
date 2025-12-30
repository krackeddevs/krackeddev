import { getAllVerificationRequests } from "@/features/companies/verification/admin-actions";
import { AdminPageHeader } from "@/features/admin-dashboard/components/admin-page-header";
import { VerificationsTableClient } from "@/features/companies/verification/components/verifications-table-client";

export const dynamic = 'force-dynamic';

export default async function AdminVerificationsPage() {
    const rawRequests = await getAllVerificationRequests();

    // Serialize dates for client component
    const requests = rawRequests.map((req) => ({
        ...req,
        createdAt: req.createdAt?.toISOString() || null,
        updatedAt: req.updatedAt?.toISOString() || null,
        reviewedAt: req.reviewedAt?.toISOString() || null,
    }));

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
