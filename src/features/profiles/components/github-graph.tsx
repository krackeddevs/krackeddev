"use client";

import React from "react";
import { format, parseISO, startOfMonth, subMonths, isSameMonth } from "date-fns";
import { GithubContributionWeek } from "../types";
import { cn } from "@/lib/utils";
import { Grid } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GithubGraphProps {
    data: GithubContributionWeek[];
    totalContributions: number;
    className?: string;
}

export function GithubGraph({ data, totalContributions, className }: GithubGraphProps) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Show exactly 12 distinct months (Current month + previous 11)
    const weeks = React.useMemo(() => {
        if (!data || data.length === 0) return [];

        const now = new Date();
        const startOf12MonthsAgo = startOfMonth(subMonths(now, 11));

        const startIndex = data.findIndex(week =>
            week.contributionDays.length > 0 &&
            parseISO(week.contributionDays[0].date) >= startOf12MonthsAgo
        );

        return startIndex === -1 ? data.slice(-52) : data.slice(startIndex);
    }, [data]);

    if (!data || data.length === 0) return null;

    // Standardize week widths for different screens
    const weekWidthMobile = 6;
    const weekWidthDesktop = 14;

    // Calculate month labels
    const monthLabels = React.useMemo(() => {
        const labels: { label: string; index: number }[] = [];
        weeks.forEach((week, index) => {
            if (week.contributionDays.length > 0) {
                const date = parseISO(week.contributionDays[0].date);
                const label = format(date, "MMM").toUpperCase();

                if (labels.length === 0 || (labels[labels.length - 1].label !== label && index - labels[labels.length - 1].index > 2)) {
                    labels.push({ label, index });
                }
            }
        });
        return labels;
    }, [weeks]);

    return (
        <div className={cn("bg-background/20 border border-[var(--neon-cyan)]/20 rounded-none overflow-hidden backdrop-blur-md relative group", className)}>
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--neon-cyan)]/40 z-30" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--neon-cyan)]/40 z-30" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--neon-cyan)]/40 z-30" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--neon-cyan)]/40 z-30" />

            <div className="p-4 sm:p-6">
                <div className="w-full">
                    <div className="flex flex-col items-start w-full">
                        {/* Month labels row */}
                        <div className="flex mb-1 sm:mb-2 h-4 w-full">
                            <div className="w-6 sm:w-8 shrink-0" /> {/* Spacer to align with day labels */}
                            <div className="flex-1 relative h-full">
                                {monthLabels.map((ml, i) => (
                                    <span
                                        key={i}
                                        className="absolute text-[6px] sm:text-[9px] text-muted-foreground font-mono transition-all duration-300 whitespace-nowrap font-bold opacity-60"
                                        style={{
                                            left: `${(ml.index / weeks.length) * 100}%`
                                        }}
                                    >
                                        {ml.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex w-full">
                            {/* Day labels column */}
                            <div className="flex flex-col justify-between text-[6px] sm:text-[9px] text-muted-foreground font-mono py-[1px] h-[40px] sm:h-[105px] w-6 sm:w-8 shrink-0 text-right pr-1 sm:pr-2 font-bold opacity-60">
                                <span></span>
                                <span>MON</span>
                                <span></span>
                                <span>WED</span>
                                <span></span>
                                <span>FRI</span>
                                <span></span>
                            </div>

                            {/* The Grid */}
                            <div
                                className="flex-1 grid gap-[1px] sm:gap-[3px]"
                                style={{
                                    gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
                                    width: '100%'
                                }}
                            >
                                {weeks.map((week, wIndex) => (
                                    <div key={wIndex} className="flex flex-col gap-[1px] sm:gap-[3px]">
                                        {week.contributionDays.map((day, dIndex) => {
                                            const hasContribution = day.contributionCount > 0;

                                            let bgColor = "rgba(var(--neon-cyan-rgb), 0.05)";
                                            if (hasContribution) {
                                                const count = day.contributionCount;
                                                if (count <= 2) bgColor = "rgba(var(--neon-cyan-rgb), 0.3)";
                                                else if (count <= 5) bgColor = "rgba(var(--neon-cyan-rgb), 0.6)";
                                                else if (count <= 10) bgColor = "var(--neon-lime)";
                                                else bgColor = "var(--neon-lime)";
                                            }

                                            return (
                                                <div
                                                    key={`${wIndex}-${dIndex}`}
                                                    className={cn(
                                                        "w-full aspect-square rounded-none transition-all duration-200",
                                                        hasContribution && "hover:invert hover:z-20 cursor-crosshair scale-110"
                                                    )}
                                                    style={{
                                                        backgroundColor: bgColor,
                                                        boxShadow: hasContribution && day.contributionCount > 8 ? `0 0 10px ${bgColor}` : 'none',
                                                        border: hasContribution ? 'none' : '1px solid currentColor',
                                                        opacity: hasContribution ? 1 : 0.08
                                                    }}
                                                    title={`${day.contributionCount} cycles on ${day.date}`}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Telemetry Data */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[var(--neon-cyan)]/10 pt-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-[var(--neon-lime)] animate-ping" />
                        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                            Node Frequency: <span className="text-foreground">STABLE</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                        <span className="opacity-40">INTENSITY</span>
                        <div className="flex gap-1.5">
                            <div className="w-[10px] h-[10px] bg-[var(--neon-cyan)]/5 border border-[var(--neon-cyan)]/20" />
                            <div className="w-[10px] h-[10px] bg-[var(--neon-cyan)]/20" />
                            <div className="w-[10px] h-[10px] bg-[var(--neon-cyan)]/60 shadow-[0_0_5px_rgba(34,211,238,0.3)]" />
                            <div className="w-[10px] h-[10px] bg-[var(--neon-lime)]/80" />
                            <div className="w-[10px] h-[10px] bg-[var(--neon-lime)] shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
