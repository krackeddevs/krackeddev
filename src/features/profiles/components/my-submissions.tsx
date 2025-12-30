"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, XCircle, Clock, ExternalLink, Trophy } from "lucide-react";
import { UserSubmission } from "../types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MySubmissionsProps {
    submissions: UserSubmission[];
    className?: string;
}

const statusConfig = {
    pending: {
        label: "Under Review",
        color: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
        icon: Clock,
    },
    approved: {
        label: "Accepted",
        color: "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/30",
        icon: CheckCircle,
    },
    rejected: {
        label: "Rejected",
        color: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30",
        icon: XCircle,
    },
};

// Special config for WON submissions (approved + paid)
const wonConfig = {
    label: "Won!",
    color: "text-amber-600 dark:text-amber-400 bg-amber-500/20 border-amber-500/50",
    icon: Trophy,
};

export function MySubmissions({ submissions, className }: MySubmissionsProps) {
    if (submissions.length === 0) {
        return (
            <Card className={cn("bg-card/40 border-border backdrop-blur-md", className)}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-neon-primary font-mono text-sm uppercase tracking-widest">
                        <FileText className="w-4 h-4" />
                        My Submissions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground font-mono text-sm text-center py-4">
                        No bounty submissions yet. Start hunting!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn("bg-card/40 border-border backdrop-blur-md", className)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-neon-primary font-mono text-sm uppercase tracking-widest">
                    <FileText className="w-4 h-4" />
                    My Submissions ({submissions.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {submissions.map((submission) => {
                    // Check if this is a WON submission (approved + paid)
                    const isWon = submission.status === "approved" && submission.paidAt;
                    const config = isWon ? wonConfig : statusConfig[submission.status];
                    const StatusIcon = config.icon;

                    const date = new Date(submission.createdAt);
                    const day = date.getDate();
                    const month = date.toLocaleString('default', { month: 'short' });
                    const year = date.getFullYear();

                    return (
                        <Link
                            key={submission.id}
                            href={`/code/bounty/${submission.bountySlug}`}
                            className="block group"
                        >
                            <div className={cn(
                                "flex items-start gap-3 p-3 bg-card/20 border border-border hover:border-neon-primary/50 hover:bg-muted/10 transition-colors rounded-lg overflow-hidden",
                                isWon && "border-amber-500/30 bg-amber-500/5" // Highlight won submissions
                            )}>
                                {/* Date Block */}
                                <div className="flex flex-col items-start leading-none font-mono text-muted-foreground w-[40px] flex-shrink-0">
                                    <span className="text-xl font-bold text-foreground mb-1">{day}</span>
                                    <span className="text-xs uppercase">{month}</span>
                                    <span className="text-xs">{year}</span>
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col gap-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className={cn(
                                            "font-mono text-sm truncate group-hover:text-neon-primary transition-colors pr-2 flex-1 min-w-0",
                                            isWon ? "text-amber-600 dark:text-amber-100" : "text-foreground"
                                        )}>
                                            {submission.bountyTitle}
                                        </h4>
                                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-neon-primary transition-colors flex-shrink-0" />
                                    </div>

                                    <div className="flex items-center flex-wrap gap-2">
                                        <span className={cn(
                                            "font-mono text-lg font-bold leading-none",
                                            isWon ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-500"
                                        )}>
                                            RM{submission.bountyReward}
                                        </span>

                                        <div className={cn(
                                            "flex items-center gap-1.5 px-2 py-0.5 border backdrop-blur-sm rounded leading-none",
                                            config.color
                                        )}>
                                            <StatusIcon className="w-3 h-3" />
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-wide translate-y-[1px]">
                                                {config.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </CardContent>
        </Card>
    );
}
