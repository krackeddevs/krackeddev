"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LeaderboardEntry } from "../types";
import { Trophy, Medal, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LeaderboardTableProps {
    data: LeaderboardEntry[];
    currentUserId?: string;
    showSkills?: boolean;
}

export function LeaderboardTable({ data, currentUserId, showSkills = false }: LeaderboardTableProps) {
    if (data.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No leaderboard data available.</div>;
    }

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
        if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
        return <span className="font-mono font-bold text-muted-foreground">#{rank}</span>;
    };

    const getRowStyle = (rank: number, isCurrentUser: boolean) => {
        if (isCurrentUser) return "bg-neon-primary/10 border-neon-primary box-shadow-neon";
        if (rank === 1) return "bg-yellow-400/5 border-yellow-400/20";
        if (rank === 2) return "bg-gray-300/5 border-gray-300/20";
        if (rank === 3) return "bg-amber-600/5 border-amber-600/20";
        return "bg-card/40 border-border hover:bg-card/60 transition-colors";
    };

    return (
        <div className="space-y-3">
            {data.map((entry) => {
                const isCurrentUser = entry.id === currentUserId;
                return (
                    <div
                        key={entry.id}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300",
                            getRowStyle(entry.rank, isCurrentUser),
                            isCurrentUser && "scale-[1.01] shadow-lg ring-1 ring-neon-primary/50"
                        )}
                    >
                        {/* Rank */}
                        <div className="w-12 text-center flex justify-center items-center shrink-0">
                            {getRankIcon(entry.rank)}
                        </div>

                        {/* Avatar */}
                        <Avatar className={cn("h-12 w-12 border-2", isCurrentUser ? "border-neon-primary" : "border-border/50")}>
                            <AvatarImage src={entry.avatar_url || ""} />
                            <AvatarFallback>{entry.username?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                        </Avatar>

                        {/* User info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/profile/${entry.username}`}
                                    className={cn(
                                        "font-bold font-mono text-lg truncate hover:underline underline-offset-4 decoration-2 decoration-neon-primary/50",
                                        isCurrentUser ? "text-neon-primary" : "text-foreground"
                                    )}
                                >
                                    {entry.username}
                                </Link>
                                {isCurrentUser && (
                                    <Badge variant="outline" className="text-[10px] h-5 border-neon-primary/50 text-neon-primary">YOU</Badge>
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground font-mono truncate">
                                {entry.developer_role || "Developer"}
                            </div>

                            {/* Optional Skills Row */}
                            {showSkills && entry.stack && entry.stack.length > 0 && (
                                <div className="flex gap-1 mt-1 flex-wrap">
                                    {entry.stack.slice(0, 3).map(s => (
                                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/40 text-muted-foreground border border-border/30">
                                            {s}
                                        </span>
                                    ))}
                                    {entry.stack.length > 3 && (
                                        <span className="text-[10px] px-1 text-muted-foreground">+{entry.stack.length - 3}</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Stats - Right aligned */}
                        <div className="text-right shrink-0">
                            <div className="flex flex-col items-end">
                                <div className="text-sm uppercase text-muted-foreground font-mono tracking-wider mb-0.5">
                                    Level <span className="text-foreground font-bold">{entry.level}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded border border-border/30">
                                    <Star className={cn("w-3.5 h-3.5", isCurrentUser ? "text-neon-primary" : "text-rank-gold")} />
                                    <span className="font-mono font-bold text-foreground tabular-nums">
                                        {entry.xp.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-mono">XP</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
