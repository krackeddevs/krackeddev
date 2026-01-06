import { DevelopersHero } from "@/features/for-developers/components/developers-hero";
import { DevelopersProblem } from "@/features/for-developers/components/developers-problem";
import { DevelopersSolution } from "@/features/for-developers/components/developers-solution";
import { DevelopersJourney } from "@/features/for-developers/components/developers-journey";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "For Developers | Kracked Devs",
    description: "Join Malaysia's most active developer community. Learn vibe coding, win paid bounties, and build your portfolio while being part of something bigger.",
};

export default function ForDevelopersPage() {
    return (
        <main className="min-h-screen w-full bg-background relative overflow-x-hidden">
            <div className="scanlines fixed inset-0 pointer-events-none z-40 h-screen" />

            <DevelopersHero />
            <DevelopersProblem />
            <DevelopersSolution />
            <DevelopersJourney />
        </main>
    );
}
