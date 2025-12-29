import { CompanyRegistrationForm } from "@/features/companies/components/registration-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserCompany } from "@/features/companies/actions";

export default async function HireRegisterPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Authenticated check moved to client component for better UX with modal
    // if (!user) {
    //     redirect("/login?return_url=/hire/register");
    // }

    // Check if already owns a company
    const company = await getUserCompany();
    if (company) {
        redirect("/dashboard/company");
    }

    return (
        <div className="container mx-auto py-20 flex items-center justify-center min-h-[calc(100vh-80px)]">
            <CompanyRegistrationForm />
        </div>
    );
}
