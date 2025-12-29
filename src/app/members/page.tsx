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
        <div className="bg-gray-800/50 border-b border-gray-700">
          <div className="container mx-auto px-4 py-6 max-w-5xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-mono text-sm mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            {/* Tab Navigation */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-neon-primary/20 border-2 border-neon-primary">
                <Users className="w-4 h-4 text-neon-primary" />
                <span className="font-mono text-sm text-neon-primary">Members</span>
              </div>
              <Link
                href="/leaderboard"
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-600 hover:border-amber-500 text-gray-400 hover:text-amber-400 transition-colors"
              >
                <Trophy className="w-4 h-4" />
                <span className="font-mono text-sm">Leaderboard</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neon-primary/20 border-2 border-neon-primary flex items-center justify-center">
                <Users className="w-6 h-6 text-neon-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-mono text-white">
                  COMMUNITY MEMBERS
                </h1>
                <p className="text-gray-400 font-mono text-sm">
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
