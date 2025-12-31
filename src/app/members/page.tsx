import { CommunitySubNav } from "@/features/community/components/shared/community-sub-nav";
import { fetchAllMembers } from "@/features/profiles/actions";
import { MembersList } from "@/features/profiles/components/members-list";
import { Users, ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Members | Kracked Devs",
  description: "Browse all registered developers in the Kracked Devs community.",
};

export default async function MembersPage() {
  const { data: members, error } = await fetchAllMembers(100);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="scanlines fixed inset-0 pointer-events-none z-50 opacity-10 dark:opacity-100"></div>
      <div className="relative z-10">

        <CommunitySubNav />

        {/* Hero Header */}
        <div className="relative border-b border-border overflow-hidden">
          {/* Background glow - Only visible in dark mode or subtle green in light */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-primary/5 dark:bg-neon-primary/10 blur-[100px] -z-10 rounded-full opacity-50 pointer-events-none" />

          <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center space-y-4 relative z-10">
              <h1
                className="text-4xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-foreground to-primary dark:from-neon-primary dark:via-white dark:to-neon-primary animate-pulse-slow glitch-text uppercase"
                data-text="ACTIVE OPERATIVES"
              >
                ACTIVE OPERATIVES
              </h1>
              <p className="text-muted-foreground font-mono text-sm md:text-base tracking-widest uppercase">
                {members.length} registered developers in network
              </p>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {error ? (
            <div className="text-center py-12 text-red-400 font-mono">
              {error}
            </div>
          ) : (
            <MembersList members={members} />
          )}
        </div>
      </div>
    </main>
  );
}
