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
            <div className="bg-gray-800/50 border border-cyan-500/30 p-4">
                <div className="text-cyan-400 font-mono text-sm">Active Bounties</div>
                <div
                    className="text-2xl font-bold text-white"
                    data-testid="active-bounties-count"
                >
                    {stats.activeBounties}
                </div>
            </div>
            <div className="bg-gray-800/50 border border-yellow-500/30 p-4">
                <div className="text-yellow-400 font-mono text-sm">
                    Available Rewards
                </div>
                <div
                    className="text-2xl font-bold text-white"
                    data-testid="available-rewards"
                >
                    RM{stats.availableRewards}
                </div>
            </div>
            <div className="bg-gray-800/50 border border-green-500/30 p-4">
                <div className="text-green-400 font-mono text-sm">Completed</div>
                <div
                    className="text-2xl font-bold text-white"
                    data-testid="completed-bounties-count"
                >
                    {stats.completedBounties}
                </div>
            </div>
            <div className="bg-gray-800/50 border border-purple-500/30 p-4">
                <div className="text-purple-400 font-mono text-sm">Total Paid</div>
                <div className="text-2xl font-bold text-white" data-testid="total-paid">
                    RM{stats.totalPaid}
                </div>
            </div>
        </div>
    );
}
