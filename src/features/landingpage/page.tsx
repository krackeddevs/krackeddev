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


import { MiniProfile } from "./components/mini-profile";
import { MiniProfileData } from "@/features/profiles/actions";

interface LandingPageProps {
    isLoggedIn: boolean;
    miniProfileData?: MiniProfileData | null;
}

export function LandingPage({ isLoggedIn, miniProfileData }: LandingPageProps) {
    const { showAnimation, animationDone, handleAnimationComplete } = useLandingSequence();

    return (
        <main className="min-h-screen w-full bg-black relative flex flex-col">
            {/* Global Grid Overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-10 opacity-[0.15]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.4) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

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

                    {/* Floating Mini Profile - Logged In Only */}
                    {isLoggedIn && miniProfileData && (
                        <div className="fixed top-24 right-6 z-[45] hidden md:block w-[280px]">
                            <MiniProfile data={miniProfileData} />
                        </div>
                    )}

                    {/* Mobile Mini Profile (Visible only on mobile, placed above Game) */}
                    {isLoggedIn && miniProfileData && (
                        <div className="md:hidden relative w-full px-4 py-2 bg-black border-b border-green-900/50">
                            <MiniProfile data={miniProfileData} />
                        </div>
                    )}

                    {/* Hero Section Wrapper: Game & Map */}
                    {/* Mobile: flex-col-reverse (Game Top, Map Bottom) */}
                    {/* Desktop: flex-col (Map Top, Game Bottom) */}
                    <div className="flex flex-col-reverse md:flex-col w-full">
                        {/* Community Map Section */}
                        <section className="relative w-full bg-black border-t border-green-900/50">
                            <CommunityMap />
                        </section>

                        {/* Game Section */}
                        <section className="relative w-full h-auto md:h-[85vh] md:min-h-[600px] bg-black">
                            <TownhallV2 />

                            {/* Scroll Indicator */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-30">
                                <span className="text-green-400/70 text-xs font-mono mb-1">Scroll for more</span>
                                <ChevronDown className="w-6 h-6 text-green-400/70" />
                            </div>
                        </section>
                    </div>

                    {/* Live Stats Section */}
                    <section className="relative w-full bg-black border-t border-green-900/50">
                        <LiveStats />
                    </section>

                    {/* Navigation Hub */}
                    <section className="relative w-full bg-black border-t border-green-900/50">
                        <NavigationHub />
                    </section>



                    {/* Job Preview Section */}
                    <section className="relative w-full bg-black border-t border-green-900/50">
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
