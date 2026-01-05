"use client";

import "@/styles/jobs.css";
import dynamic from "next/dynamic";
import { ParallaxIntro } from "./components/parallax-intro";
import { useLandingSequence } from "./hooks/use-landing-sequence";

import { BrandCTA } from "./components/brand-cta";
import { LiveStats } from "./components/live-stats";
import { CommunityMap } from "./components/community-map";

const JobPreview = dynamic(() => import("./components/job-preview").then(mod => mod.JobPreview), { ssr: false });
const NavigationHub = dynamic(() => import("./components/navigation-hub").then(mod => mod.NavigationHub), { ssr: false });
const BottomSocialNav = dynamic(() => import("./components/bottom-social-nav").then(mod => mod.BottomSocialNav), { ssr: false });
const FloatingNav = dynamic(() => import("./components/floating-nav").then(mod => mod.FloatingNav), { ssr: false });
import { ManifestoModal } from "@/components/ManifestoModal";
import Link from "next/link";
import { Users, Building2, ScrollText, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";


import { MiniProfile } from "./components/mini-profile";
import { MiniProfileData } from "@/features/profiles/actions";

import { LandingStats, LocationData } from "@/lib/hooks/use-landing-data";

interface LandingPageProps {
    isLoggedIn: boolean;
    miniProfileData?: MiniProfileData | null;
    initialStats?: LandingStats | null;
    initialLocations?: LocationData[];
}

export function LandingPage({
    isLoggedIn,
    miniProfileData,
    initialStats,
    initialLocations
}: LandingPageProps) {
    const { showAnimation, animationDone, handleAnimationComplete } = useLandingSequence();
    const [manifestoOpen, setManifestoOpen] = useState(false);

    useEffect(() => {
        // Auto-open logic for first time visitors
        if (!isLoggedIn) return;

        const MANIFESTO_STORAGE_KEY = "kd_manifesto_seen";
        const seen = localStorage.getItem(MANIFESTO_STORAGE_KEY);

        if (!seen) {
            const timer = setTimeout(() => {
                setManifestoOpen(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isLoggedIn]);

    const handleManifestoClose = () => {
        const MANIFESTO_STORAGE_KEY = "kd_manifesto_seen";
        localStorage.setItem(MANIFESTO_STORAGE_KEY, "true");
        setManifestoOpen(false);
    };

    return (
        <main className="min-h-screen w-full relative flex flex-col">
            {/* Global Grid Overlay Removed (Handled by globals.css) */}

            {/* Parallax Intro with Loading, Parallax Layers, and Start Button */}
            {showAnimation && (
                <ParallaxIntro onComplete={handleAnimationComplete} />
            )}

            {!showAnimation && (
                <>
                    {/* Manifesto Modal - Shows once for new visitors, only after parallax intro */}
                    <ManifestoModal
                        isOpen={manifestoOpen}
                        onClose={handleManifestoClose}
                    />

                    {/* Floating Mini Profile - Logged In Only */}
                    {isLoggedIn && miniProfileData && (
                        <div className="fixed top-24 right-6 z-[45] hidden md:block w-[280px]">
                            <MiniProfile data={miniProfileData} />
                        </div>
                    )}

                    {/* Mobile Mini Profile (Visible only on mobile, placed above Game) */}
                    {isLoggedIn && miniProfileData && (
                        <div className="md:hidden relative w-full px-4 py-2 border-b border-green-900/50">
                            <MiniProfile data={miniProfileData} />
                        </div>
                    )}

                    {/* Hero Section Wrapper: Game & Map */}
                    {/* Mobile: flex-col-reverse (Game Top, Map Bottom) */}
                    {/* Desktop: flex-col (Map Top, Game Bottom) */}
                    <div className="flex flex-col-reverse md:flex-col w-full">
                        <section className="relative w-full border-t border-green-900/50">
                            <CommunityMap initialData={initialLocations} />
                        </section>

                        {/* Game Section (Hidden for now) */}
                        {/* <section className="relative w-full h-auto md:h-[85vh] md:min-h-[600px]">
                            <TownhallV2 />

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-30">
                                <span className="text-green-400/70 text-xs font-mono mb-1">Scroll for more</span>
                                <ChevronDown className="w-6 h-6 text-green-400/70" />
                            </div>
                        </section> */}
                    </div>

                    {/* Live Stats Section */}
                    <section className="relative w-full border-t border-green-900/50">
                        <LiveStats initialData={initialStats} />
                    </section>

                    {/* Navigation Hub */}
                    <section className="relative w-full border-t border-green-900/50">
                        <NavigationHub />
                    </section>

                    {/* Job Preview Section */}
                    <section className="relative w-full border-t border-green-900/50">
                        <JobPreview />
                    </section>

                    {/* Collapsible Floating Navigation - Desktop Only */}
                    <FloatingNav onOpenManifesto={() => setManifestoOpen(true)} />

                    {/* Bottom Social Navigation - Mobile/Tablet Only */}
                    <BottomSocialNav onOpenManifesto={() => setManifestoOpen(true)} />
                </>
            )}
        </main>
    );
}
