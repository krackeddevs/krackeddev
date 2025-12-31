"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { vote } from "@/features/community/actions";
import { toast } from "@/lib/toast";

interface VotingControlProps {
    upvotes: number;
    resourceType: "question" | "answer";
    resourceId: string;
    initialVoteDirection?: "up" | "down" | null;
    orientation?: "vertical" | "horizontal";
    className?: string;
}

export function VotingControl({
    upvotes: initialUpvotes,
    resourceType,
    resourceId,
    initialVoteDirection = null,
    orientation = "vertical",
    className
}: VotingControlProps) {
    const [optimisticUpvotes, setOptimisticUpvotes] = useState(initialUpvotes);
    const [userVote, setUserVote] = useState<"up" | "down" | null>(initialVoteDirection);
    const [isPending, startTransition] = useTransition();

    const handleVote = (direction: "up" | "down") => {
        // Optimistic Update
        const previousVote = userVote;
        const previousCount = optimisticUpvotes;

        let newCount = previousCount;
        let newVote = direction;

        if (previousVote === direction) {
            // Toggle off
            newVote = null as any;
            if (direction === "up") newCount--;
            // If we supported tracking downvotes in count, we'd adjust here too
        } else {
            // Switch or New
            if (direction === "up") {
                newCount++; // purely adding 1 for Up
                if (previousVote === "down") {
                    // If switching from down to up, strictly speaking we are just removing the 'down' status
                    // But if count is only "upvotes", then we just increment.
                }
            } else {
                // Downvote
                if (previousVote === "up") newCount--;
            }
        }

        setOptimisticUpvotes(newCount);
        setUserVote(newVote);

        startTransition(async () => {
            const result = await vote(resourceType, resourceId, direction);
            if (result.error) {
                // Revert
                setOptimisticUpvotes(previousCount);
                setUserVote(previousVote);
                toast.error(result.error || "Vote failed");
            } else if (direction === "up" && newVote === "up") {
                // simple success feedback occasionally?
            }
        });
    };

    return (
        <div className={cn("flex items-center gap-1", orientation === "vertical" ? "flex-col" : "flex-row", className)}>
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "h-8 w-8 rounded-full transition-all",
                    userVote === "up"
                        ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                        : "hover:bg-green-500/10 hover:text-green-500 text-muted-foreground"
                )}
                onClick={() => handleVote("up")}
                disabled={isPending}
            >
                <ChevronUp className="h-6 w-6" />
            </Button>

            <span className={cn(
                "font-mono font-bold text-lg select-none min-w-[1ch] text-center",
                userVote === "up" && "text-green-500",
                userVote === "down" && "text-red-500"
            )}>
                {optimisticUpvotes}
            </span>

            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "h-8 w-8 rounded-full transition-all",
                    userVote === "down"
                        ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                        : "hover:bg-red-500/10 hover:text-red-500 text-muted-foreground"
                )}
                onClick={() => handleVote("down")}
                disabled={isPending}
            >
                <ChevronDown className="h-6 w-6" />
            </Button>
        </div>
    );
}
