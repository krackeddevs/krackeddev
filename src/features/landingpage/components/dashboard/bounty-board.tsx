"use client";

import { useRecentBounties } from "@/lib/hooks/use-landing-data";
import { Trophy, Clock, ArrowRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function BountyBoard() {
    const { data: bounties, isLoading } = useRecentBounties();

    return (
        <div className="bg-[#F9F9F9] dark:bg-card/40 border border-border/30 rounded-sm p-6 flex flex-col h-full backdrop-blur-sm">
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-2 text-[var(--neon-primary)]">
                    <Target className="w-5 h-5" />
                    <h2 className="text-xl font-mono font-bold uppercase tracking-tighter">BOUNTY BOARD</h2>
                </div>
                <p className="text-[10px] font-mono text-foreground/50 max-w-md mx-auto leading-relaxed">
                    Earn rewards by contributing to open-source projects. Complete bounties, get paid.
                </p>
            </div>

            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {isLoading ? (
                    [...Array(2)].map((_, i) => (
                        <div key={i} className="h-48 bg-[var(--neon-primary)]/5 animate-pulse rounded-sm" />
                    ))
                ) : (
                    bounties?.slice(0, 2).map((bounty) => (
                        <div
                            key={bounty.id}
                            className="bg-background border border-border/20 rounded-sm overflow-hidden hover:border-[var(--neon-primary)] transition-all duration-300 group flex flex-col shadow-sm"
                        >
                            {/* Card Header Style from Figma */}
                            <div className="p-4 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={
                                        `text-[9px] font-mono px-2 py-0.5 border ${bounty.status === 'open'
                                            ? 'border-[var(--neon-primary)] text-[var(--neon-primary)] bg-[var(--neon-primary)]/10'
                                            : 'border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10'
                                        } uppercase font-bold`
                                    }>
                                        {bounty.status}
                                    </span>
                                    <span className="text-sm font-mono font-bold text-[var(--rank-gold,#fbbf24)]">
                                        RM{bounty.rewardAmount || (bounty as any).reward_amount}
                                    </span>
                                </div>

                                <h3 className="text-base font-mono font-bold text-foreground group-hover:text-[var(--neon-primary)] line-clamp-1">
                                    {bounty.title}
                                </h3>

                                <p className="text-[11px] font-mono text-foreground/50 line-clamp-2 mb-4 leading-relaxed">
                                    {bounty.description}
                                </p>
                            </div>

                            <div className="px-4 py-3 bg-secondary/30 border-t border-border/10 flex items-center justify-between text-[9px] font-mono text-foreground/40">
                                <span className="flex items-center gap-1 uppercase font-bold">
                                    <Trophy className="w-3 h-3" />
                                    {bounty.type}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {bounty.createdAt ? new Date(bounty.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-auto">
                <Button
                    asChild
                    variant="outline"
                    className="w-full border border-[var(--neon-primary)]/50 text-[var(--neon-primary)] hover:bg-[var(--neon-primary)] hover:text-background text-xs font-mono font-bold uppercase tracking-widest h-12"
                >
                    <Link href="/code/bounty">
                        VIEW ALL BOUNTIES <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
