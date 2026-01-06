"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { QuestionWithAuthor } from "../actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, ThumbsUp, CheckCircle2, Flag } from "lucide-react";
import { FlagModal } from "@/features/moderation/components/flag-modal";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
    question: QuestionWithAuthor;
}

export function QuestionCard({ question }: QuestionCardProps) {
    const isSolved = !!question.accepted_answer_id;

    return (
        <div className="flex flex-col sm:flex-row gap-6 p-5 border border-border/50 rounded-sm bg-card/40 backdrop-blur-sm hover:border-[var(--neon-primary)]/40 hover:bg-foreground/[0.02] transition-all duration-300 group">
            {/* Stats (Left on Desktop, Top on Mobile) */}
            <div className="flex sm:flex-col gap-5 sm:gap-3 text-foreground/40 text-[10px] sm:w-16 shrink-0 font-mono font-bold uppercase tracking-tight">
                <div className="flex items-center gap-1.5 group-hover:text-foreground/60 transition-colors">
                    <span className="tabular-nums">{question.upvotes}</span>
                    <ThumbsUp className="h-3.5 w-3.5" />
                </div>
                <div className={cn(
                    "flex items-center gap-1.5 transition-colors",
                    isSolved ? "text-[var(--neon-primary)]" : "group-hover:text-foreground/60"
                )}>
                    <span className="tabular-nums">{question.answers_count}</span>
                    {isSolved ? <CheckCircle2 className="h-3.5 w-3.5 shadow-[0_0_10px_var(--neon-primary)]" /> : <MessageSquare className="h-3.5 w-3.5" />}
                </div>
                <div className="flex items-center gap-1.5 group-hover:text-foreground/60 transition-colors">
                    <span className="tabular-nums">{question.view_count}</span>
                    <Eye className="h-3.5 w-3.5" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-2.5 min-w-0">
                <Link
                    href={`/community/question/${question.slug}`}
                    className="font-bold text-lg text-foreground group-hover:text-[var(--neon-primary)] transition-colors duration-300 line-clamp-1 tracking-tight"
                >
                    {question.title}
                </Link>

                <p className="text-foreground/50 text-[13px] leading-relaxed line-clamp-2 font-mono">
                    {question.body.replace(/[#*`]/g, '')}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {question.tags?.map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="text-[9px] px-2 py-0 h-5 font-bold font-mono uppercase tracking-widest border-border/50 bg-background/40 hover:border-[var(--neon-primary)]/50 hover:text-[var(--neon-primary)] transition-colors rounded-none"
                            >
                                #{tag}
                            </Badge>
                        ))}
                    </div>

                    {/* Author & Time & Actions */}
                    <div className="flex items-center gap-3 text-[10px] font-mono text-foreground/60 ml-auto uppercase tracking-tighter">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <FlagModal resourceId={question.id} resourceType="question">
                                <button className="hover:text-red-500 transition-colors" title="Flag as inappropriate">
                                    <Flag className="h-3 w-3" />
                                </button>
                            </FlagModal>
                        </div>
                        <Avatar className="h-5 w-5 rounded-none border border-border/50 grayscale group-hover:grayscale-0 transition-all">
                            <AvatarImage src={question.author?.avatar_url || ""} />
                            <AvatarFallback className="rounded-none bg-muted/50 text-[10px]">{question.author?.username?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground/80 group-hover:text-[var(--neon-primary)] transition-colors">{question.author?.username || "Anonymous"}</span>
                            <span className="opacity-40">•</span>
                            <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
