"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Terminal, Building2 } from "lucide-react";
import {
  BountyFiltersPanel,
  BountyStatsBar,
  BountyList,
  PollWidget,
  PollWidgetSkeleton,
  fetchActiveBounties,
  fetchBountyStats,
  fetchUniqueTags,
} from "@/features/bounty-board";
import { getActivePoll } from "@/features/admin/poll-actions";
import { createClient } from "@/lib/supabase/client";
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
  const [pollData, setPollData] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

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
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id);

      const [bountiesResult, statsResult, tagsResult, pollResult] = await Promise.all([
        fetchActiveBounties(), // Use server action instead of static data
        fetchBountyStats(),
        fetchUniqueTags(),
        getActivePoll(user?.id) // Pass user ID to check vote status
      ]);
      if (bountiesResult.data) setAllBounties(bountiesResult.data);
      if (statsResult.data) setStats(statsResult.data);
      if (tagsResult.data) setAvailableTags(tagsResult.data);
      if (pollResult.data) setPollData(pollResult.data);
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
    <main className="min-h-screen relative bg-background font-mono">
      <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 grid-background opacity-[0.05]" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/code"
            className="inline-flex items-center text-muted-foreground hover:text-[var(--neon-primary)] transition-colors font-mono text-[10px] mb-4 uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Code Hub
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-4 uppercase tracking-tighter">
            BOUNTY BOARD
          </h1>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Earn rewards by contributing to open-source projects. Complete
            bounties, get paid.
          </p>
        </div>

        {/* Stats Bar */}
        <BountyStatsBar stats={stats} />

        {/* Poll Widget - Only show if data exists and not loading */}
        {!loading && (
          <div className="mt-8">
            {/* Poll Widget */}
            <Suspense fallback={<PollWidgetSkeleton />}>
              {pollData && <PollWidget poll={pollData} userId={currentUserId} />}
            </Suspense>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-[var(--neon-primary)] border-t-transparent animate-spin rounded-none"></div>
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
              <div className="flex items-center gap-3 mb-6 border-b-2 border-[var(--neon-primary)]/30 pb-3">
                <Terminal className="w-6 h-6 text-[var(--neon-primary)]" />
                <h2 className="text-xl md:text-2xl font-bold font-mono text-[var(--neon-primary)] uppercase tracking-tighter">
                  Active Operations
                </h2>
                <span className="text-[9px] text-muted-foreground ml-auto font-mono uppercase tracking-widest font-bold">
                  OFFICIAL PROTOCOLS
                </span>
              </div>
              <BountyList
                bounties={filteredBounties.filter(b => b.status === "active" && b.type === "official")}
                filters={filters}
                onClearFilters={clearFilters}
                hideHeaders={true}
              />
            </div>

            {/* 2. Community Bounties (Open Contracts) */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6 border-b-2 border-[var(--neon-cyan)]/30 pb-3">
                <Building2 className="w-6 h-6 text-[var(--neon-cyan)]" />
                <h2 className="text-xl md:text-2xl font-bold font-mono text-[var(--neon-cyan)] uppercase tracking-tighter">
                  Open Contracts
                </h2>
                <span className="text-[9px] text-muted-foreground ml-auto font-mono uppercase tracking-widest font-bold">
                  COMMUNITY & PARTNERS
                </span>
              </div>
              <BountyList
                bounties={filteredBounties.filter(b => b.status === "active" && b.type === "community")}
                filters={filters}
                onClearFilters={clearFilters}
                hideHeaders={true}
              />
            </div>

            {/* 3. Completed (Mission Archive) */}
            <div className="mb-12 opacity-70">
              <div className="flex items-center gap-3 mb-6 border-b-2 border-muted/20 pb-3">
                <div className="w-3 h-3 rounded-none bg-muted-foreground border border-border"></div>
                <h2 className="text-xl md:text-2xl font-bold font-mono text-muted-foreground uppercase tracking-tighter">
                  Mission Archive
                </h2>
                <span className="text-[9px] text-muted-foreground ml-auto font-mono uppercase tracking-widest font-bold">
                  ARCHIVE
                </span>
              </div>
              <BountyList
                bounties={filteredBounties.filter(b => b.status === "completed" || b.status === "claimed" || b.status === "expired")}
                filters={filters}
                onClearFilters={clearFilters}
                hideHeaders={true}
              />
            </div>
          </>
        )}

        {/* Follow CTA */}
        <div className="mt-16 bg-muted/10 border-2 border-border border-dashed rounded-none p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-primary)]/5 via-transparent to-[var(--neon-primary)]/5" />
          <div className="relative z-10">
            <p className="text-muted-foreground mb-6 text-xs uppercase tracking-widest">
              Stay updated on new bounties and announcements
            </p>
            <a
              href="https://x.com/KrackedDevs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-mono font-bold hover:bg-[var(--neon-primary)] hover:text-background transition-all rounded-none uppercase tracking-wider shadow-xl hover:shadow-[0_0_20px_rgba(var(--neon-primary-rgb),0.3)] group"
            >
              <XIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Follow @KrackedDevs
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
