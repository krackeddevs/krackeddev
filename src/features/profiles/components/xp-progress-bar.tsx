"use client";

import { useEffect, useState } from "react";
import { getXPProgress } from "@/features/profiles/actions";
import { XPProgress, calculateXPProgress } from "../utils/xp-calculations";
import { ProfileData } from "../actions";

interface XPProgressBarProps {
    showDetails?: boolean;
    compact?: boolean;
    profile?: ProfileData;
}

export function XPProgressBar({ showDetails = false, compact = false, profile }: XPProgressBarProps) {
    const [progress, setProgress] = useState<XPProgress | null>(() => {
        if (profile) {
            return calculateXPProgress(profile.xp || 0);
        }
        return null;
    });
    const [loading, setLoading] = useState(!profile);

    useEffect(() => {
        if (profile) {
            setProgress(calculateXPProgress(profile.xp || 0));
            setLoading(false);
            return;
        }

        getXPProgress().then(({ data }) => {
            if (data) setProgress(data);
            setLoading(false);
        });
    }, [profile]);

    if (loading) {
        return <div className="animate-pulse h-16 bg-gray-800 rounded-lg w-full" />;
    }

    if (!progress) return null;

    return (
        <div className="xp-progress-container w-full relative space-y-3">
            {/* Level Badge Header */}
            <div className="flex items-end justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none">Neural Progression</span>
                    <span className="text-xl font-black font-mono text-[var(--neon-cyan)] uppercase italic mt-1 leading-none">LEVEL_0{progress.currentLevel}</span>
                </div>
                {showDetails && (
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                        <span className="text-foreground font-bold">{Math.floor(progress.xpInCurrentLevel)}</span>
                        <span className="mx-1 opacity-30">/</span>
                        <span>{Math.floor(progress.xpForNextLevel - progress.xpForCurrentLevel)} UNIT_XP</span>
                    </div>
                )}
            </div>

            {/* Progress Bar - HUD Variant */}
            <div className="relative w-full h-4 bg-background border border-[var(--neon-cyan)]/20 rounded-none overflow-hidden p-0.5">
                {/* Background Grid */}
                <div className="absolute inset-0 flex justify-between px-1 opacity-10 z-0">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-[1px] h-full bg-[var(--neon-cyan)]" />
                    ))}
                </div>

                <div
                    className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] transition-all duration-1000 ease-out relative z-10 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                    style={{ width: `${progress.progressPercentage}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                </div>
            </div>

            {showDetails && (
                <div className="flex justify-between items-center bg-background/20 p-2 border border-border/10">
                    <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
                        Total Accumulation: <span className="text-foreground">{progress.currentXP}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-[var(--neon-lime)] animate-pulse" />
                        <div className="text-[9px] font-mono text-[var(--neon-lime)] uppercase tracking-widest">
                            {Math.floor(progress.xpNeededForNext)} XP_TO_NEXT_LVL
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
