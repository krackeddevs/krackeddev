import { getAllVerificationRequests } from "@/features/companies/verification/admin-actions";
import { AdminPageHeader } from "@/features/admin-dashboard/components/admin-page-header";
import { AdminDataTable, Column } from "@/features/admin-dashboard/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

type VerificationRequest = Awaited<ReturnType<typeof getAllVerificationRequests>>[number];

export default async function AdminVerificationsPage() {
    const requests = await getAllVerificationRequests();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Pending
                    </Badge>
                );
            case "approved":
                return (
                    <Badge variant="default" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Approved
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Rejected
                    </Badge>
                );
            case "needs_info":
                return (
                    <Badge variant="outline" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Needs Info
                    </Badge>
                );
            default:
                return null;
        }
    };

    const columns: Column<VerificationRequest>[] = [
        {
            key: "company",
            label: "Company",
            render: (request) => (
                <div className="flex items-center gap-3">
                    {request.company?.logoUrl && (
                        <img
                            src={request.company.logoUrl}
                            alt={request.company.name}
                            className="h-10 w-10 rounded object-cover"
                        />
                    )}
                    <div>
                        <div className="font-medium">{request.company?.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {request.verificationEmail}
                        </div>
                    </div>
                </div>
            ),
            mobileRender: (request) => (
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        {request.company?.logoUrl && (
                            <img
                                src={request.company.logoUrl}
                                alt={request.company.name}
                                className="h-12 w-12 rounded object-cover"
                            />
                        )}
                        <div>
                            <div className="font-bold">{request.company?.name}</div>
                            <div className="text-sm text-muted-foreground">
                                {request.verificationEmail}
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "requesterName",
            label: "Requester",
            render: (request) => (
                <div>
                    <div>{request.requesterName}</div>
                    <div className="text-sm text-muted-foreground">
                        {request.requesterTitle}
                    </div>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (request) => getStatusBadge(request.status),
        },
        {
            key: "createdAt",
            label: "Submitted",
            sortable: true,
            render: (request) =>
                request.createdAt
                    ? formatDistanceToNow(new Date(request.createdAt), {
                        addSuffix: true,
                    })
                    : "N/A",
        },
        {
            key: "actions",
            label: "Actions",
            render: (request) => (
                <Link href={`/admin/verifications/${request.id}`}>
                    <Button size="sm">View Details</Button>
                </Link>
            ),
            mobileRender: (request) => (
                <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex gap-2">
                        {getStatusBadge(request.status)}
                    </div>
                    <Link href={`/admin/verifications/${request.id}`}>
                        <Button size="sm">View</Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Verification Requests"
                description="Review and manage company verification requests"
                breadcrumbs={[{ label: "Verifications" }]}
            />

            <AdminDataTable
                data={requests}
                columns={columns}
                searchPlaceholder="Search by company name or email..."
                emptyMessage="No verification requests found"
            />
        </div>
    );
}
