import { CommunitySubNav } from "@/features/community/components/shared/community-sub-nav";
import { fetchAllMembers } from "@/features/profiles/actions";
import { MembersList } from "@/features/profiles/components/members-list";
import { Users, ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Members | Kracked Devs",
  description: "Browse all registered developers in the Kracked Devs community.",
};

export const dynamic = 'force-dynamic'; // Always fetch fresh data

const MEMBERS_PER_PAGE = 30;

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.q || '';
  const offset = (currentPage - 1) * MEMBERS_PER_PAGE;

  const { data: members, total, error } = await fetchAllMembers(MEMBERS_PER_PAGE, offset, searchQuery);
  const totalPages = Math.ceil(total / MEMBERS_PER_PAGE);

  return (
    <main className="min-h-screen pb-12 relative transition-colors duration-300">
      <CommunitySubNav />

      {/* Hero Header */}
      <div className="container mx-auto px-4 py-8 relative z-10 max-w-6xl">
        <div className="text-center space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--neon-primary)]/10 border border-[var(--neon-primary)]/20 rounded-none mb-4">
            <Users className="w-3 h-3 text-[var(--neon-primary)]" />
            <span className="text-[10px] font-bold font-mono text-[var(--neon-primary)] tracking-[0.2em] uppercase">VERIFIED OPERATIVES</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground font-mono uppercase leading-none">
            ACTIVE <br className="sm:hidden" /> NETWORK
          </h1>
          <p className="text-foreground/40 font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase max-w-2xl mx-auto">
            {total} CRACKED DEVELOPERS IDENTIFIED IN GLOBAL DATABASE
          </p>

          <div className="flex justify-center pt-8">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[var(--neon-primary)]/50 to-transparent" />
          </div>
        </div>

        {/* Members Grid Container */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {error ? (
            <div className="text-center py-12 text-red-400 font-mono">
              {error}
            </div>
          ) : (
            <MembersList
              members={members}
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </div>
    </main>
  );
}
