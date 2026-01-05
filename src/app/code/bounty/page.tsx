"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Terminal, Building2 } from "lucide-react";
import {
  BountyFiltersPanel,
  BountyStatsBar,
  BountyList,
  fetchActiveBounties,
  fetchBountyStats,
  fetchUniqueTags,
} from "@/features/bounty-board";
import type { Bounty, BountyFilters as BountyFiltersType, BountyStats } from "@/features/bounty-board";
import "@/styles/bounty.css";

// X/Twitter icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function BountyListPage() {
  const [allBounties, setAllBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<BountyFiltersType>({
    search: "",
    status: "all",
    difficulty: "all",
    tags: [],
  });

  const [stats, setStats] = useState<BountyStats>({
    activeBounties: 0,
    availableRewards: 0,
    completedBounties: 0,
    totalPaid: 0,
  });

  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Load bounties, stats, and tags from server actions (unified data source)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [bountiesResult, statsResult, tagsResult] = await Promise.all([
        fetchActiveBounties(), // Use server action instead of static data
        fetchBountyStats(),
        fetchUniqueTags(),
      ]);
      if (bountiesResult.data) setAllBounties(bountiesResult.data);
      if (statsResult.data) setStats(statsResult.data);
      if (tagsResult.data) setAvailableTags(tagsResult.data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter bounties based on current filters
  const filteredBounties = React.useMemo(() => {
    let result = [...allBounties];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          b.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (filters.status !== "all") {
      result = result.filter((b) => b.status === filters.status);
    }

    if (filters.difficulty !== "all") {
      result = result.filter((b) => b.difficulty === filters.difficulty);
    }

    if (filters.tags.length > 0) {
      result = result.filter((b) =>
        filters.tags.some((tag) => b.tags.includes(tag))
      );
    }

    return result;
  }, [allBounties, filters]);

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "all",
      difficulty: "all",
      tags: [],
    });
  }, []);

  return (
    <main className="min-h-screen relative">
      <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/code"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-mono text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Code Hub
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold font-mono text-foreground mb-2">
            BOUNTY BOARD
          </h1>
          <p className="text-muted-foreground">
            Earn rewards by contributing to open-source projects. Complete
            bounties, get paid.
          </p>
        </div>

        {/* Stats Bar */}
        <BountyStatsBar stats={stats} />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-neon-primary border-t-transparent animate-spin rounded-full"></div>
          </div>
        )}

        {/* Content - only show when not loading */}
        {!loading && (
          <>
            {/* Filters */}
            <BountyFiltersPanel
              filters={filters}
              onFiltersChange={setFilters}
              availableTags={availableTags}
            />

            {/* Bounty List Sections */}

            {/* 1. Official Bounties (Active Operations) */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6 border-b border-neon-primary/20 pb-2">
                <Terminal className="w-5 h-5 text-neon-primary" />
                <h2 className="text-xl font-bold font-mono text-neon-primary uppercase tracking-widest">
                  Active Operations
                </h2>
                <span className="text-xs text-muted-foreground ml-auto font-mono">
                  OFFICIAL PROTOCOLS
                </span>
              </div>
              <BountyList
                bounties={filteredBounties.filter(b => b.status === "active" && b.type === "official")}
                filters={filters}
                onClearFilters={clearFilters}
              />
            </div>

            {/* 2. Community Bounties (Open Contracts) */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6 border-b border-neon-cyan/20 pb-2">
                <Building2 className="w-5 h-5 text-neon-cyan" />
                <h2 className="text-xl font-bold font-mono text-neon-cyan uppercase tracking-widest">
                  Open Contracts
                </h2>
                <span className="text-xs text-muted-foreground ml-auto font-mono">
                  COMMUNITY & PARTNERS
                </span>
              </div>
              <BountyList
                bounties={filteredBounties.filter(b => b.status === "active" && b.type === "community")}
                filters={filters}
                onClearFilters={clearFilters}
              />
            </div>

            {/* 3. Completed (Mission Archive) */}
            <div className="mb-12 opacity-80">
              <div className="flex items-center gap-2 mb-6 border-b border-muted/20 pb-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                <h2 className="text-xl font-bold font-mono text-muted-foreground uppercase tracking-widest">
                  Mission Archive
                </h2>
                <span className="text-xs text-muted-foreground ml-auto font-mono">
                  COMPLETED
                </span>
              </div>
              <BountyList
                bounties={filteredBounties.filter(b => b.status === "completed" || b.status === "claimed")}
                filters={filters}
                onClearFilters={clearFilters}
              />
            </div>
          </>
        )}

        {/* Follow CTA */}
        <div className="mt-12 bg-card/30 border border-border p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Stay updated on new bounties and announcements
          </p>
          <a
            href="https://x.com/KrackedDevs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 font-mono font-bold hover:bg-muted-foreground transition-colors"
          >
            <XIcon className="w-5 h-5" />
            Follow @KrackedDevs
          </a>
        </div>
      </div>
    </main>
  );
}
