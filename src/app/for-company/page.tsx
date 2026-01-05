import { Metadata } from "next";
import { CompanyHero } from "@/features/for-company/components/company-hero";
import { CompanyProblem } from "@/features/for-company/components/company-problem";
import { CompanySolution } from "@/features/for-company/components/company-solution";
import { CompanyComparison } from "@/features/for-company/components/company-comparison";
import { CompanyHowItWorks } from "@/features/for-company/components/company-how-it-works";
import { CompanyCTA } from "@/features/for-company/components/company-cta";
import "@/styles/jobs.css"; // Reuse global/jobs styles if needed, or rely on tailwind

export const metadata: Metadata = {
    title: "Hire Developers | KrackedDevs",
    description: "Post a project. Get applications from vetted developers. Choose your winner. The best way to hire developers in Malaysia.",
};

export default function OurCompanyPage() {
    return (
        <main className="min-h-screen w-full bg-background relative overflow-x-hidden">
            {/* Global Theme Overlays */}
            <div className="scanlines fixed inset-0 pointer-events-none z-40 h-screen" />

            <CompanyHero />
            <CompanyProblem />
            <CompanySolution />
            <CompanyComparison />
            <CompanyHowItWorks />
            <CompanyCTA />
        </main>
    );
}
