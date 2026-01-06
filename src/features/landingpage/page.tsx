"use client";

import { LeaderboardWidget } from "./components/dashboard/leaderboard-widget";
import { CommunityMapWidget } from "./components/dashboard/community-map-widget";
import { BountyBoard } from "./components/dashboard/bounty-board";
import { JobBoardWidget } from "./components/dashboard/job-board-widget";
import { TownhallPreview } from "./components/dashboard/townhall-preview";

import { useLandingSequence } from "./hooks/use-landing-sequence";
import { ParallaxIntro } from "./components/parallax-intro";
import { ManifestoModal } from "@/components/ManifestoModal";
import { useState, useEffect } from "react";
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
        localStorage.setItem("kd_manifesto_seen", "true");
        setManifestoOpen(false);
    };

    if (showAnimation) {
        return <ParallaxIntro onComplete={handleAnimationComplete} />;
    }

    return (
        <div className="min-h-screen w-full flex flex-col font-mono antialiased overflow-x-hidden">
            <main className="flex-grow p-4 lg:p-4 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-x-hidden max-w-[1700px] mx-auto w-full">
                {/* ROW 1: Leaderboard (1) & Map (3) */}
                <div className="md:col-span-3 min-h-[500px]">
                    <LeaderboardWidget />
                </div>
                <div className="md:col-span-9 min-h-[500px]">
                    <CommunityMapWidget
                        initialLocations={initialLocations}
                    />
                </div>

                {/* ROW 2: Townhall (1), Bounty Board (2), Job Board (1) */}
                <div className="md:col-span-3 min-h-[400px]">
                    <TownhallPreview />
                </div>
                <div className="md:col-span-6 min-h-[400px]">
                    <BountyBoard />
                </div>
                <div className="md:col-span-3 min-h-[400px]">
                    <JobBoardWidget />
                </div>
            </main>

            <ManifestoModal isOpen={manifestoOpen} onClose={handleManifestoClose} />
        </div>
    );
}
