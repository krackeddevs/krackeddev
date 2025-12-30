"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { QuestionWithAuthor } from "../actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, ThumbsUp, CheckCircle2 } from "lucide-react";

interface QuestionCardProps {
    question: QuestionWithAuthor;
}

export function QuestionCard({ question }: QuestionCardProps) {
    const isSolved = !!question.accepted_answer_id;

    return (
        <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
            {/* Stats (Left on Desktop, Top on Mobile) */}
            <div className="flex sm:flex-col gap-4 sm:gap-2 text-muted-foreground text-xs sm:w-16 shrink-0">
                <div className="flex items-center gap-1">
                    <span className="font-medium">{question.upvotes}</span>
                    <ThumbsUp className="h-3 w-3" />
                </div>
                <div className={`flex items-center gap-1 ${isSolved ? "text-green-500 font-bold" : ""}`}>
                    <span className="font-medium">{question.answers_count}</span>
                    {isSolved ? <CheckCircle2 className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-medium">{question.view_count}</span>
                    <Eye className="h-3 w-3" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-2">
                <Link href={`/community/question/${question.slug}`} className="font-semibold text-lg text-foreground hover:text-green-400 transition-colors line-clamp-1">
                    {question.title}
                </Link>

                <p className="text-muted-foreground text-sm line-clamp-2">
                    {question.body.replace(/[#*`]/g, '')} {/* Simple strip markdown chars */}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {question.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-mono">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {/* Author & Time */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={question.author.avatar_url || ""} />
                            <AvatarFallback>{question.author.username?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <span>
                            <span className="font-medium text-foreground">{question.author.username || "Anonymous"}</span>
                            {" • "}
                            {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
