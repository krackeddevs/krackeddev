import { getAllVerificationRequests } from "@/features/companies/verification/admin-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Verification Requests</h1>
                <p className="text-muted-foreground">Review and manage company verification requests</p>
            </div>

            <div className="grid gap-4">
                {requests.length === 0 ? (
                    <Card>
                        <CardContent className="py-10 text-center">
                            <p className="text-muted-foreground">No verification requests found</p>
                        </CardContent>
                    </Card>
                ) : (
                    requests.map((request) => (
                        <Card key={request.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        {request.company?.logoUrl && (
                                            <img
                                                src={request.company.logoUrl}
                                                alt={request.company.name}
                                                className="h-12 w-12 rounded object-cover"
                                            />
                                        )}
                                        <div>
                                            <CardTitle>{request.company?.name}</CardTitle>
                                            <CardDescription>
                                                Requested by {request.requesterName} •{" "}
                                                {request.createdAt && formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    {getStatusBadge(request.status)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1 text-sm">
                                        <p>
                                            <span className="text-muted-foreground">Email:</span> {request.verificationEmail}
                                            {request.emailVerified && (
                                                <CheckCircle className="inline ml-1 h-3 w-3 text-green-600" />
                                            )}
                                        </p>
                                        <p>
                                            <span className="text-muted-foreground">Registration:</span>{" "}
                                            {request.businessRegistrationNumber}
                                        </p>
                                        <p>
                                            <span className="text-muted-foreground">Expected Jobs:</span>{" "}
                                            {request.expectedJobCount}
                                        </p>
                                    </div>
                                    <Link href={`/admin/verifications/${request.id}`}>
                                        <Button>View Details</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
