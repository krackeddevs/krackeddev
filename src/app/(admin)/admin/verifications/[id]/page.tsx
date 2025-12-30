import { getVerificationRequestDetail } from "@/features/companies/verification/admin-actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Clock, AlertCircle, Download } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { AdminVerificationActions } from "@/features/companies/verification/components/admin-verification-actions";

export default async function VerificationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const request = await getVerificationRequestDetail(id);

    if (!request) {
        notFound();
    }

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

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Verification Request</h1>
                    <p className="text-muted-foreground">Review company verification details</p>
                </div>
                {getStatusBadge(request.status)}
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        {request.company?.logoUrl && (
                            <img
                                src={request.company.logoUrl}
                                alt={request.company.name}
                                className="h-16 w-16 rounded object-cover"
                            />
                        )}
                        <div>
                            <CardTitle>{request.company?.name}</CardTitle>
                            <CardDescription>{request.company?.websiteUrl}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-3">Business Details</h3>
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="text-muted-foreground">Registration Number:</span>{" "}
                                {request.businessRegistrationNumber}
                            </p>
                            {request.taxId && (
                                <p>
                                    <span className="text-muted-foreground">Tax ID:</span> {request.taxId}
                                </p>
                            )}
                            {request.registrationDocumentUrl && (
                                <a
                                    href={`/api/verification-docs/${request.registrationDocumentUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:underline"
                                >
                                    <Download className="h-4 w-4" />
                                    Download Registration Document
                                </a>
                            )}
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold mb-3">Email Verification</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                {request.verificationEmail}
                                {request.emailVerified ? (
                                    <Badge variant="default" className="gap-1">
                                        <CheckCircle className="h-3 w-3" />
                                        Verified
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="gap-1">
                                        <XCircle className="h-3 w-3" />
                                        Not Verified
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold mb-3">Requester Details</h3>
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="text-muted-foreground">Name:</span> {request.requesterName}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Title:</span> {request.requesterTitle}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Phone:</span> {request.requesterPhone}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Email:</span>{" "}
                                {request.requester?.email || "N/A"}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold mb-3">Additional Context</h3>
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="text-muted-foreground">Expected Job Postings:</span>{" "}
                                {request.expectedJobCount}
                            </p>
                            <div>
                                <span className="text-muted-foreground">Reason for Verification:</span>
                                <p className="mt-1 whitespace-pre-wrap">{request.reason}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold mb-3">Request Timeline</h3>
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="text-muted-foreground">Submitted:</span>{" "}
                                {request.createdAt && format(new Date(request.createdAt), "PPpp")} (
                                {request.createdAt && formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })})
                            </p>
                            {request.reviewedAt && (
                                <p>
                                    <span className="text-muted-foreground">Reviewed:</span>{" "}
                                    {format(new Date(request.reviewedAt), "PPpp")} by{" "}
                                    {request.reviewer?.username || "Admin"}
                                </p>
                            )}
                        </div>
                    </div>

                    {request.adminNotes && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="font-semibold mb-3">Admin Notes</h3>
                                <p className="text-sm whitespace-pre-wrap">{request.adminNotes}</p>
                            </div>
                        </>
                    )}

                    {request.rejectionReason && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="font-semibold mb-3">Rejection Reason</h3>
                                <p className="text-sm whitespace-pre-wrap">{request.rejectionReason}</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {request.status === "pending" || request.status === "needs_info" ? (
                <AdminVerificationActions requestId={request.id} />
            ) : null}
        </div>
    );
}
