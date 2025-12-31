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

export function ContributionStatsCard({ stats, isLoading = false, isOwnProfile = false, xp, level }: ContributionStatsProps) {
    if (isLoading) {
        return <StatsSkeleton />;
    }

    const currentStreak = stats?.currentStreak || 0;
    const longestStreak = stats?.longestStreak || 0;
    const contributionsThisWeek = stats?.contributionsThisWeek || 0;

    // Use passed props, fallback to stats (if any), fallback to defaults
    const displayXP = xp ?? stats?.xp ?? 0;
    const displayLevel = level ?? stats?.level ?? 1;

    // Even if stats is null, we might want to show Level/XP if isOwnProfile or we have data
    // But the original code showed a "Connect GitHub" CTA if stats was null.
    // We should probably show the Level/XP card ALWAYS if we have that data, 
    // and the "Connect GitHub" CTA in place of the stats grid if stats is null.

    return (
        <div className="space-y-4 w-full">
            {/* Player Level & XP - Always show if we have data or it's own profile */}
            <div className="bg-card/40 backdrop-blur-sm border border-neon-primary/30 rounded-xl p-4 flex items-center justify-between relative overflow-hidden group hover:border-neon-primary/60 transition-colors">
                <div className="absolute inset-0 bg-neon-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-3 relative z-10">
                    <div className="p-2 rounded-lg bg-neon-primary/10 text-neon-primary">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Player Level</div>
                        <div className="text-2xl font-bold font-mono text-foreground leading-none">
                            Lvl. {displayLevel}
                        </div>
                    </div>
                </div>

                <div className="text-right relative z-10">
                    <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Experience</div>
                    <div className="text-xl font-bold font-mono text-neon-primary">
                        {displayXP} <span className="text-xs text-muted-foreground">XP</span>
                    </div>
                </div>
            </div>

            {/* Contribution Grid or Fallback */}
            {!stats ? (
                isOwnProfile ? (
                    <div className="w-full bg-card/40 border border-border rounded-xl p-6 text-center space-y-3 backdrop-blur-md">
                        <p className="text-muted-foreground font-mono text-sm">
                            Connect GitHub to track your contribution streaks.
                        </p>
                        <button
                            onClick={() => {
                                // eslint-disable-next-line @typescript-eslint/no-var-requires
                                const { createClient } = require("@/lib/supabase/client");
                                const supabase = createClient();
                                supabase.auth.signInWithOAuth({
                                    provider: 'github',
                                    options: {
                                        redirectTo: `${window.location.origin}/auth/callback?next=/profile`
                                    }
                                });
                            }}
                            className="px-4 py-2 bg-muted/50 hover:bg-muted border border-border rounded-lg text-xs font-mono text-foreground transition-colors"
                        >
                            Connect GitHub Account
                        </button>
                    </div>
                ) : (
                    <div className="w-full bg-card/40 border border-border rounded-xl p-6 text-center space-y-3 backdrop-blur-md">
                        <p className="text-muted-foreground font-mono text-sm">
                            No contribution data available for this user.
                        </p>
                    </div>
                )
            ) : (
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
                        glow={true}
                    />
                </div>
            )}
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

    // Map color names to CSS vars for theme compatibility
    const glowColorVar = {
        "--glow-color": color === 'orange' ? 'var(--neon-accent)' : color === 'yellow' ? 'var(--neon-secondary)' : 'var(--neon-primary)'
    } as React.CSSProperties;

    // Use theme-aware classes
    const colorClasses = {
        orange: "text-rank-bronze",
        yellow: "text-rank-gold",
        green: "text-neon-primary"
    };

    const borderClasses = {
        orange: "border-rank-bronze/30",
        yellow: "border-rank-gold/30",
        green: "border-neon-primary/30"
    };

    const glowStyle = glow ? {
        boxShadow: `0 0 20px -5px var(--glow-color)`
    } : {};

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "relative overflow-hidden bg-card/40 backdrop-blur-sm border rounded-xl p-4 flex flex-row md:flex-col items-center justify-between md:justify-center group hover:bg-muted/5 transition-colors duration-300",
                borderClasses[color]
            )}
            style={{
                ...glowStyle,
                ...glowColorVar
            }}
        >
            <div className={cn("p-2 rounded-full bg-foreground/5 mb-0 md:mb-3", colorClasses[color])}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>

            <div className="text-right md:text-center">
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
                    {label}
                </div>
                <div className="flex items-baseline justify-end md:justify-center gap-1">
                    <span className={cn("text-2xl md:text-3xl font-bold font-mono", colorClasses[color])}>
                        {value}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
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
                <div key={i} className="h-24 bg-muted/50 rounded-xl border border-border"></div>
            ))}
        </div>
    );
}
