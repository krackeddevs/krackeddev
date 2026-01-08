"use client";

import React from "react";
import { Search, SlidersHorizontal, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Bounty, BountyFilters } from "../types";

interface BountySidebarProps {
    bounties: Bounty[];
    filters: BountyFilters;
    onFiltersChange: (filters: BountyFilters) => void;
}

export function BountySidebar({ bounties, filters, onFiltersChange }: BountySidebarProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ ...filters, search: e.target.value });
    };

    const activeBounties = bounties.filter(b => b.status === "active");
    const completedBounties = bounties.filter(b => b.status === "completed" || b.status === "claimed");

    return (
        <aside className="w-full space-y-6">
            {/* Search Section */}
            <div className="flex gap-2">
                <div className="relative flex-grow group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[var(--neon-primary)] transition-colors" />
                    <Input
                        placeholder="Search Bounties..."
                        value={filters.search}
                        onChange={handleSearchChange}
                        className="pl-10 bg-muted/20 border-border/10 focus:border-[var(--neon-primary)]/50 rounded-none h-10 font-mono text-xs uppercase tracking-widest placeholder:text-muted-foreground/30"
                    />
                </div>
                <button className="h-10 w-10 flex items-center justify-center border border-border/10 bg-muted/20 hover:border-[var(--neon-primary)]/50 transition-colors">
                    <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
            </div>

            {/* Bounties List */}
            <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                {/* Active Section */}
                {activeBounties.map((bounty) => (
                    <div key={bounty.id} className="relative group">
                        <div className="bg-card border border-border/40 p-4 transition-all hover:border-[var(--neon-primary)]/60 group-hover:bg-muted/20 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-[11px] font-bold font-mono uppercase tracking-tight line-clamp-2 pr-4 text-foreground">{bounty.title}</h4>
                                <div className="text-[10px] font-mono text-rank-gold font-bold whitespace-nowrap">RM{bounty.reward}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={cn("text-[9px] px-1.5 py-0.5 border font-mono uppercase tracking-widest",
                                    bounty.difficulty === 'beginner' ? 'border-green-500/50 text-green-600 dark:text-green-500' :
                                        bounty.difficulty === 'intermediate' ? 'border-rank-gold/50 text-rank-gold' :
                                            'border-rank-bronze/50 text-rank-bronze'
                                )}>
                                    {bounty.difficulty}
                                </div>
                                <div className="text-[9px] px-1.5 py-0.5 border border-neon-cyan/50 text-neon-cyan font-mono uppercase tracking-widest">
                                    ACTIVE
                                </div>
                            </div>
                        </div>
                        {/* Status bar on left */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}

                {/* Completed Section */}
                {completedBounties.map((bounty) => (
                    <div key={bounty.id} className="bg-muted/30 border border-border/30 p-4 transition-colors hover:bg-muted/50">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-[11px] font-bold font-mono uppercase tracking-tight line-clamp-2 pr-4 text-foreground/70">{bounty.title}</h4>
                            <div className="text-[10px] font-mono text-foreground/40 font-bold whitespace-nowrap">RM{bounty.reward}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className="text-[8px] px-1.5 py-0.5 border border-border/40 text-muted-foreground font-mono uppercase tracking-widest">
                                    {bounty.difficulty}
                                </div>
                                <div className="text-[8px] px-1.5 py-0.5 border border-border/40 text-muted-foreground font-mono uppercase tracking-widest">
                                    COMPLETED
                                </div>
                            </div>
                            {bounty.winner && (
                                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--neon-primary)]/70 font-semibold">
                                    <Trophy className="w-3 h-3" />
                                    <span>Winner: @{bounty.winner.username || bounty.winner.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {bounties.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-border/10">
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">No bounties found</p>
                    </div>
                )}
            </div>

            {/* Total Paid Footer */}
            <div className="pt-4 border-t border-border/10">
                <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-muted-foreground uppercase tracking-widest">Total Bounty Paid =</span>
                    <span className="font-bold text-foreground">RM {bounties.reduce((acc, b) => b.status === "completed" ? acc + b.reward : acc, 0)}</span>
                </div>
            </div>
        </aside>
    );
}
