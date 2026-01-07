"use client";

import { useEffect, useState } from "react";
import { fetchLeaderboard } from "@/features/profiles/actions";
import { LeaderboardEntry } from "@/features/profiles/types";
import { Trophy, ArrowRight, Star, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LeaderboardWidget() {
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data: entries } = await fetchLeaderboard("all-time", undefined, 5);
            if (entries) setData(entries);
            setIsLoading(false);
        }
        load();
    }, []);

    return (
        <div className="bg-[var(--dashboard-card-bg)] border border-border/30 rounded-sm p-5 h-full flex flex-col backdrop-blur-sm">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1 text-[var(--neon-primary)]">
                    <Users className="w-5 h-5" />
                    <h2 className="text-xl font-mono font-bold tracking-tighter uppercase">LEADERBOARD</h2>
                </div>
                <p className="text-[10px] font-mono text-foreground/50 leading-tight">
                    Competing for glory, bounties, and infinite recursive loops.
                </p>
            </div>

            <div className="flex-grow space-y-2">
                {isLoading ? (
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="h-14 w-full bg-[var(--neon-primary)]/5 animate-pulse rounded-sm" />
                    ))
                ) : (
                    data.map((entry, i) => (
                        <div
                            key={entry.id}
                            className={`flex items-center justify-between p-3 rounded-sm border transition-all duration-300 group ${i < 3
                                ? 'bg-background/80 border-[var(--neon-primary)]/40 shadow-sm'
                                : 'bg-transparent border-border/5'
                                } hover:border-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/5`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-4 text-[10px] font-mono font-bold text-foreground/30">
                                    {i === 0 ? <Trophy className="w-3 h-3 text-[var(--rank-gold,#fbbf24)]" /> : `#${i + 1}`}
                                </div>
                                <Avatar className="w-10 h-10 border border-border/20 rounded-sm">
                                    <AvatarImage src={entry.avatar_url || ""} />
                                    <AvatarFallback className="bg-background text-xs font-mono text-[var(--neon-primary)]">
                                        {entry.username.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="text-xs font-mono font-bold text-foreground group-hover:text-[var(--neon-primary)] transition-colors">
                                        {entry.username}
                                    </div>
                                    <div className="text-[9px] font-mono text-foreground/40 uppercase">
                                        {entry.developer_role || entry.stack?.[0] || "Agent"}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] font-mono text-foreground/40 uppercase">LEVEL {entry.level || 1}</div>
                                <div className="text-xs font-mono font-bold text-[var(--rank-gold,#fbbf24)] flex items-center gap-1 justify-end">
                                    {entry.xp} <Star className="w-3 h-3 fill-[var(--rank-gold,#fbbf24)]" />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Button
                asChild
                className="w-full mt-6 bg-[var(--neon-primary)] text-background hover:bg-[var(--neon-secondary)] text-xs font-mono font-bold uppercase tracking-widest h-12 rounded-sm border-none"
            >
                <Link href="/leaderboard">
                    VIEW AGENT DIRECTORY <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </Button>

            <p className="text-[8px] font-mono text-center text-foreground/30 mt-4 uppercase">
                © connect with other operatives and build your squad
            </p>
        </div>
    );
}
