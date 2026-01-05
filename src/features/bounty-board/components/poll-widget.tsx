"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader2, CheckCircle2, ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { votePoll } from "@/features/admin/poll-actions";
import { cn } from "@/lib/utils";

interface PollOption {
    id: string;
    label: string;
    difficulty?: string | null;
    description?: string | null;
    requirements?: string[] | null;
    estimated_reward?: number | null;
}

interface PollData {
    id: string;
    question: string;
    description: string | null;
    end_at: string;
    options: PollOption[];
    results: Record<string, number>; // optionId -> count
    userVoteId: string | null;
}

const difficultyColors = {
    beginner: "bg-neon-primary/20 text-neon-primary border-neon-primary/50",
    intermediate: "bg-rank-gold/20 text-rank-gold border-rank-gold/50",
    advanced: "bg-rank-bronze/20 text-rank-bronze border-rank-bronze/50",
    expert: "bg-destructive/20 text-destructive border-destructive/50",
};

export function PollWidget({ poll, userId }: { poll: PollData | null; userId?: string }) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedOptions, setExpandedOptions] = useState<string[]>([]);

    if (!poll) return null;

    const isExpired = new Date(poll.end_at) < new Date();
    const hasVoted = !!poll.userVoteId;
    const showResults = hasVoted || isExpired;

    const totalVotes = Object.values(poll.results).reduce((a, b) => a + b, 0);

    const toggleExpanded = (optionId: string) => {
        setExpandedOptions(prev =>
            prev.includes(optionId)
                ? prev.filter(id => id !== optionId)
                : [...prev, optionId]
        );
    };

    async function handleVote() {
        if (!selectedOption) {
            toast.error("Select a bounty", {
                description: "Please select a bounty proposal to vote for.",
            });
            return;
        }
        if (!userId) {
            toast.error("Login Required", {
                description: "You need to be logged in to vote.",
            });
            return;
        }

        setIsSubmitting(true);
        const result = await votePoll(poll!.id, selectedOption);

        if (result.error) {
            toast.error("Error", {
                description: result.error,
            });
            setIsSubmitting(false);
        } else {
            toast.success("Vote Recorded!", {
                description: "Thanks for helping decide the next community bounty!",
            });
        }
    }

    return (
        <div className="mb-12 bg-card/30 border border-neon-cyan/20 p-6 rounded-lg relative overflow-hidden group">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl -z-10 group-hover:bg-neon-cyan/10 transition-all duration-500"></div>

            <div className="space-y-6">
                {/* Header */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                            <span className="text-xs font-mono text-neon-cyan tracking-widest uppercase">
                                {isExpired ? "Poll Ended" : "Community Bounty Poll"}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                            {isExpired
                                ? `Ended ${formatDistanceToNow(new Date(poll.end_at))} ago`
                                : `Ends ${formatDistanceToNow(new Date(poll.end_at), { addSuffix: true })}`
                            }
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold font-mono text-foreground">
                        {poll.question}
                    </h3>

                    {poll.description && (
                        <p className="text-sm text-muted-foreground">
                            {poll.description}
                        </p>
                    )}

                    {totalVotes > 0 && (
                        <p className="text-xs text-muted-foreground font-mono">
                            {totalVotes} vote{totalVotes !== 1 ? 's' : ''} cast
                        </p>
                    )}
                </div>

                {/* Bounty Options */}
                <div className="grid gap-4">
                    {poll.options.map((option) => {
                        const votes = poll.results[option.id] || 0;
                        const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                        const isSelected = selectedOption === option.id;
                        const isUserVote = poll.userVoteId === option.id;
                        const isExpanded = expandedOptions.includes(option.id);
                        const hasDetails = option.description || (option.requirements && option.requirements.length > 0);

                        return (
                            <Card
                                key={option.id}
                                className={cn(
                                    "border transition-all group/card",
                                    showResults
                                        ? "border-border/50 bg-card/40"
                                        : isSelected
                                            ? "border-neon-cyan bg-neon-cyan/5 shadow-lg shadow-neon-cyan/20"
                                            : "border-border/50 bg-card/40 hover:border-neon-cyan/50 hover:bg-card/60"
                                )}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div
                                            className="flex-1 space-y-2 cursor-pointer"
                                            onClick={() => !showResults && setSelectedOption(option.id)}
                                        >
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-bold text-lg leading-tight">{option.label}</h4>
                                                {option.difficulty && (
                                                    <Badge className={cn("text-xs uppercase", difficultyColors[option.difficulty as keyof typeof difficultyColors])}>
                                                        {option.difficulty}
                                                    </Badge>
                                                )}
                                                {isUserVote && (
                                                    <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Your Vote
                                                    </Badge>
                                                )}
                                            </div>

                                            {option.estimated_reward && (
                                                <div className="flex items-center gap-1 text-sm text-rank-gold">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span className="font-mono font-bold">RM {option.estimated_reward}</span>
                                                </div>
                                            )}
                                        </div>

                                        {hasDetails && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleExpanded(option.id);
                                                }}
                                                className="text-muted-foreground hover:text-foreground shrink-0"
                                            >
                                                {isExpanded ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>

                                {isExpanded && hasDetails && (
                                    <CardContent className="pt-0 space-y-3 border-t border-border/30">
                                        {option.description && (
                                            <div className="pt-3">
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {option.description}
                                                </p>
                                            </div>
                                        )}

                                        {option.requirements && option.requirements.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-xs font-mono text-neon-primary uppercase tracking-wider">Key Requirements:</p>
                                                <ul className="space-y-1 text-sm text-muted-foreground">
                                                    {option.requirements.map((req, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <span className="text-neon-cyan mt-1">•</span>
                                                            <span>{req}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>
                                )}

                                {/* Results */}
                                {showResults && (
                                    <CardContent className="pt-0 pb-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs font-mono">
                                                <span className="text-muted-foreground">
                                                    {votes} vote{votes !== 1 ? 's' : ''}
                                                </span>
                                                <span className={cn(
                                                    "font-bold",
                                                    percentage > 50 ? "text-neon-primary" : "text-muted-foreground"
                                                )}>
                                                    {percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={percentage}
                                                className="h-2 bg-muted/50"
                                            />
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* Vote Button */}
                {!showResults && (
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-muted-foreground">
                            {selectedOption ? "Ready to vote!" : "Select a bounty proposal to vote"}
                        </p>
                        <Button
                            onClick={handleVote}
                            disabled={!selectedOption || isSubmitting || !userId}
                            className="bg-neon-cyan hover:bg-neon-cyan/90 text-black font-bold uppercase tracking-wider"
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Cast Vote
                        </Button>
                    </div>
                )}

                {/* Results Summary */}
                {showResults && (
                    <div className="pt-4 border-t border-border/30">
                        {isExpired ? (
                            <p className="text-sm text-muted-foreground text-center font-mono">
                                Poll ended. {totalVotes > 0 ? "The winning bounty will be created soon!" : "No votes were cast."}
                            </p>
                        ) : hasVoted ? (
                            <p className="text-sm text-neon-cyan text-center font-mono">
                                Thanks for voting! Poll closes {formatDistanceToNow(new Date(poll.end_at), { addSuffix: true })}.
                            </p>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}
