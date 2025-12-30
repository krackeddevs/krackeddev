import { CompanyDashboardLayout } from "@/features/companies/components/dashboard-layout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserCompany } from "@/features/companies/actions";

export default async function DashboardCompanyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Ensure user has a company
    const company = await getUserCompany();
    if (!company) {
        redirect("/hire/register");
    }

    return <div className="space-y-6">{children}</div>;
}
