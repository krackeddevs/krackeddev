"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Comment } from "@/types/database";
import { CommentForm } from "./comment-form";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentWithAuthor extends Comment {
    author: {
        username: string | null;
        avatar_url: string | null;
    };
}

interface CommentListProps {
    comments: CommentWithAuthor[];
    answerId: string;
}

export function CommentList({ comments, answerId }: CommentListProps) {
    const [isReplying, setIsReplying] = useState(false);

    return (
        <div className="mt-4 pt-4 border-t border-border/40 pl-4 md:pl-8">
            <div className="space-y-3">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 text-sm group py-2">
                        <Avatar className="h-6 w-6 mt-0.5">
                            <AvatarImage src={comment.author.avatar_url || ""} />
                            <AvatarFallback>{comment.author.username?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-0.5">
                                <Link
                                    href={`/profile/${encodeURIComponent(comment.author.username || "")}`}
                                    className="font-semibold text-foreground/90 hover:underline hover:text-primary text-xs"
                                >
                                    {comment.author.username || "Anonymous"}
                                </Link>
                                <span className="text-muted-foreground/50 text-[10px]">•</span>
                                <span className="text-muted-foreground/60 text-xs">
                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                </span>
                            </div>

                            <div className="text-muted-foreground/90 leading-relaxed break-words whitespace-pre-wrap">
                                {comment.body}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!isReplying ? (
                <Button
                    variant="link"
                    size="sm"
                    className="text-muted-foreground p-0 h-auto mt-2 hover:no-underline hover:text-foreground op-70"
                    onClick={() => setIsReplying(true)}
                >
                    Add a comment
                </Button>
            ) : (
                <CommentForm
                    answerId={answerId}
                    onSuccess={() => setIsReplying(false)}
                    onCancel={() => setIsReplying(false)}
                />
            )}
        </div>
    );
}
