"use client";

import { useState } from "react";
import { BountySubmissionRow } from "@/types/database";
import { Button } from "@/components/ui/button";
import { ExternalLink, Check, X, Loader2, GitPullRequest } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
// We will create this action next
import { updateSubmissionStatus } from "@/features/dashboard/actions";

interface SubmissionListProps {
    submissions: BountySubmissionRow[];
    isOwner: boolean;
}

export function SubmissionList({ submissions, isOwner }: SubmissionListProps) {
    const [actioningId, setActioningId] = useState<string | null>(null);

    const handleAction = async (submissionId: string, newStatus: 'approved' | 'rejected') => {
        setActioningId(submissionId);
        try {
            const result = await updateSubmissionStatus(submissionId, newStatus);
            if (result.success) {
                toast.success(`Submission ${newStatus} successfully`);
            } else {
                toast.error(result.error || "Failed to update submission");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        } finally {
            setActioningId(null);
        }
    };

    if (submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed rounded-lg bg-card/50">
                <GitPullRequest className="w-10 h-10 mb-3 opacity-20" />
                <p>No submissions yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {submissions.map((sub) => (
                <div key={sub.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-card hover:border-gray-700 transition-colors gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <a
                                href={sub.pull_request_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-neon-primary hover:underline flex items-center gap-1 font-bold"
                            >
                                <GitPullRequest className="w-4 h-4" />
                                PR #{sub.pull_request_url.split('/').pop()}
                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                            </a>
                            <Badge variant="outline" className={`
                                capitalize text-[10px]
                                ${sub.status === 'pending' ? 'border-yellow-500 text-yellow-500' : ''}
                                ${sub.status === 'approved' ? 'border-green-500 text-green-500 bg-green-500/10' : ''}
                                ${sub.status === 'rejected' ? 'border-red-500 text-red-500' : ''}
                            `}>
                                {sub.status}
                            </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground flex gap-3">
                            <span>Submitted {sub.created_at ? formatDistanceToNow(new Date(sub.created_at), { addSuffix: true }) : 'recently'}</span>
                            {sub.notes && <span className="text-gray-400 max-w-md truncate">"{sub.notes}"</span>}
                        </div>
                    </div>

                    {isOwner && sub.status === 'pending' && (
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                                onClick={() => handleAction(sub.id, 'rejected')}
                                disabled={!!actioningId}
                            >
                                {actioningId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
                                Reject
                            </Button>
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleAction(sub.id, 'approved')}
                                disabled={!!actioningId}
                            >
                                {actioningId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                                Approve
                            </Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
