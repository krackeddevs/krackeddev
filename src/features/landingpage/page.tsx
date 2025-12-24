"use client";

import "@/styles/jobs.css";
import { ParallaxIntro } from "./components/parallax-intro";
import { TownhallV2 } from "./components/townhall";
import { useLandingSequence } from "./hooks/use-landing-sequence";

import { BrandCTA } from "./components/brand-cta";
import { LiveStats } from "./components/live-stats";
import { JobPreview } from "./components/job-preview";
import { NavigationHub } from "./components/navigation-hub";
import { CommunityMap } from "./components/community-map";
import { ManifestoModal } from "@/components/ManifestoModal";
import Link from "next/link";
import { Users, ChevronDown } from "lucide-react";

interface LandingPageProps {
    isLoggedIn: boolean;
}

export function LandingPage({ isLoggedIn }: LandingPageProps) {
    const { showAnimation, animationDone, handleAnimationComplete } = useLandingSequence();

    return (
        <main className="min-h-screen w-full bg-gray-900 relative flex flex-col">
            {/* CRT Scanline Overlay - Fixed to viewport */}
            {!showAnimation && (
                <div className="scanlines fixed inset-0 pointer-events-none z-40 h-screen"></div>
            )}

            {/* Parallax Intro with Loading, Parallax Layers, and Start Button */}
            {showAnimation && (
                <ParallaxIntro onComplete={handleAnimationComplete} />
            )}

            {!showAnimation && (
                <>
                    {/* Manifesto Modal - Shows once for new visitors, only after parallax intro */}
                    <ManifestoModal isLoggedIn={isLoggedIn} />

                    {/* Hero Section with Game */}
                    <section className="relative w-full h-[90vh] min-h-[600px]">
                        <TownhallV2 />

                        {/* Scroll Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-30">
                            <span className="text-green-400/70 text-xs font-mono mb-1">Scroll for more</span>
                            <ChevronDown className="w-6 h-6 text-green-400/70" />
                        </div>
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

                    {/* Floating Members Button - Above Manifesto on left */}
                    <Link
                        href="/members"
                        className="fixed bottom-20 left-6 flex items-center gap-2 px-4 py-3 bg-gray-900/90 hover:bg-gray-800 border-2 border-green-500/50 hover:border-green-400 rounded-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] font-mono text-sm z-40"
                    >
                        <Users className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 hidden sm:inline">Community</span>
                    </Link>
                </>
            )}
        </main>
    );
}
