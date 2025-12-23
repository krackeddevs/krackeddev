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
        color: "text-yellow-400 bg-yellow-900/30 border-yellow-500/30",
        icon: Clock,
    },
    approved: {
        label: "Accepted",
        color: "text-green-400 bg-green-900/30 border-green-500/30",
        icon: CheckCircle,
    },
    rejected: {
        label: "Rejected",
        color: "text-red-400 bg-red-900/30 border-red-500/30",
        icon: XCircle,
    },
};

// Special config for WON submissions (approved + paid)
const wonConfig = {
    label: "Won!",
    color: "text-amber-400 bg-amber-900/40 border-amber-500/50",
    icon: Trophy,
};

export function MySubmissions({ submissions, className }: MySubmissionsProps) {
    if (submissions.length === 0) {
        return (
            <Card className={cn("bg-black/40 border-white/10 backdrop-blur-md", className)}>
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
        <Card className={cn("bg-black/40 border-white/10 backdrop-blur-md", className)}>
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

                    return (
                        <Link
                            key={submission.id}
                            href={`/code/bounty/${submission.bountySlug}`}
                            className="block group"
                        >
                            <div className={cn(
                                "flex items-center justify-between gap-4 p-3 bg-white/5 border border-white/10 hover:border-neon-primary/50 transition-colors",
                                isWon && "border-amber-500/30 bg-amber-900/10" // Highlight won submissions
                            )}>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        {isWon && <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                                        <h4 className={cn(
                                            "font-mono text-sm truncate group-hover:text-neon-primary transition-colors",
                                            isWon ? "text-amber-100" : "text-white"
                                        )}>
                                            {submission.bountyTitle}
                                        </h4>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono mt-1">
                                        {new Date(submission.createdAt).toLocaleDateString("en-MY", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "font-mono text-sm font-bold",
                                        isWon ? "text-amber-400" : "text-neon-cyan"
                                    )}>
                                        RM{submission.bountyReward}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "font-mono text-xs flex items-center gap-1 border",
                                            config.color
                                        )}
                                    >
                                        <StatusIcon className="w-3 h-3" />
                                        {config.label}
                                    </Badge>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-neon-primary transition-colors" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </CardContent>
        </Card>
    );
}

