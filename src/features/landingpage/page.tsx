"use client";

import { useSupabase } from "@/context/SupabaseContext";
import "@/styles/jobs.css";
import { useEffect } from "react";
import SplitTextAnimation from "./components/hero-animation";
import { TownhallV2 } from "./components/townhall";
import { useLandingSequence } from "./hooks/use-landing-sequence";

import { BrandCTA } from "./components/brand-cta";
import { LiveStats } from "./components/live-stats";
import { JobPreview } from "./components/job-preview";
import { NavigationHub } from "./components/navigation-hub";

export function LandingPage() {
    const { isAuthenticated, loading, openLoginModal } = useSupabase();
    const { showAnimation, animationDone, handleAnimationComplete } = useLandingSequence();

    // Auto-open login modal when animation is done and user is not authenticated
    useEffect(() => {
        if (animationDone && !loading && !isAuthenticated) {
            // Small delay to let the town render first
            const timer = setTimeout(() => {
                openLoginModal();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [animationDone, loading, isAuthenticated, openLoginModal]);

    return (
        <main className="min-h-screen w-full bg-gray-900 relative flex flex-col">
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

                    {/* Live Stats Section */}
                    <section className="relative w-full bg-black border-t border-green-900/50">
                        <LiveStats />
                    </section>

                    {/* Navigation Hub */}
                    <section className="relative w-full bg-black border-t border-green-900/50">
                        <div className="absolute inset-0 bg-[url('/grid-pixel.png')] opacity-5 pointer-events-none" />
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
