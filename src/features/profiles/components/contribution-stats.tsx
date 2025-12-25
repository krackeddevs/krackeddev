"use client";

import { motion } from "framer-motion";
import { Flame, Trophy, Calendar } from "lucide-react";
import { ContributionStats } from "../types";

interface ContributionStatsProps {
    stats: ContributionStats | null;
    isLoading?: boolean;
}

export function ContributionStatsCard({ stats, isLoading = false }: ContributionStatsProps) {
    if (isLoading) {
        return <StatsSkeleton />;
    }

    // Fallback for empty stats (e.g. no GitHub connected)
    if (!stats) {
        return (
            <div className="w-full bg-black/40 border border-white/10 rounded-xl p-6 text-center space-y-3 backdrop-blur-md">
                <p className="text-gray-400 font-mono text-sm">
                    Connect GitHub to track your contribution streaks.
                </p>
                <button
                    onClick={() => {
                        const { createClient } = require("@/lib/supabase/client");
                        const supabase = createClient();
                        supabase.auth.signInWithOAuth({
                            provider: 'github',
                            options: {
                                redirectTo: `${window.location.origin}/auth/callback?next=/profile`
                            }
                        });
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-white transition-colors"
                >
                    Connect GitHub Account
                </button>
            </div>
        );
    }

    const { currentStreak, longestStreak, contributionsThisWeek } = stats;

    return (
        <div className="space-y-4 w-full">
            {/* Player Level & XP */}
            <div className="bg-black/80 backdrop-blur-sm border border-neon-primary/30 rounded-xl p-4 flex items-center justify-between relative overflow-hidden group hover:border-neon-primary/60 transition-colors">
                <div className="absolute inset-0 bg-neon-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-3 relative z-10">
                    <div className="p-2 rounded-lg bg-neon-primary/10 text-neon-primary">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Player Level</div>
                        <div className="text-2xl font-bold font-mono text-white leading-none">
                            Lvl. {stats.level || 1}
                        </div>
                    </div>
                </div>

                <div className="text-right relative z-10">
                    <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Experience</div>
                    <div className="text-xl font-bold font-mono text-neon-primary">
                        {stats.xp || 0} <span className="text-xs text-muted-foreground">XP</span>
                    </div>
                </div>
            </div>

            {/* Contribution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatItem
                    icon={Flame}
                    label="Current Streak"
                    value={currentStreak}
                    unit="days"
                    color="orange" // Fire color
                    glow={currentStreak > 0}
                />
                <StatItem
                    icon={Trophy}
                    label="Longest Streak"
                    value={longestStreak}
                    unit="days"
                    color="yellow" // Gold color
                    glow={longestStreak > 5}
                />
                <StatItem
                    icon={Calendar}
                    label="This Week"
                    value={contributionsThisWeek}
                    unit="commits"
                    color="green" // Standard green
                    glow={contributionsThisWeek > 0}
                />
            </div>
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

    const colorClasses = {
        orange: "text-orange-500",
        yellow: "text-yellow-400",
        green: "text-green-500"
    };

    const borderClasses = {
        orange: "border-orange-500/30",
        yellow: "border-yellow-500/30",
        green: "border-green-500/30"
    };

    const glowStyle = glow ? {
        boxShadow: `0 0 20px -5px var(--glow-color)`
    } : {};

    // Map color names to hex for CSS var
    const glowColorVar = {
        "--glow-color": color === 'orange' ? '#f97316' : color === 'yellow' ? '#facc15' : '#22c55e'
    } as React.CSSProperties;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
        relative overflow-hidden
        bg-black/80 backdrop-blur-sm
        border ${borderClasses[color]}
        rounded-xl p-4
        flex flex-row md:flex-col items-center justify-between md:justify-center
        group hover:bg-white/5 transition-colors duration-300
      `}
            style={{
                ...glowStyle,
                ...glowColorVar
            }}
        >
            <div className={`p-2 rounded-full bg-white/5 mb-0 md:mb-3 ${colorClasses[color]}`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>

            <div className="text-right md:text-center">
                <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                    {label}
                </div>
                <div className="flex items-baseline justify-end md:justify-center gap-1">
                    <span className={`text-2xl md:text-3xl font-bold font-mono ${colorClasses[color]}`}>
                        {value}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                        {unit}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full animate-pulse">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-900/50 rounded-xl border border-gray-800"></div>
            ))}
        </div>
    );
}
