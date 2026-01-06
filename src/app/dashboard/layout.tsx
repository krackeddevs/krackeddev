import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { getUserCompany } from "@/features/companies/actions";
import { getProfile } from "@/features/profiles/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";

import "@/styles/jobs.css";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch company if exists (for employer sidebar items)
    const company = await getUserCompany();

    // Fetch profile for sidebar display
    const { data: profile } = await getProfile();

    return (
        <div className="flex min-h-[calc(100vh-84px)] relative transition-colors duration-300">
            {/* Background Effects (Dashboard Specific) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--neon-primary)]/[0.03] rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--neon-secondary)]/[0.03] rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex w-full">
                <DashboardSidebar user={user} company={company} profile={profile} />

                <main className="flex-1 bg-transparent relative">
                    <div className="container mx-auto p-6 md:p-8 max-w-7xl pb-24">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
