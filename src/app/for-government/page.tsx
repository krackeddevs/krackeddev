import { Metadata } from "next";
import { GovernmentHero } from "@/features/for-government/components/government-hero";
import { GovernmentProblem } from "@/features/for-government/components/government-problem";
import { GovernmentSolution } from "@/features/for-government/components/government-solution";
import { GovernmentImpact } from "@/features/for-government/components/government-impact";
import { GovernmentPartnership } from "@/features/for-government/components/government-partnership";
import { GovernmentTimeline } from "@/features/for-government/components/government-timeline";
import { GovernmentCTA } from "@/features/for-government/components/government-cta";
import "@/styles/jobs.css";

export const metadata: Metadata = {
    title: "For Government | Building Malaysia's Tech Talent Pipeline | KrackedDevs",
    description: "Partner with Kracked Devs to upskill junior developers, reduce unemployment, and close the digital skills gap at zero cost to taxpayers. Aligned with Malaysia Digital Economy Blueprint 2025-2030.",
};

export default function ForGovernmentPage() {
    return (
        <main className="min-h-screen w-full bg-background relative overflow-x-hidden">
            {/* Global Theme Overlays */}
            <div className="scanlines fixed inset-0 pointer-events-none z-40 h-screen" />

            <GovernmentHero />
            <GovernmentProblem />
            <GovernmentSolution />
            <GovernmentImpact />
            <GovernmentPartnership />
            <GovernmentTimeline />
            <GovernmentCTA />
        </main>
    );
}
