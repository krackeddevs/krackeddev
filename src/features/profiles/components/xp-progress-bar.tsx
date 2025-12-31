"use client";

import { useEffect, useState } from "react";
import { getXPProgress } from "@/features/profiles/actions";
import { XPProgress } from "@/features/profiles/xp-system";

interface XPProgressBarProps {
    showDetails?: boolean;
    compact?: boolean;
}

export function XPProgressBar({ showDetails = false, compact = false }: XPProgressBarProps) {
    const [progress, setProgress] = useState<XPProgress | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getXPProgress().then(({ data }) => {
            if (data) setProgress(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="animate-pulse h-16 bg-gray-800 rounded-lg w-full" />;
    }

    if (!progress) return null;

    return (
        <div className="xp-progress-container w-full relative">
            {/* Level Badge Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold text-lg">Level {progress.currentLevel}</span>
                </div>
                {showDetails && (
                    <div className="text-sm text-muted-foreground">
                        <span className="text-foreground">{Math.floor(progress.xpInCurrentLevel)}</span>
                        <span className="mx-1">/</span>
                        <span>{Math.floor(progress.xpForNextLevel - progress.xpForCurrentLevel)} XP</span>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-3 bg-muted/30 rounded-full overflow-hidden border border-border/50">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress.progressPercentage}%` }}
                />
                {/* Glow effect overlay */}
                <div
                    className="absolute inset-0 bg-cyan-400 opacity-20 blur-sm pointer-events-none"
                    style={{
                        width: `${progress.progressPercentage}%`,
                        boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)'
                    }}
                />
            </div>

            {showDetails && (
                <div className="flex justify-between mt-1">
                    <div className="text-xs text-muted-foreground">
                        Current XP: {progress.currentXP}
                    </div>
                    <div className="text-xs text-cyan-500/80">
                        {Math.floor(progress.xpNeededForNext)} XP to next level
                    </div>
                </div>
            )}
        </div>
    );
}
