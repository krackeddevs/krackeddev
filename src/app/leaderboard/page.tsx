import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { fetchLeaderboard, getUserRank, fetchTopHunters } from "@/features/profiles/actions";
import { LeaderboardTabs } from "@/features/profiles/components/leaderboard-tabs";
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
        userRank
    ] = await Promise.all([
        fetchLeaderboard('all-time', undefined, 100),
        fetchLeaderboard('week', undefined, 100),
        fetchTopHunters(100),
        user ? getUserRank(user.id) : null
    ]);

    return (
        <div className="min-h-screen bg-background text-foreground">
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

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Leaderboard - Takes 3 cols */}
                    <div className="lg:col-span-3">
                        <LeaderboardTabs
                            allTimeData={allTimeData || []}
                            weeklyData={weeklyData || []}
                            topHunters={topHunters || []}
                            currentUserId={user?.id}
                        />
                    </div>

                    {/* Sidebar - Takes 1 col */}
                    <div className="space-y-6">
                        {/* Your Rank Widget */}
                        <YourRankWidget
                            rank={userRank?.global_rank}
                            totalUsers={userRank?.total_users}
                            isAuthenticated={!!user}
                            showButton={false}
                        />

                        {/* Additional widgets could go here */}
                    </div>
                </div>
            </main>
        </div>
    );
}
