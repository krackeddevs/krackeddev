import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { fetchLeaderboard, getUserRank, fetchTopHunters, fetchActiveContributors } from "@/features/profiles/actions";
import { LeaderboardTabs } from "@/features/profiles/components/leaderboard-tabs";
import { Trophy } from "lucide-react";
import { YourRankWidget } from "@/features/profiles/components/your-rank-widget";

import { CommunitySubNav } from "@/features/community/components/shared/community-sub-nav";

// Cache for 1 hour to balance freshness and performance
export const revalidate = 3600;

export default async function LeaderboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch all leaderboard data in parallel
    const [
        { data: allTimeData },
        { data: weeklyData },
        { data: topHunters },
        { data: activeContributors },
        userRank
    ] = await Promise.all([
        fetchLeaderboard('all-time', undefined, 100),
        fetchLeaderboard('week', undefined, 100),
        fetchTopHunters(100),
        fetchActiveContributors(100),
        user ? getUserRank(user.id) : null
    ]);

    return (
        <div
            className="min-h-screen bg-background text-foreground"
            style={{
                backgroundImage: 'var(--grid-background)',
                backgroundSize: '20px 20px'
            }}
        >
            <CommunitySubNav />
            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <h1
                        className="text-4xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-foreground to-secondary animate-pulse-slow glitch-text dark:from-neon-primary dark:via-white dark:to-neon-secondary"
                        data-text="GLOBAL RANKINGS"
                    >
                        GLOBAL RANKINGS
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm md:text-base">
                        Competing for glory, bounties, and infinite recursive loops.
                    </p>
                </div>

                {/* Your Rank - Compact inline display */}
                {user && userRank?.global_rank && (
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-neon-primary/10 via-neon-primary/5 to-neon-primary/10 border-2 border-neon-primary/30 rounded-full shadow-lg shadow-neon-primary/20">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                <span className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Global Rank</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-3xl font-black text-neon-primary font-mono">#{userRank.global_rank}</span>
                                <span className="text-sm text-muted-foreground font-mono">/ {userRank.total_users}</span>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                                Top {Math.round((userRank.global_rank / userRank.total_users) * 100)}%
                            </div>
                        </div>
                    </div>
                )}

                {/* Leaderboard Tabs - Centered */}
                <div className="max-w-5xl mx-auto">
                    <LeaderboardTabs
                        allTimeData={allTimeData || []}
                        weeklyData={weeklyData || []}
                        topHunters={topHunters || []}
                        activeContributors={activeContributors || []}
                        currentUserId={user?.id}
                    />
                </div>
            </main>
        </div>
    );
}
