"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Coins, MapPin, User, Search } from "lucide-react";
import { TopHunter } from "../actions";

interface TopHuntersListProps {
    hunters: TopHunter[];
}

export function TopHuntersList({ hunters }: TopHuntersListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter hunters based on search
    const filteredHunters = hunters.filter((hunter) => {
        const query = searchQuery.toLowerCase();
        return (
            hunter.username?.toLowerCase().includes(query) ||
            hunter.full_name?.toLowerCase().includes(query) ||
            hunter.developer_role?.toLowerCase().includes(query) ||
            hunter.location?.toLowerCase().includes(query)
        );
    });

    if (hunters.length === 0) {
        return (
            <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 font-mono">No bounty hunters yet. Be the first!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search by name, role, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-amber-500 outline-none font-mono text-sm text-white placeholder-gray-500 transition-colors"
                />
            </div>

            {/* Results count */}
            {searchQuery && (
                <p className="text-gray-400 font-mono text-sm">
                    Found {filteredHunters.length} hunter{filteredHunters.length !== 1 ? "s" : ""}
                </p>
            )}

            {/* Hunters List */}
            {filteredHunters.length === 0 ? (
                <div className="text-center py-12">
                    <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 font-mono">No hunters match your search.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredHunters.map((hunter, index) => {
                        // Find original rank
                        const originalRank = hunters.findIndex(h => h.id === hunter.id);

                        return (
                            <Link
                                key={hunter.id}
                                href={`/profile/${hunter.username}`}
                                className="block group"
                            >
                                <div className={`
                                    flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-800/50 border transition-all hover:border-neon-primary/50
                                    ${originalRank === 0 ? "border-amber-500/50 bg-amber-900/10" :
                                        originalRank === 1 ? "border-gray-500/50" :
                                            originalRank === 2 ? "border-orange-700/50" :
                                                "border-gray-700"}
                                `}>
                                    {/* Rank */}
                                    <div className={`
                                        w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-mono font-bold text-sm sm:text-lg shrink-0
                                        ${originalRank === 0 ? "bg-amber-500/20 text-amber-400 border border-amber-500" :
                                            originalRank === 1 ? "bg-gray-500/20 text-gray-300 border border-gray-500" :
                                                originalRank === 2 ? "bg-orange-700/20 text-orange-400 border border-orange-700" :
                                                    "bg-gray-700/50 text-gray-400"}
                                    `}>
                                        #{originalRank + 1}
                                    </div>

                                    {/* Avatar */}
                                    {hunter.avatar_url ? (
                                        <img
                                            src={hunter.avatar_url}
                                            alt={hunter.username || "User"}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/10 group-hover:border-neon-primary/50 transition-colors shrink-0"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700 flex items-center justify-center border-2 border-white/10 shrink-0">
                                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-mono text-sm sm:text-base text-white group-hover:text-neon-primary transition-colors truncate">
                                            {hunter.full_name || hunter.username || "Anonymous"}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-400 font-mono">
                                            {hunter.developer_role && (
                                                <span className="uppercase">{hunter.developer_role}</span>
                                            )}
                                            {hunter.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    <span className="truncate max-w-[80px] sm:max-w-none">{hunter.location}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats - Vertical stack on mobile, horizontal on desktop */}
                                    <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-6 shrink-0">
                                        <div className="text-right sm:text-center">
                                            <div className="flex items-center justify-end sm:justify-center gap-1 text-amber-400">
                                                <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="font-mono font-bold text-sm sm:text-base">{hunter.totalWins}</span>
                                            </div>
                                            <span className="text-[10px] sm:text-xs text-gray-500 font-mono block">WINS</span>
                                        </div>
                                        <div className="text-right sm:text-center">
                                            <div className="flex items-center justify-end sm:justify-center gap-1 text-neon-cyan">
                                                <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="font-mono font-bold text-sm sm:text-base">RM{hunter.totalEarnings}</span>
                                            </div>
                                            <span className="text-[10px] sm:text-xs text-gray-500 font-mono block">EARNED</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
