import { EditCompanyForm } from "@/features/companies/components/edit-profile-form";
import { getUserCompany } from "@/features/companies/actions";
import { redirect } from "next/navigation";

export default async function CompanyProfilePage() {
    const company = await getUserCompany();

    if (!company) {
        redirect("/hire/register");
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
            <EditCompanyForm company={company} />
        </div>
    );
}
