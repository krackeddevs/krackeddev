import { cn } from "@/lib/utils";
import type { BountyStats } from "../types";

interface BountyStatsBarProps {
    stats: BountyStats;
}

export function BountyStatsBar({ stats }: BountyStatsBarProps) {
    const statItems = [
        { label: "ACTIVE BOUNTIES", value: stats.activeBounties.toString().padStart(3, '0'), color: "var(--neon-cyan)", borderColor: "border-neon-cyan/30" },
        { label: "AVAILABLE REWARDS", value: `RM ${stats.availableRewards}`, color: "var(--rank-gold)", borderColor: "border-rank-gold/30" },
        { label: "COMPLETED", value: stats.completedBounties.toString().padStart(2, '0'), color: "#22c55e", borderColor: "border-green-500/30" },
        { label: "TOTAL PAID", value: `RM ${stats.totalPaid}`, color: "#a855f7", borderColor: "border-purple-500/30" },
    ];

    return (
        <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            data-testid="bounty-stats-bar"
        >
            {statItems.map((item) => (
                <div key={item.label} className={cn("bg-muted/30 border p-6 flex flex-col justify-between min-h-[120px] transition-colors duration-300", item.borderColor)}>
                    <div className="text-[10px] font-mono opacity-50 tracking-[0.2em] uppercase text-foreground">{item.label}</div>
                    <div
                        className="text-3xl font-bold font-mono tracking-tighter"
                        style={{ color: item.color }}
                    >
                        {item.value}
                    </div>
                </div>
            ))}
        </div>
    );
}
