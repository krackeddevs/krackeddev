import type { BountyStats } from "../types";

interface BountyStatsBarProps {
    stats: BountyStats;
}

export function BountyStatsBar({ stats }: BountyStatsBarProps) {
    return (
        <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            data-testid="bounty-stats-bar"
        >
            <div className="bg-card/50 border border-neon-cyan/30 p-4">
                <div className="text-neon-cyan font-mono text-sm">Active Bounties</div>
                <div
                    className="text-2xl font-bold text-foreground"
                    data-testid="active-bounties-count"
                >
                    {stats.activeBounties}
                </div>
            </div>
            <div className="bg-card/50 border border-amber-500/30 p-4">
                <div className="text-amber-500 font-mono text-sm">
                    Available Rewards
                </div>
                <div
                    className="text-2xl font-bold text-foreground"
                    data-testid="available-rewards"
                >
                    RM{stats.availableRewards}
                </div>
            </div>
            <div className="bg-card/50 border border-neon-secondary/30 p-4">
                <div className="text-neon-secondary font-mono text-sm">Completed</div>
                <div
                    className="text-2xl font-bold text-foreground"
                    data-testid="completed-bounties-count"
                >
                    {stats.completedBounties}
                </div>
            </div>
            <div className="bg-card/50 border border-purple-500/30 p-4">
                <div className="text-purple-500 font-mono text-sm">Total Paid</div>
                <div className="text-2xl font-bold text-foreground" data-testid="total-paid">
                    RM{stats.totalPaid}
                </div>
            </div>
        </div>
    );
}
