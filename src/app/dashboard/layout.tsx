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
        <div className="fixed inset-0 bg-black text-white overflow-hidden z-40">
            {/* Global Grid Overlay (Matching Landing Page) */}
            <div
                className="fixed inset-0 pointer-events-none z-10 opacity-[0.15]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.4) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* CRT Scanline Overlay - Fixed to viewport */}
            <div className="scanlines fixed inset-0 pointer-events-none z-50 h-screen"></div>

            {/* Background Effects (Dashboard Specific) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-primary/10 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-secondary/10 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="relative z-10 flex h-full overflow-hidden">
                <DashboardSidebar user={user} company={company} profile={profile} />

                <main className="flex-1 overflow-auto bg-transparent relative md:ml-64 h-full">
                    {/* Mobile Header */}
                    <div className="md:hidden p-4 flex items-center justify-between sticky top-0 z-50">
                        <MobileSidebar user={user} company={company} profile={profile} />
                        {/* Optional: Add Logo or Title here if needed, or leave it minimal */}
                    </div>

                    <div className="container mx-auto p-6 md:p-8 max-w-7xl pb-24">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
