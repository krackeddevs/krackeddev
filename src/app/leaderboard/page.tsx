import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { fetchLeaderboard, getUserRank } from "@/features/profiles/actions";
import { LeaderboardTabs } from "@/features/profiles/components/leaderboard-tabs";
import { Trophy } from "lucide-react";

import { CommunitySubNav } from "@/features/community/components/shared/community-sub-nav";

// Cache for 1 hour to balance freshness and performance
export const revalidate = 3600;

export default async function LeaderboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Phase 4 Optimization: Only fetch priority data for initial render
    // Other tabs will load progressively when user clicks on them
    const [
        { data: allTimeData },
        userRank
    ] = await Promise.all([
        fetchLeaderboard('all-time', undefined, 30), // Most commonly viewed
        user ? getUserRank(user.id) : null
    ]);

    return (
        <div className="min-h-screen pb-12 relative transition-colors duration-300">
            <CommunitySubNav />
            <main className="container mx-auto px-4 py-8 space-y-12">
                {/* Header */}
                <div className="text-center space-y-6 mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--neon-primary)]/10 border border-[var(--neon-primary)]/20 rounded-none mb-2">
                        <Trophy className="w-3 h-3 text-[var(--neon-primary)]" />
                        <span className="text-[10px] font-bold font-mono text-[var(--neon-primary)] tracking-[0.2em] uppercase">ELITE OPERATIVES</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground font-mono uppercase leading-none">
                        GLOBAL <br className="sm:hidden" /> RANKINGS
                    </h1>
                    <p className="text-foreground/40 font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase max-w-2xl mx-auto leading-relaxed">
                        Competing for glory, bounties, and infinite recursive loops in the Kracked network.
                    </p>
                </div>

                {/* Your Rank - Refined Industrial Display */}
                {user && userRank?.global_rank && (
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex items-center gap-6 px-8 py-4 bg-card/40 border border-border/50 backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--neon-primary)] shadow-[0_0_15px_var(--neon-primary)]" />

                            <div className="flex flex-col items-start gap-0.5">
                                <span className="text-[9px] font-mono text-foreground/40 uppercase tracking-widest">Global Rank</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-foreground font-mono tracking-tighter">#{userRank.global_rank}</span>
                                    <span className="text-[10px] text-foreground/20 font-mono">/ {userRank.total_users}</span>
                                </div>
                            </div>

                            <div className="h-10 w-px bg-border/20 mx-2" />

                            <div className="flex flex-col items-start gap-1">
                                <span className="text-[9px] font-mono text-foreground/40 uppercase tracking-widest">Percentile</span>
                                <div className="text-xs font-bold text-[var(--neon-primary)] font-mono uppercase tracking-widest bg-[var(--neon-primary)]/10 px-2 py-0.5">
                                    TOP {Math.round((userRank.global_rank / userRank.total_users) * 100)}%
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Leaderboard Tabs - Progressive Loading */}
                <div className="max-w-5xl mx-auto">
                    <LeaderboardTabs
                        initialAllTimeData={allTimeData || []}
                        currentUserId={user?.id}
                    />
                </div>
            </main>
        </div>
    );
}
