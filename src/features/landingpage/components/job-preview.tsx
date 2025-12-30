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
              className="h-48 bg-muted animate-pulse border border-border rounded-sm"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!bounties || bounties.length === 0) return null;

  return (
    <div className="relative z-10 container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Code className="w-6 h-6 text-neon-primary" />
          <h2 className="text-2xl font-bold text-foreground tracking-tight font-mono">
            RECENT TRANSMISSIONS
          </h2>
        </div>
        <Link
          href="/code/bounty"
          className="flex items-center text-sm font-mono text-neon-primary hover:text-neon-secondary uppercase tracking-widest group"
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
              className="relative h-full bg-card/60 border-2 border-neon-primary/30 p-6 hover:border-neon-primary hover:bg-neon-primary/5 transition-all duration-300 flex flex-col justify-between backdrop-blur-sm hover:-translate-y-1"
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
                      ? "border-neon-primary text-neon-primary bg-neon-primary/10"
                      : bounty.status === "completed"
                        ? "border-blue-500 text-blue-400 bg-blue-900/20"
                        : "border-muted text-muted-foreground"
                      }`}
                  >
                    {bounty.status.toUpperCase()}
                  </span>
                  <span className="font-mono font-bold text-yellow-500">
                    RM{bounty.rewardAmount || (bounty as any).reward_amount}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground group-hover:text-neon-primary transition-colors line-clamp-2 font-mono">
                  {bounty.title}
                </h3>

                <p className="text-muted-foreground text-sm line-clamp-2 font-mono">
                  {bounty.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neon-primary/20 flex items-center justify-between text-xs text-muted-foreground font-mono">
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
