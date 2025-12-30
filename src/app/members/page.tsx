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
    <main className="min-h-screen">
      <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-card/50 border-b border-border">
          <div className="container mx-auto px-4 py-6 max-w-5xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-mono text-sm mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            {/* Tab Navigation */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 border-2 border-neon-primary/50 text-neon-primary bg-neon-primary/10 rounded-lg">
                <Users className="w-4 h-4" />
                <span className="font-mono text-sm">Members</span>
              </div>
              <Link
                href="/leaderboard"
                className="flex items-center gap-2 px-4 py-2 border-2 border-border hover:border-neon-primary text-muted-foreground hover:text-neon-primary transition-colors"
              >
                <Trophy className="w-4 h-4" />
                <span className="font-mono text-sm">Leaderboard</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neon-primary/10 border-2 border-neon-primary flex items-center justify-center">
                <Users className="w-6 h-6 text-neon-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-mono text-foreground">
                  COMMUNITY MEMBERS
                </h1>
                <p className="text-muted-foreground font-mono text-sm">
                  {members.length} registered developers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="container mx-auto px-4 py-8 max-w-5xl">
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
