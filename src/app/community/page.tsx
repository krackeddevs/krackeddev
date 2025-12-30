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
        <main className="min-h-screen pt-24 pb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Community Townhall</h1>
                        <p className="text-muted-foreground mt-1">
                            Ask questions, find answers, and help your fellow developers.
                        </p>
                    </div>
                    <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                        <Link href="/community/ask">
                            <Plus className="h-4 w-4 mr-2" />
                            Ask Question
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar (Hidden on mobile for now, or just tags) */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-6">
                        <div className="p-4 rounded-lg border bg-card">
                            <h3 className="font-semibold mb-2">Popular Tags</h3>
                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                {/* Placeholder tags - fetch these later */}
                                <Link href="/community?tag=react" className="hover:text-primary">#react</Link>
                                <Link href="/community?tag=nextjs" className="hover:text-primary">#nextjs</Link>
                                <Link href="/community?tag=supabase" className="hover:text-primary">#supabase</Link>
                                <Link href="/community?tag=career" className="hover:text-primary">#career</Link>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <section className="lg:col-span-7 space-y-6">
                        <FilterBar />

                        <Suspense fallback={<div className="text-center py-10">Loading questions...</div>}>
                            <div className="space-y-4">
                                {questions.length === 0 ? (
                                    <div className="text-center py-12 border rounded-lg bg-muted/20">
                                        <p className="text-muted-foreground mb-4">No questions found matching your criteria.</p>
                                        <Button variant="outline" asChild>
                                            <Link href="/community/ask">Be the first to ask!</Link>
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

                    {/* Right Rail */}
                    <aside className="hidden lg:block lg:col-span-2 space-y-6">
                        <div className="p-4 rounded-lg border bg-card">
                            <h3 className="font-semibold mb-2 text-sm">Stats</h3>
                            <div className="space-y-2 text-xs text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>Questions</span>
                                    <span className="font-medium text-foreground">{count}</span>
                                </div>
                                {/* More stats */}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
