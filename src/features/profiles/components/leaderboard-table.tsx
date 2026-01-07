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
        if (rank === 1) return <Trophy className="w-6 h-6 text-[var(--neon-primary)] shadow-[0_0_10px_rgba(var(--neon-primary-rgb),0.5)]" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-foreground/60" />;
        if (rank === 3) return <Medal className="w-6 h-6 text-foreground/30" />;
        return <span className="font-mono font-bold text-foreground/20">#{rank}</span>;
    };

    const getRowStyle = (rank: number, isCurrentUser: boolean) => {
        if (isCurrentUser) return "bg-[var(--neon-primary)]/10 border-[var(--neon-primary)]/50 shadow-[0_0_30px_rgba(var(--neon-primary-rgb),0.05)]";
        if (rank === 1) return "bg-foreground/[0.03] border-border/50";
        return "bg-card/40 border-border/50 hover:bg-foreground/[0.02] transition-all";
    };

    return (
        <div className="space-y-4">
            {data.map((entry) => {
                const isCurrentUser = entry.id === currentUserId;
                return (
                    <div
                        key={entry.id}
                        className={cn(
                            "flex items-center gap-3 sm:gap-6 p-3 sm:p-5 rounded-none border backdrop-blur-md transition-all duration-300 relative overflow-hidden group",
                            getRowStyle(entry.rank, isCurrentUser)
                        )}
                    >
                        {isCurrentUser && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--neon-primary)] shadow-[0_0_15px_var(--neon-primary)]" />
                        )}

                        {/* Rank */}
                        <div className="w-8 sm:w-12 text-center flex justify-center items-center shrink-0">
                            {getRankIcon(entry.rank)}
                        </div>

                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className={cn(
                                "w-10 h-10 sm:w-14 sm:h-14 rounded-none border p-1 transition-colors",
                                isCurrentUser ? "border-[var(--neon-primary)]" : "border-border/50 group-hover:border-foreground/30"
                            )}>
                                <Avatar className="h-full w-full rounded-none grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                    <AvatarImage src={entry.avatar_url || ""} className="object-cover" />
                                    <AvatarFallback className="rounded-none bg-muted/50 text-[10px] sm:text-xs">{entry.username?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>

                        {/* User info */}
                        <div className="flex-1 min-w-0 mr-2 sm:mr-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Link
                                        href={`/profile/${entry.username}`}
                                        className={cn(
                                            "font-bold font-mono text-sm sm:text-lg truncate uppercase tracking-tighter transition-colors",
                                            isCurrentUser ? "text-[var(--neon-primary)]" : "text-foreground group-hover:text-[var(--neon-primary)]"
                                        )}
                                    >
                                        {entry.username}
                                    </Link>
                                    {isCurrentUser && (
                                        <div className="sm:hidden px-1.5 py-0.5 bg-[var(--neon-primary)] text-background text-[8px] font-black font-mono">YOU</div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-[8px] px-1.5 py-0.5 rounded-[2px] leading-none tracking-wider font-black font-mono shrink-0",
                                        (entry.leaderboard_label || '[RUNNER]') === '[SYSTEM]'
                                            ? "bg-black dark:bg-[var(--neon-primary)] text-white dark:text-black border border-[var(--neon-primary)]"
                                            : (entry.leaderboard_label || '[RUNNER]') === '[MOD]'
                                                ? "bg-[var(--neon-primary)]/10 text-[var(--neon-primary)] border border-[var(--neon-primary)]/30"
                                                : "bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/20"
                                    )}>
                                        {(entry.leaderboard_label || 'RUNNER').replace(/[\[\]]/g, '')}
                                    </span>
                                    {isCurrentUser && (
                                        <div className="hidden sm:block px-2 py-0.5 bg-[var(--neon-primary)] text-background text-[9px] font-black font-mono">YOU</div>
                                    )}
                                </div>
                            </div>
                            <div className="text-[9px] text-foreground/60 font-mono font-bold uppercase tracking-widest mt-0.5 truncate hidden sm:block">
                                {entry.developer_role || "DEVELOPER"}
                            </div>

                            {/* Optional Skills Row */}
                            {showSkills && entry.stack && entry.stack.length > 0 && (
                                <div className="flex gap-1.5 sm:gap-2 mt-1 sm:mt-2 flex-wrap hidden sm:flex">
                                    {entry.stack.slice(0, 3).map(s => (
                                        <span key={s} className="text-[9px] px-2 py-0.5 border border-border/30 text-foreground/50 font-mono uppercase tracking-tighter">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Stats - Right aligned */}
                        <div className="text-right shrink-0">
                            <div className="flex flex-col items-end gap-1 sm:gap-1.5">
                                <div className="text-[9px] sm:text-[10px] uppercase text-foreground/60 font-mono font-bold tracking-widest">
                                    <span className="hidden sm:inline">LVL</span> <span className="sm:hidden">Lvl.</span> <span className="text-foreground group-hover:text-[var(--neon-primary)] transition-colors">{entry.level}</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 bg-foreground/[0.03] px-2 sm:px-3 py-1 sm:py-1.5 border border-border/30">
                                    <Star className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5", isCurrentUser ? "text-[var(--neon-primary)]" : "text-foreground/40")} />
                                    <span className="font-mono font-black text-xs sm:text-base text-foreground tabular-nums tracking-tighter">
                                        {entry.xp.toLocaleString()}
                                    </span>
                                    <span className="text-[8px] sm:text-[9px] text-foreground/40 font-mono font-bold tracking-widest sm:ml-1">XP</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
