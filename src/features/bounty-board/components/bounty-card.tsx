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
          relative p-4 border-2 transition-all duration-200 cursor-pointer h-full
          ${isRare
                        ? "border-amber-500/50 bg-gradient-to-br from-gray-800/50 to-amber-900/20 hover:border-amber-400 shadow-lg shadow-amber-500/10"
                        : isActive
                            ? "border-cyan-500/50 bg-gray-800/50 hover:bg-gray-800 hover:border-cyan-400"
                            : isCompleted
                                ? "border-green-500/30 bg-gray-800/30 hover:bg-gray-800/50 hover:border-green-500/50"
                                : "border-gray-600/50 bg-gray-800/30 hover:bg-gray-800/50"
                    }
        `}
                data-testid="bounty-card"
            >
                {/* Bounty Number */}
                <div className="absolute -top-3 -left-1 bg-gray-700 text-gray-300 px-2 py-0.5 font-mono text-xs">
                    #{bounty.id}
                </div>

                {/* Rarity Badge */}
                {isRare && (
                    <div
                        className="absolute -top-3 left-12 px-2 py-0.5 font-mono text-xs bg-amber-500/20 text-amber-400 border border-amber-500/50"
                        data-testid="rarity-badge"
                    >
                        🔥 RARE
                    </div>
                )}

                {/* Reward Badge */}
                <div
                    className={`absolute -top-3 -right-3 px-3 py-1 font-mono text-sm font-bold ${isCompleted ? "bg-green-500 text-black" : "bg-yellow-500 text-black"
                        }`}
                    data-testid="reward-badge"
                >
                    RM{bounty.reward}
                </div>

                <div className="space-y-3 mt-2">
                    {/* Title */}
                    <h3
                        className="font-mono text-lg text-white pr-12 leading-tight"
                        data-testid="bounty-title"
                    >
                        {bounty.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm line-clamp-2">
                        {bounty.description}
                    </p>

                    {/* Winner Badge for completed bounties */}
                    {isCompleted && bounty.winner && (
                        <div
                            className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-2"
                            data-testid="winner-badge"
                        >
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="text-green-400 font-mono text-sm">Winner:</span>
                            <span className="text-white font-mono text-sm">
                                @{bounty.winner.xHandle}
                            </span>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2" data-testid="tags-container">
                        {bounty.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs font-mono"
                            >
                                {tag}
                            </span>
                        ))}
                        {bounty.tags.length > 3 && (
                            <span className="px-2 py-1 text-gray-500 text-xs font-mono">
                                +{bounty.tags.length - 3}
                            </span>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-700">
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
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
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
