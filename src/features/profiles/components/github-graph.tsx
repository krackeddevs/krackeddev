"use client";

import React from "react";
import { GithubContributionWeek } from "../types";
import { cn } from "@/lib/utils";
import { Grid } from "lucide-react";

interface GithubGraphProps {
    data: GithubContributionWeek[];
    totalContributions: number;
    className?: string; // Allow external styling overrides
}

export function GithubGraph({ data, totalContributions, className }: GithubGraphProps) {
    if (!data || data.length === 0) return null;

    // We show more history for the matrix to look impressive, 
    // but typically keep it to ~20-25 weeks for mobile/desktop balance or full year if space permits.
    // The previous implementation used 20. Let's keep 20 but make it look denser.
    const recentWeeks = data.slice(-24);

    return (
        <div className={cn("w-full bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md shadow-sm", className)}>
            {/* Header matching DevPulse */}
            <div className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-white/5 gap-4">
                <div className="flex items-center gap-2">
                    <Grid className="w-5 h-5 text-neon-primary" />
                    <span className="font-mono font-bold text-white tracking-tight uppercase text-sm">Contribution Matrix</span>
                </div>

                <div className="flex bg-white/5 p-1 rounded-lg">
                    <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <span className="text-neon-primary font-bold">{totalContributions}</span> CYCLES
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 relative bg-black/20 flex justify-center items-center min-h-[160px]">
                {/* Grid Background Effect */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

                <div className="flex gap-1.5 justify-end overflow-hidden z-10">
                    {recentWeeks.map((week, wIndex) => (
                        <div key={wIndex} className="flex flex-col gap-1.5">
                            {week.contributionDays.map((day, dIndex) => {
                                const hasContribution = day.contributionCount > 0;
                                // Calculate intensity for opacity: 0 -> 0.1, Max -> 1.0
                                // Cap at 1.0. Assume ~5-10 commits is "high" day.
                                const intensity = hasContribution
                                    ? Math.min(0.3 + (day.contributionCount * 0.15), 1)
                                    : 0.05;

                                return (
                                    <div
                                        key={`${wIndex}-${dIndex}`}
                                        className={cn(
                                            "w-3.5 h-3.5 rounded-[2px] transition-all duration-300",
                                            hasContribution
                                                ? "bg-neon-primary shadow-[0_0_4px_rgba(34,197,94,0.3)] hover:shadow-[0_0_8px_rgba(34,197,94,0.6)] hover:scale-110"
                                                : "bg-white/5 hover:bg-white/10"
                                        )}
                                        style={{
                                            opacity: intensity
                                        }}
                                        title={`${day.contributionCount} contributions on ${day.date}`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.2)_100%)]" />
            </div>
        </div>
    );
}
