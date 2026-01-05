import { getUserCompany, getCompanyStats } from "@/features/companies/actions";
import { BountyInquiriesList } from "@/features/dashboard/components/bounty-inquiries-list";
import { getVerificationRequest } from "@/features/companies/verification/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { PlusCircle, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default async function CompanyDashboardPage() {
    const company = await getUserCompany();
    const stats = await getCompanyStats();
    const verificationRequest = company ? await getVerificationRequest(company.id) : null;

    if (!company) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        {company.is_verified ? (
                            <Badge variant="default" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Verified
                            </Badge>
                        ) : verificationRequest ? (
                            <Badge variant="secondary" className="gap-1">
                                <Clock className="h-3 w-3" />
                                Verification Pending
                            </Badge>
                        ) : null}
                    </div>
                    <p className="text-muted-foreground">Welcome back, {company.name}</p>
                    {!company.is_verified && !verificationRequest && (
                        <Link href="/dashboard/company/verify">
                            <Button variant="outline" size="sm" className="mt-2">
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Request Verification
                            </Button>
                        </Link>
                    )}
                </div>
                <Link href="/dashboard/company/jobs/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Post a Job
                    </Button>
                </Link>
            </div>

            {/* Show admin message if verification needs more info */}
            {verificationRequest?.status === "needs_info" && verificationRequest.adminNotes && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Additional Information Required</AlertTitle>
                    <AlertDescription className="mt-2">
                        <p className="mb-3">{verificationRequest.adminNotes}</p>
                        <Link href="/dashboard/company/verify">
                            <Button variant="outline" size="sm">
                                Update Verification Request
                            </Button>
                        </Link>
                    </AlertDescription>
                </Alert>
            )}

            {/* Show rejection reason if rejected */}
            {verificationRequest?.status === "rejected" && verificationRequest.rejectionReason && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Verification Request Rejected</AlertTitle>
                    <AlertDescription className="mt-2">
                        <p className="mb-3">{verificationRequest.rejectionReason}</p>
                        <Link href="/dashboard/company/verify">
                            <Button variant="outline" size="sm">
                                Submit New Request
                            </Button>
                        </Link>
                    </AlertDescription>
                </Alert>
            )}

            {/* Show success message if approved */}
            {company.is_verified && (
                <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Company Verified</AlertTitle>
                    <AlertDescription>
                        Your company has been verified. You now have access to premium features and your verified badge will be displayed on all job postings.
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">Recent Inquiries</h2>
                    <Link href="/dashboard/company/inquiries" className="text-sm text-muted-foreground hover:text-primary">
                        View all
                    </Link>
                </div>
                <BountyInquiriesList type="company" limit={3} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Jobs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeJobs}</div>
                        <p className="text-xs text-muted-foreground">
                            Current open positions
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Views
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalViews}</div>
                        <p className="text-xs text-muted-foreground">
                            Analytics coming soon
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
