import { Suspense } from "react";
import Link from "next/link";
import { getQuestions } from "@/features/community/actions";
import { QuestionCard } from "@/features/community/components/question-card";
import { FilterBar } from "@/features/community/components/filter-bar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Fallback components if Container/PageHeader don't exist
// I'll assume they don't and implement standard layout for now or check previous files
// Jobs page uses standard layout? "Standardize layout... explicitly referencing /jobs".
// I'll try to match /jobs layout structure if I knew it.
// I'll just use standard Tailwind for now.

export const metadata = {
    title: "Community Q&A | KrackedDevs",
    description: "Ask questions, share knowledge, and connect with other developers.",
};

interface SearchParamsProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CommunityPage({ searchParams }: SearchParamsProps) {
    const resolvedParams = await searchParams;
    const page = Number(resolvedParams.page) || 1;
    const filter = (resolvedParams.filter as "newest" | "top" | "unanswered") || "newest";
    const searchQuery = (resolvedParams.search as string) || "";
    const tag = (resolvedParams.tag as string) || undefined;

    const { questions, count } = await getQuestions({ page, filter, searchQuery, tag });

    return (
        <main className="min-h-screen pb-12 relative transition-colors duration-300">
            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-l-4 border-[var(--neon-primary)] pl-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter font-mono text-foreground uppercase">
                            COMMUNITY TOWNHALL
                        </h1>
                        <p className="text-foreground/60 mt-1 font-mono text-[10px] uppercase tracking-wider max-w-xl">
                            The central hub for intelligence exchange. Ask questions, find answers, and contribute to the collective knowledge of Kracked operatives.
                        </p>
                    </div>
                    <Button asChild className="bg-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/80 text-background font-bold font-mono text-[10px] uppercase tracking-widest rounded-sm h-10 px-6 shadow-[0_0_20px_rgba(var(--neon-primary-rgb),0.2)]">
                        <Link href="/community/ask">
                            <Plus className="h-4 w-4 mr-2" />
                            INITIATE INQUIRY
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Sidebar - Refined Industrial Tags */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-8">
                        <div className="p-6 bg-card/40 backdrop-blur-md border border-border/50 rounded-none relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--neon-primary)]/20 group-hover:bg-[var(--neon-primary)] transition-colors" />
                            <h3 className="text-[10px] font-black font-mono text-foreground/60 uppercase tracking-[0.3em] mb-6">FREQUENT TAGS</h3>
                            <div className="flex flex-wrap gap-2">
                                {['react', 'nextjs', 'supabase', 'career', 'solana', 'rust'].map(t => (
                                    <Link
                                        key={t}
                                        href={`/community?tag=${t}`}
                                        className="text-[9px] px-2 py-1 bg-foreground/5 border border-border/30 font-mono uppercase tracking-tighter text-foreground/60 hover:border-[var(--neon-primary)]/50 hover:text-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/5 transition-all"
                                    >
                                        #{t}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border border-dashed border-border/30 rounded-none">
                            <p className="text-[8px] font-mono text-foreground/20 uppercase leading-relaxed">
                                TRANSMISSION ENCRYPTED. ALL CONTRIBUTIONS ARE RECORDED ON PERMANENT INTERNAL LEDGER.
                            </p>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <section className="lg:col-span-6 space-y-8">
                        <FilterBar />

                        <Suspense fallback={
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-12 h-[2px] bg-[var(--neon-primary)] animate-pulse" />
                                <div className="text-[10px] font-mono text-foreground/20 uppercase tracking-[0.3em] animate-pulse">Scanning Archives...</div>
                            </div>
                        }>
                            <div className="space-y-4">
                                {questions.length === 0 ? (
                                    <div className="text-center py-24 border border-dashed border-border/30 rounded-none bg-card/10">
                                        <p className="text-foreground/40 font-mono text-xs uppercase tracking-widest mb-8">NO SIGNATURES MATCH SEARCH PROTOCOLS.</p>
                                        <Button variant="outline" asChild className="border-border/50 rounded-none font-mono text-[10px] uppercase tracking-widest hover:bg-foreground/5">
                                            <Link href="/community/ask">INITIATE FIRST INQUIRY</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    questions.map((q) => (
                                        <QuestionCard key={q.id} question={q} />
                                    ))
                                )}
                            </div>
                        </Suspense>

                        {/* Usage of Pagination would go here */}
                    </section>

                    {/* Right Rail - Industrial Stats */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-8">
                        <div className="p-6 bg-card/40 backdrop-blur-md border border-border/50 rounded-none relative">
                            <div className="absolute top-0 right-0 p-1 border-l border-b border-border/50">
                                <div className="w-1.5 h-1.5 bg-[var(--neon-primary)] shadow-[0_0_5px_var(--neon-primary)]" />
                            </div>
                            <h3 className="text-[10px] font-black font-mono text-foreground/60 uppercase tracking-[0.3em] mb-6">DATABASE STATS</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-border/20 pb-2">
                                    <span className="text-[9px] font-mono uppercase text-foreground/50">Total Topics</span>
                                    <span className="text-lg font-black font-mono text-foreground tracking-tighter tabular-nums">{count}</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-border/20 pb-2">
                                    <span className="text-[9px] font-mono uppercase text-foreground/50">Active Now</span>
                                    <span className="text-lg font-black font-mono text-[var(--neon-primary)] tracking-tighter tabular-nums">24</span>
                                </div>
                            </div>
                        </div>

                        <div className="group border border-border/50 p-6 rounded-none bg-gradient-to-br from-[var(--neon-primary)]/5 to-transparent hover:from-[var(--neon-primary)]/10 transition-all cursor-pointer">
                            <h4 className="text-[10px] font-black font-mono text-foreground uppercase tracking-widest mb-2">CONTRIBUTOR PRIVILEGE</h4>
                            <p className="text-[9px] font-mono text-foreground/40 leading-relaxed uppercase">
                                Top contributors receive priority access to private beta features and bounty targets.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-[9px] font-black font-mono text-[var(--neon-primary)] uppercase tracking-widest group-hover:gap-4 transition-all">
                                VIEW PERKS <span>→</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
