"use client";

import { useEffect, useState } from "react";
import { getQuestions, QuestionWithAuthor } from "@/features/community/actions";
import { Plus, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export function TownhallPreview() {
    const [questions, setQuestions] = useState<QuestionWithAuthor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { questions: data } = await getQuestions({ filter: "newest", page: 1 });
            if (data) setQuestions(data.slice(0, 4));
            setIsLoading(false);
        }
        load();
    }, []);

    return (
        <div className="bg-card/40 border border-border/30 rounded-sm p-5 flex flex-col h-full backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-[var(--neon-primary)]">
                <MessageSquare className="w-5 h-5" />
                <h2 className="text-xl font-mono font-bold uppercase tracking-tighter">TOWNHALL</h2>
            </div>

            <div className="flex-grow space-y-5 mb-6">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 w-full bg-[var(--neon-primary)]/5 animate-pulse rounded-sm" />
                    ))
                ) : (
                    questions.map((post) => (
                        <Link
                            key={post.id}
                            href={`/community/question/${post.slug}`}
                            className="group block border-b border-border/10 pb-4 last:border-0 hover:border-[var(--neon-primary)]/20 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-1 text-[9px] font-mono">
                                <span className="text-foreground/40 uppercase tracking-tighter">
                                    {formatDistanceToNow(new Date(post.created_at || Date.now()))} ago
                                </span>
                                <div className="flex gap-1">
                                    {(post.tags || []).slice(0, 2).map((tag, j) => (
                                        <span key={j} className="border border-[var(--neon-primary)]/30 px-1 text-[var(--neon-primary)] bg-[var(--neon-primary)]/5 uppercase font-bold">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <h4 className="text-xs font-mono font-bold text-foreground group-hover:text-[var(--neon-primary)] transition-colors line-clamp-2 mb-1 italic leading-snug">
                                {post.title}
                            </h4>
                            <div className="flex items-center justify-between text-[10px] font-mono">
                                <div className="text-foreground/40">
                                    By <span className="text-[var(--neon-primary)]/80 font-bold">{post.author?.username || "Agent"}</span>
                                </div>
                                {post.answers_count > 0 && (
                                    <div className="flex items-center gap-1 text-[var(--neon-primary)]">
                                        <MessageSquare className="w-2.5 h-2.5" />
                                        <span>{post.answers_count}</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-auto">
                <Button
                    asChild
                    variant="outline"
                    className="border border-[var(--neon-primary)]/40 text-[var(--neon-primary)] hover:bg-[var(--neon-primary)] hover:text-background text-[9px] font-mono font-bold uppercase tracking-widest h-10 px-2"
                >
                    <Link href="/community">
                        COMMUNITY <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                </Button>
                <Button
                    asChild
                    className="bg-transparent border border-[var(--neon-primary)]/40 text-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/10 text-[9px] font-mono font-bold uppercase tracking-widest h-10 px-2"
                >
                    <Link href="/community/ask">
                        <Plus className="w-3 h-3 mr-1" /> ASK QUESTION
                    </Link>
                </Button>
            </div>
        </div>
    );
}
