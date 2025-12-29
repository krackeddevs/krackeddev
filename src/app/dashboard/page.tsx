import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserCompany } from "@/features/companies/actions";
import { getProfile } from "@/features/profiles/actions";
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Welcome back, <span className="text-neon-cyan">{displayName}</span>
                </h1>
                <p className="text-gray-400 mt-2">
                    Your command center for managing applications and profile.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="bg-black/40 border-white/10 backdrop-blur-md hover:border-neon-cyan/50 transition-colors group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">My Profile</CardTitle>
                        <User className="h-4 w-4 text-neon-cyan group-hover:text-white transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">Level 1</div>
                        <p className="text-xs text-gray-400 mt-1">Junior Developer</p>
                        <Button asChild className="w-full mt-4 bg-white/5 hover:bg-neon-cyan/20 text-white border border-white/10">
                            <Link href="/dashboard/profile">
                                View Profile <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Applications Card (Placeholder Stats for now) */}
                <Card className="bg-black/40 border-white/10 backdrop-blur-md hover:border-purple-500/50 transition-colors group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Applications</CardTitle>
                        <FileText className="h-4 w-4 text-purple-500 group-hover:text-white transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">0</div>
                        <p className="text-xs text-gray-400 mt-1">Active Applications</p>
                        <Button asChild className="w-full mt-4 bg-white/5 hover:bg-purple-500/20 text-white border border-white/10">
                            <Link href="/dashboard/applications">
                                Track Status <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Company Card (Conditional) */}
                {company ? (
                    <Card className="bg-black/40 border-white/10 backdrop-blur-md hover:border-yellow-500/50 transition-colors group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">{company.name}</CardTitle>
                            <Briefcase className="h-4 w-4 text-yellow-500 group-hover:text-white transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">Manage</div>
                            <p className="text-xs text-gray-400 mt-1">Employer Dashboard</p>
                            <Button asChild className="w-full mt-4 bg-white/5 hover:bg-yellow-500/20 text-white border border-white/10">
                                <Link href="/dashboard/company">
                                    Go to Company <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-black/40 border-white/10 backdrop-blur-md hover:border-gray-500 transition-colors opacity-50 hover:opacity-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">Hiring?</CardTitle>
                            <Briefcase className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">Create Company</div>
                            <p className="text-xs text-gray-400 mt-1">Post jobs and hire talent</p>
                            <Button asChild className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white border border-white/10">
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
