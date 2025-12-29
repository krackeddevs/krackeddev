import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { getUserCompany } from "@/features/companies/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

    return (
        <div className="fixed inset-0 bg-black text-white overflow-hidden z-40">
            {/* Background Effects (Global for Dashboard) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-primary/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-secondary/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="relative z-10 flex h-full overflow-hidden">
                <DashboardSidebar user={user} company={company} />

                <main className="flex-1 overflow-auto bg-transparent relative md:ml-64 h-full">
                    <div className="container mx-auto p-6 md:p-8 max-w-7xl pb-24">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
