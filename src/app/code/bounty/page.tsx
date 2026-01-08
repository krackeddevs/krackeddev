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
  BountySidebar,
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
    <main className="min-h-screen relative bg-background font-mono overflow-x-hidden">
      <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 grid-background opacity-[0.05] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-[1600px]">
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area (9 Columns) */}
          <div className="lg:col-span-9 space-y-8">
            {/* Header Section */}
            <div>
              <Link
                href="/"
                className="inline-flex items-center text-muted-foreground hover:text-[var(--neon-primary)] transition-colors font-mono text-[9px] mb-4 uppercase tracking-[0.2em]"
              >
                <ArrowLeft className="w-3 h-3 mr-2" />
                Back to Dashboard
              </Link>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl">💰</span>
                <h1 className="text-3xl md:text-4xl font-bold font-mono text-foreground uppercase tracking-tighter decoration-[var(--neon-primary)] decoration-4 underline-offset-8">
                  BOUNTY BOARD
                </h1>
              </div>
              <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-mono leading-relaxed max-w-2xl opacity-60">
                Earn rewards by contributing to open-source projects. Complete
                bounties, get paid.
              </p>
            </div>

            {/* Stats Bar */}
            <BountyStatsBar stats={stats} />

            {/* Poll Widget */}
            {!loading && (
              <Suspense fallback={<PollWidgetSkeleton />}>
                {pollData && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold font-mono text-foreground uppercase tracking-tight">Community Bounty Poll</h2>
                      <div className="h-px flex-grow bg-border/20" />
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Vote for the next community bounty!</span>
                    </div>
                    <PollWidget poll={pollData} userId={currentUserId} />
                  </div>
                )}
              </Suspense>
            )}

            {/* Loading Spinner */}
            {loading && (
              <div className="flex items-center justify-center py-24">
                <div className="w-10 h-10 border-2 border-[var(--neon-primary)] border-t-transparent animate-spin" />
              </div>
            )}

            {/* Follow CTA at bottom of main content */}
            {!loading && (
              <div className="mt-16 bg-muted/20 border border-border/10 p-10 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[var(--neon-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center">
                  <p className="text-muted-foreground/60 mb-6 text-[10px] font-mono uppercase tracking-[0.3em]">
                    Stay updated on new bounties and announcements
                  </p>
                  <a
                    href="https://x.com/KrackedDevs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[var(--neon-primary)] text-black px-10 py-5 font-mono font-bold hover:scale-105 transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(var(--neon-primary-rgb),0.2)]"
                  >
                    <XIcon className="w-5 h-5" />
                    Follow @KrackedDevs
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area (3 Columns) */}
          <div className="lg:col-span-3">
            {!loading && (
              <div className="lg:sticky lg:top-24">
                <BountySidebar
                  bounties={filteredBounties}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
