"use client";

import Link from "next/link";
import { ArrowRight, Trophy, Clock, Code } from "lucide-react";
import { useRecentBounties } from "@/lib/hooks/use-landing-data";

export function JobPreview() {
  const { data: bounties, isLoading } = useRecentBounties();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-800/50 animate-pulse border border-gray-700/50 rounded-sm"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!bounties || bounties.length === 0) return null;

  return (
    <div className="relative z-10 container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <Code className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-bold text-white tracking-tight font-mono">
            RECENT TRANSMISSIONS
          </h2>
        </div>
        <Link
          href="/code/bounty"
          className="flex items-center text-sm font-mono text-green-500 hover:text-green-400 uppercase tracking-widest group"
        >
          View All Bounties
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bounties.map((bounty) => (
          <Link
            key={bounty.id}
            href={`/code/bounty/${bounty.slug}`}
            className="group relative block h-full"
          >
            <div
              className="relative h-full bg-black/40 border-2 border-green-400/30 p-6 hover:border-green-400 hover:bg-green-400/5 transition-all duration-300 flex flex-col justify-between backdrop-blur-sm hover:-translate-y-1"
              style={{
                boxShadow: '0 0 0 rgba(34, 197, 94, 0)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 rgba(34, 197, 94, 0)';
              }}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span
                    className={`px-2 py-1 text-xs font-mono border ${bounty.status === "open"
                      ? "border-green-500 text-green-400 bg-green-900/20"
                      : bounty.status === "completed"
                        ? "border-blue-500 text-blue-400 bg-blue-900/20"
                        : "border-gray-500 text-gray-400"
                      }`}
                  >
                    {bounty.status.toUpperCase()}
                  </span>
                  <span className="font-mono font-bold text-yellow-500">
                    RM{bounty.rewardAmount || (bounty as any).reward_amount}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors line-clamp-2 font-mono">
                  {bounty.title}
                </h3>

                <p className="text-green-400/60 text-sm line-clamp-2 font-mono">
                  {bounty.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-green-400/20 flex items-center justify-between text-xs text-green-400/50 font-mono">
                <span className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {bounty.type}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(bounty.createdAt || (bounty as any).created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
