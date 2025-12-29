import { redirect } from "next/navigation";
import { getUserCompany } from "@/features/companies/actions";
import { VerificationWizard } from "@/features/companies/verification/components/verification-wizard";

export default async function CompanyVerifyPage() {
    const company = await getUserCompany();

    if (!company) {
        redirect("/hire/register");
    }

    // If already verified, redirect to dashboard
    if (company.is_verified) {
        redirect("/dashboard/company");
    }

    return (
        <div className="container py-10">
            <VerificationWizard companyId={company.id} companyName={company.name} />
        </div>
    );
}
