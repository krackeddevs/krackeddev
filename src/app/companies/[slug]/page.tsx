import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CompanyHeader } from "@/features/companies/components/company-header";
import { CompanyInfo } from "@/features/companies/components/company-info";
import { CompanyJobsList } from "@/features/companies/components/company-jobs-list";
import type { Metadata } from "next";

interface CompanyPageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getCompany(slug: string) {
    const supabase = await createClient();

    const { data: company, error } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !company) {
        return null;
    }

    return company;
}

async function getCompanyJobs(companyId: string) {
    const supabase = await createClient();

    const { data: jobs } = await supabase
        .from("jobs")
        .select("*")
        .eq("company_id", companyId)
        .eq("is_active", true)
        .order("posted_at", { ascending: false });

    return jobs || [];
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
    const { slug } = await params;
    const company = await getCompany(slug);

    if (!company) {
        return {
            title: "Company Not Found",
        };
    }

    return {
        title: `${company.name} - Company Profile | KrackedDev`,
        description: company.description || `View ${company.name}'s profile and open positions on KrackedDev`,
        openGraph: {
            title: company.name,
            description: company.description || `View ${company.name}'s profile and open positions`,
            images: company.logo_url ? [company.logo_url] : [],
        },
    };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
    const { slug } = await params;
    const company = await getCompany(slug);

    if (!company) {
        notFound();
    }

    const jobs = await getCompanyJobs(company.id);

    return (
        <div className="min-h-screen bg-background">
            <CompanyHeader company={company} />

            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
                    <div className="space-y-8">
                        <CompanyInfo company={company} />
                        <CompanyJobsList jobs={jobs} companyName={company.name} />
                    </div>

                    {/* Sidebar - could add related companies, stats, etc. */}
                    <div className="space-y-4">
                        {/* Placeholder for future features */}
                    </div>
                </div>
            </div>
        </div>
    );
}
