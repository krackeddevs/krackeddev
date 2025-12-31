"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Activity, Flame, GitCommit, MessageSquare, Trophy, Medal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ActiveContributor } from "../types";

interface ActiveContributorsTableProps {
    data: ActiveContributor[];
    currentUserId?: string;
}

export function ActiveContributorsTable({ data, currentUserId }: ActiveContributorsTableProps) {
    if (data.length === 0) {
        return (
            <Card className="p-12 text-center border-2 border-dashed border-border/50 bg-card/50">
                <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground font-mono">
                    No active contributors in the last 30 days.
                </p>
            </Card>
        );
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
            {data.map((contributor) => {
                const isCurrentUser = contributor.id === currentUserId;
                return (
                    <div
                        key={contributor.id}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300",
                            getRowStyle(contributor.rank, isCurrentUser),
                            isCurrentUser && "scale-[1.01] shadow-lg ring-1 ring-neon-primary/50"
                        )}
                    >
                        {/* Rank */}
                        <div className="w-12 text-center flex justify-center items-center shrink-0">
                            {getRankIcon(contributor.rank)}
                        </div>

                        {/* Avatar */}
                        <Avatar className={cn("h-12 w-12 border-2", isCurrentUser ? "border-neon-primary" : "border-border/50")}>
                            <AvatarImage src={contributor.avatar_url || ""} />
                            <AvatarFallback>{contributor.username?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                        </Avatar>

                        {/* User info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/profile/${contributor.username}`}
                                    className={cn(
                                        "font-bold font-mono text-lg truncate hover:underline underline-offset-4 decoration-2 decoration-neon-primary/50",
                                        isCurrentUser ? "text-neon-primary" : "text-foreground"
                                    )}
                                >
                                    {contributor.username}
                                </Link>
                                {isCurrentUser && (
                                    <Badge variant="outline" className="text-[10px] h-5 border-neon-primary/50 text-neon-primary">YOU</Badge>
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground font-mono truncate">
                                {contributor.developer_role || "Developer"}
                            </div>
                        </div>

                        {/* Stats - Right aligned */}
                        <div className="text-right shrink-0 hidden sm:block">
                            <div className="flex flex-col items-end gap-1">
                                {/* Activity Score */}
                                <div className="flex items-center gap-1.5 bg-neon-primary/20 px-2 py-1 rounded border border-neon-primary/30">
                                    <Activity className="w-3.5 h-3.5 text-neon-primary" />
                                    <span className="font-mono font-bold text-foreground tabular-nums">
                                        {contributor.activity_score}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-mono">SCORE</span>
                                </div>
                                {/* Breakdown */}
                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                                    <div className="flex items-center gap-0.5">
                                        <GitCommit className="w-3 h-3" />
                                        <span>{contributor.github_commits_30d}</span>
                                    </div>
                                    <span>·</span>
                                    <div className="flex items-center gap-0.5">
                                        <MessageSquare className="w-3 h-3" />
                                        <span>{contributor.community_score}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Stats */}
                        <div className="text-right shrink-0 sm:hidden">
                            <div className="flex flex-col items-end">
                                <div className="text-sm uppercase text-muted-foreground font-mono tracking-wider mb-0.5">
                                    Activity
                                </div>
                                <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded border border-border/30">
                                    <Activity className="w-3.5 h-3.5 text-neon-primary" />
                                    <span className="font-mono font-bold text-foreground tabular-nums">
                                        {contributor.activity_score}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
