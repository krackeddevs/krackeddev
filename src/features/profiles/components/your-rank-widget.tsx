import { getUserRank } from "../actions";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface YourRankWidgetProps {
    userId?: string;
    rank?: number;
    totalUsers?: number;
    isAuthenticated?: boolean;
    showButton?: boolean;
}

export async function YourRankWidget({ userId, rank, totalUsers, isAuthenticated = true, showButton = true }: YourRankWidgetProps) {
    let global_rank = rank;
    let total_users = totalUsers;

    // If data not provided but userId is, fetch it
    if ((global_rank === undefined || total_users === undefined) && userId) {
        const rankData = await getUserRank(userId);
        if (rankData) {
            global_rank = rankData.global_rank;
            total_users = rankData.total_users;
        }
    }

    // If still no data or not authenticated, don't render (or render placeholder if desired)
    if (!isAuthenticated || global_rank === undefined || total_users === undefined) return null;

    const percentile = Math.max(1, Math.round((global_rank / total_users) * 100));
    const isTop10 = global_rank <= 10;

    return (
        <Card className="p-5 border-neon-primary/30 bg-card/40 backdrop-blur-sm relative overflow-hidden group hover:border-neon-primary/60 transition-colors">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-primary/5 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none" />

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-neon-primary" />
                        Global Rank
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Based on total XP</p>
                </div>
                {isTop10 && (
                    <div className="bg-yellow-400/10 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-400/20 uppercase tracking-wider">
                        Top 10
                    </div>
                )}
            </div>

            <div className="flex items-baseline gap-2 mb-2 relative z-10">
                <span className="text-4xl font-bold font-mono text-foreground">
                    #{global_rank.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">
                    / {total_users.toLocaleString()}
                </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4 relative z-10">
                You are in the top <span className="text-neon-primary font-bold">{percentile}%</span> of all developers.
            </p>

            {showButton && (
                <Button variant="outline" className="w-full border-neon-primary/30 hover:bg-neon-primary/10 hover:text-neon-primary relative z-10" asChild>
                    <Link href="/leaderboard">View Leaderboard</Link>
                </Button>
            )}
        </Card>
    );
}
