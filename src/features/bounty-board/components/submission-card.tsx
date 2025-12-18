import { AlertCircle, CheckCircle, XCircle, GitPullRequest } from "lucide-react";
import type { BountySubmission } from "../types";

interface SubmissionCardProps {
    submission: BountySubmission;
}

const submissionStatusIcons = {
    pending: <AlertCircle className="w-4 h-4 text-yellow-400" />,
    approved: <CheckCircle className="w-4 h-4 text-green-400" />,
    rejected: <XCircle className="w-4 h-4 text-red-400" />,
};

const submissionStatusColors = {
    pending: "text-yellow-400",
    approved: "text-green-400",
    rejected: "text-red-400",
};

export function SubmissionCard({ submission }: SubmissionCardProps) {
    return (
        <div
            className="bg-gray-800/30 border border-gray-700 p-4"
            data-testid="submission-card"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        {submissionStatusIcons[submission.status]}
                        <span
                            className={`font-mono text-sm capitalize ${submissionStatusColors[submission.status]}`}
                            data-testid="submission-status"
                        >
                            {submission.status}
                        </span>
                    </div>
                    <a
                        href={submission.pullRequestUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-sm flex items-center gap-1"
                        data-testid="pr-link"
                    >
                        <GitPullRequest className="w-4 h-4" />
                        {submission.pullRequestUrl.replace("https://github.com/", "")}
                    </a>
                    <div className="text-gray-500 text-xs mt-2" data-testid="submission-meta">
                        by {submission.submittedBy} •{" "}
                        {new Date(submission.submittedAt).toLocaleDateString()}
                    </div>
                    {submission.notes && (
                        <p className="text-gray-400 text-sm mt-2" data-testid="submission-notes">
                            {submission.notes}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
