"use client";

import "@/styles/jobs.css";
import SplitTextAnimation from "./components/hero-animation";
import { TownhallV2 } from "./components/townhall";
import { useLandingSequence } from "./hooks/use-landing-sequence";

import { BrandCTA } from "./components/brand-cta";
import { LiveStats } from "./components/live-stats";
import { JobPreview } from "./components/job-preview";
import { NavigationHub } from "./components/navigation-hub";
import { CommunityMap } from "./components/community-map";
import { ManifestoModal } from "@/components/ManifestoModal";

export function LandingPage() {
    const { showAnimation, animationDone, handleAnimationComplete } = useLandingSequence();

    return (
        <main className="min-h-screen w-full bg-gray-900 relative flex flex-col">
            {/* Manifesto Modal - Shows once for new visitors */}
            <ManifestoModal />
            {/* CRT Scanline Overlay - Fixed to viewport */}
            {!showAnimation && (
                <div className="scanlines fixed inset-0 pointer-events-none z-50 h-screen"></div>
            )}

            {showAnimation && (
                <SplitTextAnimation
                    text="Welcome to Kracked Devs"
                    onComplete={handleAnimationComplete}
                />
            )}

            {!showAnimation && (
                <>
                    {/* Hero Section with Game */}
                    <section className="relative w-full h-[90vh] min-h-[600px]">
                        <TownhallV2 />
                    </section>

                    {/* Community Map Section */}
                    <section className="relative w-full bg-black border-t border-green-900/50">
                        <CommunityMap />
                    </section>

                    {/* Live Stats Section */}
                    <section className="relative w-full bg-black border-t border-green-900/50">
                        <LiveStats />
                    </section>

                    {/* Navigation Hub */}
                    <section className="relative w-full bg-black border-t border-green-900/50">
                        <NavigationHub />
                    </section>

                    {/* Job Preview Section */}
                    <section className="relative w-full bg-black/90 border-t border-green-900/50">
                        <JobPreview />
                    </section>

                    {/* Brand CTA Section */}
                    <section className="relative w-full">
                        <BrandCTA />
                    </section>
                </>
            )}
        </main>
    );
}
