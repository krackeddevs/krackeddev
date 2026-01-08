import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Flame, Trophy, Calendar } from "lucide-react";
import { ContributionStats } from "../types";

interface ContributionStatsProps {
    stats: ContributionStats | null;
    isLoading?: boolean;
    isOwnProfile?: boolean;
    xp?: number;
    level?: number;
}

export function ContributionStatsCard({ stats, isLoading = false }: ContributionStatsProps) {
    if (isLoading) {
        return <StatsSkeleton />;
    }

    const currentStreak = stats?.currentStreak || 0;
    const longestStreak = stats?.longestStreak || 0;
    const contributionsThisWeek = stats?.contributionsThisWeek || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <StatItem
                icon={Flame}
                label="Neural_Streak"
                value={currentStreak}
                unit="CYCLES"
                color="orange"
                glow={currentStreak > 0}
            />
            <StatItem
                icon={Trophy}
                label="Peak_Uptime"
                value={longestStreak}
                unit="CYCLES"
                color="yellow"
                glow={longestStreak > 5}
            />
            <StatItem
                icon={Calendar}
                label="Sector_Activity"
                value={contributionsThisWeek}
                unit="SIGNAL_OPS"
                color="green"
                glow={true}
            />
        </div>
    );
}

function StatItem({
    icon: Icon,
    label,
    value,
    unit,
    color,
    glow
}: {
    icon: any,
    label: string,
    value: number,
    unit: string,
    color: "orange" | "yellow" | "green",
    glow: boolean
}) {
    const colorVar = color === 'orange' ? 'var(--neon-purple)' : color === 'yellow' ? 'var(--neon-purple)' : 'var(--neon-cyan)';
    const textColor = color === 'orange' ? 'text-[var(--neon-purple)]' : color === 'yellow' ? 'text-[var(--neon-purple)]' : 'text-[var(--neon-cyan)]';

    return (
        <div
            className={cn(
                "relative overflow-hidden bg-background/30 border border-foreground/10 p-4 flex flex-col items-start gap-4 group transition-all duration-300",
                color === 'green'
                    ? "hover:border-[var(--neon-cyan)]/30 hover:shadow-[0_0_20px_rgba(var(--neon-cyan-rgb),0.05)]"
                    : "hover:border-[var(--neon-purple)]/30 hover:shadow-[0_0_20px_rgba(var(--neon-purple-rgb),0.05)]"
            )}
        >
            <div className="absolute top-0 right-0 p-1 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-12 h-12" />
            </div>

            <div className="space-y-1">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                    {label}
                </div>
                <div className="flex items-baseline gap-2">
                    <span className={cn("text-3xl font-black font-mono tracking-tighter", textColor)}>
                        {value < 10 ? `0${value}` : value}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase opacity-40">
                        {unit}
                    </span>
                </div>
            </div>

            <div
                className="absolute bottom-0 left-0 h-[2px] bg-current transition-all duration-500"
                style={{
                    width: glow ? '100%' : '10%',
                    backgroundColor: colorVar,
                    boxShadow: glow ? `0 0 10px ${colorVar}` : 'none'
                }}
            />
        </div>
    );
}

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full animate-pulse">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted/50 rounded-xl border border-border"></div>
            ))}
        </div>
    );
}
