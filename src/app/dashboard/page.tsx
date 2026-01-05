import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserCompany } from "@/features/companies/actions";

import { getProfile } from "@/features/profiles/actions";
import { BountyInquiriesList } from "@/features/dashboard/components/bounty-inquiries-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Briefcase, FileText, User } from "lucide-react";

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const company = await getUserCompany();
    const { data: profile } = await getProfile();

    const displayName = profile?.full_name || profile?.username || user.email?.split("@")[0] || "User";

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Welcome back, <span className="text-neon-primary">{displayName}</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                    Your command center for managing applications and profile.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">Recent Inquiries</h2>
                    <Link href="/dashboard/personal/inquiries" className="text-sm text-muted-foreground hover:text-primary">
                        View all
                    </Link>
                </div>
                <BountyInquiriesList type="individual" limit={3} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="bg-card/40 border-2 border-border backdrop-blur-sm hover:border-neon-primary hover:bg-neon-primary/5 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_0_30px_var(--neon-primary)]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">My Profile</CardTitle>
                        <User className="h-4 w-4 text-neon-primary group-hover:text-foreground transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">Level {profile?.level || 1}</div>
                        <p className="text-xs text-muted-foreground mt-1">{profile?.developer_role || "Junior Developer"}</p>
                        <Button asChild className="w-full mt-4 bg-muted/50 hover:bg-neon-primary/20 text-foreground border border-border">
                            <Link href="/dashboard/profile">
                                View Profile <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Applications Card (Placeholder Stats for now) */}
                <Card className="bg-card/40 border-2 border-border backdrop-blur-sm hover:border-neon-secondary hover:bg-neon-secondary/5 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_0_30px_var(--neon-secondary)]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
                        <FileText className="h-4 w-4 text-neon-secondary group-hover:text-foreground transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">0</div>
                        <p className="text-xs text-muted-foreground mt-1">Active Applications</p>
                        <Button asChild className="w-full mt-4 bg-muted/50 hover:bg-neon-secondary/20 text-foreground border border-border">
                            <Link href="/dashboard/applications">
                                Track Status <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Company Card (Conditional) */}
                {company ? (
                    <Card className="bg-card/40 border-2 border-border backdrop-blur-sm hover:border-neon-accent hover:bg-neon-accent/5 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_0_30px_var(--neon-accent)]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{company.name}</CardTitle>
                            <Briefcase className="h-4 w-4 text-neon-accent group-hover:text-foreground transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">Manage</div>
                            <p className="text-xs text-muted-foreground mt-1">Employer Dashboard</p>
                            <Button asChild className="w-full mt-4 bg-muted/50 hover:bg-neon-accent/20 text-foreground border border-border">
                                <Link href="/dashboard/company">
                                    Go to Company <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-card/40 border-2 border-border backdrop-blur-sm hover:border-neon-cyan hover:bg-neon-cyan/5 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_0_30px_var(--neon-cyan)]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Hiring?</CardTitle>
                            <Briefcase className="h-4 w-4 text-neon-cyan group-hover:text-foreground transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">Create Company</div>
                            <p className="text-xs text-muted-foreground mt-1">Post jobs and hire talent</p>
                            <Button asChild className="w-full mt-4 bg-muted/50 hover:bg-neon-cyan/20 text-foreground border border-border">
                                <Link href="/hire/register">
                                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
