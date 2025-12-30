import Link from "next/link";
import { Trophy, Clock } from "lucide-react";
import type { Bounty } from "../types";
import { difficultyColors, statusColors, rarityColors } from "../types";

interface BountyCardProps {
    bounty: Bounty;
}

export function BountyCard({ bounty }: BountyCardProps) {
    const isActive = bounty.status === "active";
    const isCompleted = bounty.status === "completed";
    const isRare = bounty.rarity === "rare";

    return (
        <Link href={`/code/bounty/${bounty.slug}`}>
            <div
                className={`
                    relative p-6 border-2 transition-all duration-300 cursor-pointer h-full backdrop-blur-sm flex flex-col justify-between group hover:-translate-y-1
                    ${isRare
                        ? "bg-card/40 border-rank-gold/50 hover:border-rank-gold hover:bg-rank-gold/5 hover:shadow-[0_0_30px_var(--rank-gold)]"
                        : isActive
                            ? "bg-card/40 border-neon-cyan/50 hover:border-neon-cyan hover:bg-neon-cyan/5 hover:shadow-[0_0_30px_var(--neon-cyan)]"
                            : isCompleted
                                ? "bg-card/40 border-neon-secondary/50 hover:border-neon-secondary hover:bg-neon-secondary/5 hover:shadow-[0_0_30px_var(--neon-secondary)]"
                                : "bg-card/40 border-neon-secondary/30 hover:border-neon-secondary hover:bg-neon-secondary/5 hover:shadow-[0_0_30px_var(--neon-secondary)]"
                    }
                `}
                data-testid="bounty-card"
            >
                {/* Bounty Number */}
                <div className="absolute -top-3 -left-1 bg-muted text-muted-foreground px-2 py-0.5 font-mono text-xs">
                    #{bounty.id}
                </div>

                {/* Rarity Badge */}
                {isRare && (
                    <div
                        className="absolute -top-3 left-12 px-2 py-0.5 font-mono text-xs bg-rank-gold/20 text-rank-gold border border-rank-gold/50"
                        data-testid="rarity-badge"
                    >
                        🔥 RARE
                    </div>
                )}

                {/* Reward Badge */}
                <div
                    className={`absolute -top-3 -right-3 px-3 py-1 font-mono text-sm font-bold ${isCompleted ? "bg-neon-primary text-black" : "bg-rank-gold text-black"
                        }`}
                    data-testid="reward-badge"
                >
                    RM{bounty.reward}
                </div>

                <div className="space-y-3 mt-2">
                    {/* Title */}
                    <h3
                        className="font-mono text-lg text-foreground pr-12 leading-tight"
                        data-testid="bounty-title"
                    >
                        {bounty.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm line-clamp-2">
                        {bounty.description}
                    </p>

                    {/* Winner Badge for completed bounties */}
                    {isCompleted && bounty.winner && (
                        <div
                            className="flex items-center gap-2 bg-neon-primary/10 border border-neon-primary/30 px-3 py-2"
                            data-testid="winner-badge"
                        >
                            <Trophy className="w-4 h-4 text-rank-gold" />
                            <span className="text-neon-primary font-mono text-sm">Winner:</span>
                            <span className="text-foreground font-mono text-sm">
                                {bounty.winner.xHandle ? `@${bounty.winner.xHandle}` : bounty.winner.name}
                            </span>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2" data-testid="tags-container">
                        {bounty.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs font-mono"
                            >
                                {tag}
                            </span>
                        ))}
                        {bounty.tags.length > 3 && (
                            <span className="px-2 py-1 text-muted-foreground text-xs font-mono">
                                +{bounty.tags.length - 3}
                            </span>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-2">
                            <span
                                className={`px-2 py-1 text-xs font-mono border ${difficultyColors[bounty.difficulty]
                                    }`}
                                data-testid="difficulty-badge"
                            >
                                {bounty.difficulty.toUpperCase()}
                            </span>
                            <span
                                className={`px-2 py-1 text-xs font-mono border ${statusColors[bounty.status]
                                    }`}
                                data-testid="status-badge"
                            >
                                {bounty.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Clock className="w-3 h-3" />
                            <span data-testid="deadline">
                                {new Date(bounty.deadline).toLocaleDateString("en-MY", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
