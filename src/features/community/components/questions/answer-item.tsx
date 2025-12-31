"use client";

import { useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarkdownViewer } from "@/components/markdown-viewer";
import { VotingControl } from "@/features/community/components/voting-control";
import { CommentList } from "@/features/community/components/comment-list";
import { acceptAnswer } from "@/features/community/actions";
import { toast } from "@/lib/toast";
import { FlagModal } from "@/features/moderation/components/flag-modal";
import { Flag } from "lucide-react";

// Note: We'll need to define types or import them. For now using basic shapes matching the page.

interface AnswerItemProps {
    answer: {
        id: string;
        body: string;
        created_at: string;
        is_accepted: boolean;
        upvotes: number;
        author: {
            username: string | null;
            avatar_url: string | null;
        };
        comments: any[];
    };
    questionId: string;
    questionAuthorId: string;
    currentUserId?: string;
}

export function AnswerItem({
    answer,
    questionId,
    questionAuthorId,
    currentUserId
}: AnswerItemProps) {
    const [isPending, startTransition] = useTransition();

    const isQuestionAuthor = currentUserId === questionAuthorId;
    // content.author_id is available from the query `*` selection
    const isSelfAnswer = currentUserId === (answer as any).author_id;
    // Actually, looking at getQuestionBySlug, answer.author is just { username, avatar_url }. 
    // We probably need author_id in the answer object.

    // ACTION ITEM: Update getQuestionBySlug to return author_id as well. 
    // For now assuming it is or will be there.

    const handleAccept = async () => {
        if (!isQuestionAuthor) return;

        startTransition(async () => {
            const result = await acceptAnswer(questionId, answer.id);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Answer Accepted! +100 XP to author.");
            }
        });
    };

    return (
        <div className={cn(
            "relative flex gap-6 p-6 rounded-xl border transition-all hover:bg-card/90 group",
            answer.is_accepted
                ? "bg-green-500/5 border-green-500/30 shadow-[0_0_15px_-3px_rgba(34,197,94,0.1)]"
                : "bg-card/80 backdrop-blur-sm shadow-sm"
        )}>
            {/* Accepted Badge / Button */}
            <div className="absolute top-0 right-0 p-2">
                {answer.is_accepted ? (
                    <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-xs font-bold animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 className="h-4 w-4" />
                        ACCEPTED
                    </div>
                ) : (
                    // Show Accept Button ONLY to Question Author if not already accepted (or allow switching?)
                    // Story says: "Toggle behavior... Visual feedback: Green checkmark".
                    // If I am question author, I should see a button to accept this.
                    isQuestionAuthor && !isSelfAnswer && (
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPending}
                            onClick={handleAccept}
                            className="text-muted-foreground hover:text-green-500 hover:bg-green-500/10 opacity-0 group-hover:opacity-100 transition-all gap-2"
                        >
                            <Check className="h-4 w-4" />
                            Mark as Answer
                        </Button>
                    )
                )}
            </div>

            <div className="hidden sm:block pt-12">
                <VotingControl
                    upvotes={answer.upvotes}
                    resourceType="answer"
                    resourceId={answer.id}
                    initialVoteDirection={null} // We need to fetch this or pass it? For now null.
                />
            </div>

            <div className="flex-1 min-w-0">
                {/* Answer Body & User Card Side-by-Side */}
                <div className="flex gap-4 sm:gap-8 flex-col sm:flex-row">
                    <div className="flex-1 min-w-0 space-y-4">
                        <MarkdownViewer content={answer.body} />

                        {/* Mobile User Card */}
                        <div className="sm:hidden flex justify-end pt-2 border-t border-border/50">
                            <UserCard user={answer.author} date={answer.created_at} label="answered" resourceId={answer.id} showFlag={!isSelfAnswer} />
                        </div>
                    </div>

                    {/* Desktop User Side Column */}
                    <div className="hidden sm:block shrink-0 pt-2">
                        <UserCard user={answer.author} date={answer.created_at} label="answered" align="right" resourceId={answer.id} showFlag={!isSelfAnswer} />
                    </div>
                </div>

                <div className="mt-4">
                    <CommentList comments={answer.comments || []} answerId={answer.id} />
                </div>
            </div>
        </div>
    );
}

// Reusing UserCard component (maybe move to shared later)
function UserCard({
    user,
    date,
    label,
    align = "right",
    // Prop drilling for flagging
    resourceId,
    showFlag
}: {
    user: { username: string | null, avatar_url: string | null },
    date: string,
    label: string,
    align?: "left" | "right",
    resourceId?: string,
    showFlag?: boolean
}) {
    const isLeft = align === "left";

    return (
        <div className={`flex items-center gap-3 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
            {showFlag && resourceId && (
                <div className={isLeft ? "mr-1" : "ml-1"}>
                    <FlagModal resourceId={resourceId} resourceType="answer">
                        <button className="text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100" title="Flag answer">
                            <Flag className="h-3 w-3" />
                        </button>
                    </FlagModal>
                </div>
            )}
            <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"} text-xs`}>
                <span className="text-muted-foreground">{label} <span className="text-foreground/80">{formatDistanceToNow(new Date(date), { addSuffix: true })}</span></span>
                <Link href={`/profile/${user.username}`} className="font-semibold text-primary hover:underline">
                    {user.username || "Anonymous"}
                </Link>
            </div>
            <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
                <AvatarImage src={user.avatar_url || ""} />
                <AvatarFallback className="bg-primary/5 text-primary">{user.username?.[0] || "?"}</AvatarFallback>
            </Avatar>
        </div>
    );
}
