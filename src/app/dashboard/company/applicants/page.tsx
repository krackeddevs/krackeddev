import { ApplicantsTable } from "@/features/companies/components/applicants-table";
import { getUserCompany } from "@/features/companies/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CompanyApplicantsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const company = await getUserCompany();
    if (!company) redirect("/hire/register");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Applicants</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Review and manage candidates for your jobs.
                </p>
            </div>

            <ApplicantsTable companyId={company.id} />
        </div>
    );
}
