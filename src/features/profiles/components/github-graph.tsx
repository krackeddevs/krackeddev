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
    // This prevents "Jan" appearing at both the start and end.
    const weeks = React.useMemo(() => {
        if (!data || data.length === 0) return [];

        const now = new Date();
        const startOf12MonthsAgo = startOfMonth(subMonths(now, 11));

        // Find the index of the week that contains or follows twelveMonthsAgo
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
                // We show a month label if it's the first week of that month in our data
                const label = format(date, "MMM");

                if (labels.length === 0 || (labels[labels.length - 1].label !== label && index - labels[labels.length - 1].index > 2)) {
                    labels.push({ label, index });
                }
            }
        });
        return labels;
    }, [weeks]);

    return (
        <Card className={cn("bg-card/40 border-border backdrop-blur-md overflow-hidden shadow-sm", className)}>
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Grid className="w-4 h-4 sm:w-5 sm:h-5 text-neon-primary" />
                        <span className="font-mono font-bold text-foreground tracking-tight uppercase text-xs sm:text-sm">Contribution Matrix</span>
                    </div>
                    <Badge variant="outline" className="font-mono text-[9px] sm:text-[10px] border-neon-primary/30 text-neon-primary">
                        {totalContributions} CYCLES
                    </Badge>
                </div>

                <div className="relative w-full flex justify-center sm:justify-start">
                    <div className="relative flex flex-col items-start w-fit pr-4">
                        <div className="relative pb-2 scrollbar-hide">
                            <div className="flex flex-col items-center sm:items-start">
                                {/* Month labels row */}
                                <div className="flex ml-7 sm:ml-8 mb-1 sm:mb-2 h-4 relative w-full">
                                    {monthLabels.map((ml, i) => (
                                        <span
                                            key={i}
                                            className="absolute text-[8px] sm:text-[10px] text-muted-foreground font-mono transition-all duration-300 whitespace-nowrap"
                                            style={{
                                                left: mounted && window.innerWidth < 640
                                                    ? `${ml.index * weekWidthMobile}px`
                                                    : `${ml.index * weekWidthDesktop}px`
                                            }}
                                        >
                                            {ml.label}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-1 sm:gap-2">
                                    {/* Day labels column */}
                                    <div className="flex flex-col justify-between text-[8px] sm:text-[10px] text-muted-foreground font-mono py-[1px] h-[50px] sm:h-[105px] w-6 shrink-0 text-right pr-1 sm:pr-2">
                                        <span></span>
                                        <span>Mon</span>
                                        <span></span>
                                        <span>Wed</span>
                                        <span></span>
                                        <span>Fri</span>
                                        <span></span>
                                    </div>

                                    {/* The Grid */}
                                    <div className="flex gap-[1px] sm:gap-1">
                                        {weeks.map((week, wIndex) => (
                                            <div key={wIndex} className="flex flex-col gap-[1px] sm:gap-1">
                                                {week.contributionDays.map((day, dIndex) => {
                                                    const hasContribution = day.contributionCount > 0;

                                                    let bgColor = "rgba(255, 255, 255, 0.05)";
                                                    if (hasContribution) {
                                                        const count = day.contributionCount;
                                                        if (count <= 2) bgColor = "rgba(0, 255, 65, 0.2)";
                                                        else if (count <= 5) bgColor = "rgba(0, 255, 65, 0.45)";
                                                        else if (count <= 10) bgColor = "rgba(0, 255, 65, 0.75)";
                                                        else bgColor = "rgba(0, 255, 65, 1)";
                                                    }

                                                    return (
                                                        <div
                                                            key={`${wIndex}-${dIndex}`}
                                                            className={cn(
                                                                "w-[5px] h-[5px] sm:w-[10px] sm:h-[10px] rounded-[1px] sm:rounded-[2px] transition-all duration-200",
                                                                hasContribution && "hover:scale-125 hover:z-20 cursor-pointer"
                                                            )}
                                                            style={{
                                                                backgroundColor: bgColor,
                                                                boxShadow: hasContribution && day.contributionCount > 8 ? `0 0 4px ${bgColor}` : 'none'
                                                            }}
                                                            title={`${day.contributionCount} contributions on ${day.date}`}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer with Legend */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <a
                        href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] sm:text-[10px] text-muted-foreground hover:text-neon-primary transition-colors font-mono text-center sm:text-left underline decoration-muted-foreground/30 underline-offset-2"
                    >
                        Learn how we count contributions
                    </a>

                    <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-muted-foreground font-mono">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[1px] bg-white/5" />
                            <div className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[1px] bg-[rgba(0,255,65,0.2)]" />
                            <div className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[1px] bg-[rgba(0,255,65,0.45)]" />
                            <div className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[1px] bg-[rgba(0,255,65,0.75)]" />
                            <div className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[1px] bg-[rgba(0,255,65,1)]" />
                        </div>
                        <span>More</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
