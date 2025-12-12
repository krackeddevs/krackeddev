"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trophy,
  Clock,
  Tag,
  DollarSign,
  Filter,
  Search,
} from "lucide-react";
import { getAllBounties, getActiveBounties } from "@/lib/bounty";
import { Bounty, BountyDifficulty, BountyStatus } from "@/lib/bounty/types";
import "@/styles/jobs.css";

const difficultyColors: Record<BountyDifficulty, string> = {
  beginner: "bg-green-500/20 text-green-400 border-green-500/50",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  advanced: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  expert: "bg-red-500/20 text-red-400 border-red-500/50",
};

const statusColors: Record<BountyStatus, string> = {
  active: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
  claimed: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  completed: "bg-green-500/20 text-green-400 border-green-500/50",
  expired: "bg-gray-500/20 text-gray-400 border-gray-500/50",
};

function BountyCard({ bounty }: { bounty: Bounty }) {
  const isActive = bounty.status === "active";

  return (
    <Link href={`/code/bounty/${bounty.slug}`}>
      <div
        className={`
          relative p-4 border-2 transition-all duration-200 cursor-pointer
          ${
            isActive
              ? "border-cyan-500/50 bg-gray-800/50 hover:bg-gray-800 hover:border-cyan-400"
              : "border-gray-600/50 bg-gray-800/30 hover:bg-gray-800/50"
          }
        `}
      >
        {/* Reward Badge */}
        <div className="absolute -top-3 -right-3 bg-yellow-500 text-black px-3 py-1 font-mono text-sm font-bold">
          RM{bounty.reward}
        </div>

        <div className="space-y-3">
          {/* Title */}
          <h3 className="font-mono text-lg text-white pr-12 leading-tight">
            {bounty.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm line-clamp-2">
            {bounty.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {bounty.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs font-mono"
              >
                {tag}
              </span>
            ))}
            {bounty.tags.length > 4 && (
              <span className="px-2 py-1 text-gray-500 text-xs font-mono">
                +{bounty.tags.length - 4}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-1 text-xs font-mono border ${
                  difficultyColors[bounty.difficulty]
                }`}
              >
                {bounty.difficulty.toUpperCase()}
              </span>
              <span
                className={`px-2 py-1 text-xs font-mono border ${
                  statusColors[bounty.status]
                }`}
              >
                {bounty.status.toUpperCase()}
              </span>
            </div>
            {bounty.deadline && (
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Clock className="w-3 h-3" />
                <span>{new Date(bounty.deadline).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Submissions indicator */}
          {bounty.submissions.length > 0 && (
            <div className="text-xs text-cyan-400 font-mono">
              {bounty.submissions.length} submission
              {bounty.submissions.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function BountyListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    BountyDifficulty | "all"
  >("all");
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const allBounties = getAllBounties();
  const activeBounties = getActiveBounties();

  const filteredBounties = useMemo(() => {
    let bounties = showActiveOnly ? activeBounties : allBounties;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      bounties = bounties.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          b.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (selectedDifficulty !== "all") {
      bounties = bounties.filter((b) => b.difficulty === selectedDifficulty);
    }

    return bounties;
  }, [
    allBounties,
    activeBounties,
    searchQuery,
    selectedDifficulty,
    showActiveOnly,
  ]);

  // Separate active and other bounties for display
  const displayActiveBounties = filteredBounties.filter(
    (b) => b.status === "active"
  );
  const displayOtherBounties = filteredBounties.filter(
    (b) => b.status !== "active"
  );

  const totalReward = activeBounties.reduce((sum, b) => sum + b.reward, 0);

  return (
    <main className="min-h-screen bg-gray-900 relative">
      <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.push("/code")}
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors font-mono text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Code Hub
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <h1 className="text-3xl md:text-4xl font-bold font-mono text-white tracking-tight">
              BOUNTY BOARD
            </h1>
          </div>
          <p className="text-gray-400 font-mono max-w-2xl">
            Complete coding challenges and earn rewards. Submit your pull
            request to claim a bounty.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-cyan-500/30 p-4">
            <div className="text-cyan-400 font-mono text-sm">
              Active Bounties
            </div>
            <div className="text-2xl font-bold text-white">
              {activeBounties.length}
            </div>
          </div>
          <div className="bg-gray-800/50 border border-yellow-500/30 p-4">
            <div className="text-yellow-400 font-mono text-sm">
              Total Rewards
            </div>
            <div className="text-2xl font-bold text-white">RM{totalReward}</div>
          </div>
          <div className="bg-gray-800/50 border border-green-500/30 p-4">
            <div className="text-green-400 font-mono text-sm">Completed</div>
            <div className="text-2xl font-bold text-white">
              {allBounties.filter((b) => b.status === "completed").length}
            </div>
          </div>
          <div className="bg-gray-800/50 border border-purple-500/30 p-4">
            <div className="text-purple-400 font-mono text-sm">In Progress</div>
            <div className="text-2xl font-bold text-white">
              {allBounties.filter((b) => b.status === "claimed").length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/30 border border-gray-700 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search bounties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 pl-10 pr-4 py-2 font-mono text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) =>
                setSelectedDifficulty(
                  e.target.value as BountyDifficulty | "all"
                )
              }
              className="bg-gray-900 border border-gray-600 px-4 py-2 font-mono text-sm text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>

            {/* Active Only Toggle */}
            <button
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className={`px-4 py-2 font-mono text-sm border transition-colors ${
                showActiveOnly
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                  : "bg-gray-900 border-gray-600 text-gray-400 hover:text-white"
              }`}
            >
              Active Only
            </button>
          </div>
        </div>

        {/* Active Bounties Section */}
        {displayActiveBounties.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold font-mono text-cyan-400 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 animate-pulse"></div>
              ACTIVE BOUNTIES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayActiveBounties.map((bounty) => (
                <BountyCard key={bounty.id} bounty={bounty} />
              ))}
            </div>
          </div>
        )}

        {/* Other Bounties Section */}
        {displayOtherBounties.length > 0 && (
          <div>
            <h2 className="text-xl font-bold font-mono text-gray-400 mb-4">
              OTHER BOUNTIES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayOtherBounties.map((bounty) => (
                <BountyCard key={bounty.id} bounty={bounty} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredBounties.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-500 font-mono text-lg mb-4">
              No bounties found
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDifficulty("all");
                setShowActiveOnly(false);
              }}
              className="text-cyan-400 hover:text-cyan-300 font-mono text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
