"use client";

import { useMemo } from "react";
import { CheckCircle } from "lucide-react";
import { BountyCard } from "./bounty-card";
import type { Bounty, BountyFilters } from "../types";

interface BountyListProps {
    bounties: Bounty[];
    filters: BountyFilters;
    onClearFilters: () => void;
    hideHeaders?: boolean;
}

export function BountyList({ bounties, filters, onClearFilters, hideHeaders = false }: BountyListProps) {
    // Separate bounties by status for display
    const { activeBounties, completedBounties, expiredBounties, otherBounties } = useMemo(() => {
        const active = bounties.filter((b) => b.status === "active");
        const completed = bounties.filter((b) => b.status === "completed");
        const expired = bounties.filter((b) => b.status === "expired");
        const other = bounties.filter(
            (b) => b.status !== "active" && b.status !== "completed" && b.status !== "expired"
        );
        return { activeBounties: active, completedBounties: completed, expiredBounties: expired, otherBounties: other };
    }, [bounties]);

    const hasActiveFilters =
        filters.search !== "" ||
        filters.status !== "all" ||
        filters.difficulty !== "all" ||
        filters.tags.length > 0;

    // Empty state
    if (bounties.length === 0) {
        return (
            <div className={`text-center py-16 ${hideHeaders ? "py-8" : ""}`} data-testid="empty-state">
                <div className="text-gray-500 font-mono text-lg mb-4">
                    No bounties found
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-neon-cyan hover:text-neon-cyan/80 font-mono text-sm"
                        data-testid="empty-state-clear-filters"
                    >
                        Clear filters
                    </button>
                )}
            </div>
        );
    }

    return (
        <div data-testid="bounty-list">
            {/* Active Bounties Section */}
            {activeBounties.length > 0 && (
                <div className="mb-12" data-testid="active-bounties-section">
                    {!hideHeaders && (
                        <h2 className="text-xl font-bold font-mono text-neon-cyan mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-neon-cyan animate-pulse"></div>
                            ACTIVE BOUNTIES
                        </h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeBounties.map((bounty) => (
                            <BountyCard key={bounty.id} bounty={bounty} />
                        ))}
                    </div>
                </div>
            )}

            {/* No Active Bounties Notice */}
            {activeBounties.length === 0 && filters.status === "all" && !hideHeaders && (
                <div className="mb-12 bg-card/50 border border-border p-8 text-center">
                    <div className="text-muted-foreground font-mono mb-2">
                        No active bounties at the moment
                    </div>
                    <p className="text-muted-foreground/80 text-sm">
                        Follow{" "}
                        <a
                            href="https://x.com/KrackedDevs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neon-cyan hover:text-neon-cyan/80"
                        >
                            @KrackedDevs
                        </a>{" "}
                        on X for new bounty announcements!
                    </p>
                </div>
            )}

            {/* Completed Bounties Section */}
            {completedBounties.length > 0 && (
                <div className="mb-12" data-testid="completed-bounties-section">
                    {!hideHeaders && (
                        <h2 className="text-xl font-bold font-mono text-neon-primary mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            COMPLETED BOUNTIES
                        </h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedBounties.map((bounty) => (
                            <BountyCard key={bounty.id} bounty={bounty} />
                        ))}
                    </div>
                </div>
            )}

            {/* Expired Bounties Section */}
            {expiredBounties.length > 0 && (
                <div className="mb-12" data-testid="expired-bounties-section">
                    {!hideHeaders && (
                        <h2 className="text-xl font-bold font-mono text-muted-foreground mb-4">
                            EXPIRED BOUNTIES
                        </h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {expiredBounties.map((bounty) => (
                            <BountyCard key={bounty.id} bounty={bounty} />
                        ))}
                    </div>
                </div>
            )}

            {/* Other Bounties Section */}
            {otherBounties.length > 0 && (
                <div data-testid="other-bounties-section">
                    {!hideHeaders && (
                        <h2 className="text-xl font-bold font-mono text-gray-400 mb-4">
                            OTHER BOUNTIES
                        </h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherBounties.map((bounty) => (
                            <BountyCard key={bounty.id} bounty={bounty} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
