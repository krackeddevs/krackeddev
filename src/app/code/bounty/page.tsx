"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    <main className="min-h-screen bg-gray-900 relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/code"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors font-mono text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Code Hub
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold font-mono text-white mb-2">
            BOUNTY BOARD
          </h1>
          <p className="text-gray-400">
            Earn rewards by contributing to open-source projects. Complete
            bounties, get paid.
          </p>
        </div>

        {/* Stats Bar */}
        <BountyStatsBar stats={stats} />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent animate-spin rounded-full"></div>
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

            {/* Bounty List */}
            <BountyList
              bounties={filteredBounties}
              filters={filters}
              onClearFilters={clearFilters}
            />
          </>
        )}

        {/* Follow CTA */}
        <div className="mt-12 bg-gray-800/30 border border-gray-700 p-6 text-center">
          <p className="text-gray-400 mb-4">
            Stay updated on new bounties and announcements
          </p>
          <a
            href="https://x.com/KrackedDevs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-mono font-bold hover:bg-gray-200 transition-colors"
          >
            <XIcon className="w-5 h-5" />
            Follow @KrackedDevs
          </a>
        </div>
      </div>
    </main>
  );
}
