import { Clock, Trophy, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import type { Bounty } from "../types";
import { difficultyColors, statusColors } from "../types";
import { WinnerDisplay } from "./winner-display";

// X/Twitter icon component
function XIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

interface BountyDetailProps {
    bounty: Bounty;
    children?: React.ReactNode; // For slots like submission form
}

export function BountyDetail({ bounty, children }: BountyDetailProps) {
    const isDeadlinePassed = new Date(bounty.deadline) < new Date();

    const formatDeadline = (deadline: string) => {
        const date = new Date(deadline);
        if (isNaN(date.getTime())) return "No Deadline";

        return date.toLocaleDateString("en-MY", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
        });
    };

    return (
        <div data-testid="bounty-detail">
            {/* Header */}
            <div className="mb-8">
                {/* Bounty Number & Status */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-muted-foreground font-mono text-sm">
                        BOUNTY #{bounty.id.slice(0, 8)}
                    </span>
                    <span
                        className={`px-3 py-1 text-xs font-mono border ${statusColors[bounty.status]}`}
                        data-testid="status-badge"
                    >
                        {bounty.status.toUpperCase()}
                    </span>
                    <span
                        className={`px-3 py-1 text-xs font-mono border ${difficultyColors[bounty.difficulty]}`}
                        data-testid="difficulty-badge"
                    >
                        {bounty.difficulty.toUpperCase()}
                    </span>
                </div>

                {/* Title */}
                <h1
                    className="text-2xl md:text-3xl font-bold font-mono text-foreground mb-4"
                    data-testid="bounty-title"
                >
                    {bounty.title}
                </h1>

                {/* Description */}
                <p className="text-muted-foreground text-lg">{bounty.description}</p>

                {/* Reward Badge */}
                <div
                    className="mt-6 inline-block bg-rank-gold text-black px-6 py-3 font-mono font-bold text-2xl"
                    data-testid="reward-badge"
                >
                    RM{bounty.reward}
                </div>
            </div>

            {/* Winner Section - Show prominently for completed bounties */}
            {bounty.status === "completed" && bounty.winner && (
                <div className="mb-8">
                    <WinnerDisplay winner={bounty.winner} completedAt={bounty.completedAt} />
                </div>
            )}

            {/* Meta Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Deadline */}
                <div className="bg-card/30 border border-border p-4">
                    <div className="flex items-center gap-3">
                        <Clock
                            className={`w-5 h-5 ${isDeadlinePassed ? "text-destructive" : "text-muted-foreground"}`}
                        />
                        <div>
                            <div className="text-muted-foreground text-xs font-mono">DEADLINE</div>
                            <div
                                className={`font-mono text-sm ${isDeadlinePassed ? "text-destructive" : "text-foreground"}`}
                                data-testid="deadline"
                            >
                                {formatDeadline(bounty.deadline)}
                            </div>
                            {isDeadlinePassed && (
                                <span className="text-destructive text-xs font-mono">
                                    (Deadline passed)
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reward */}
                <div className="bg-card/30 border border-border p-4">
                    <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-rank-gold" />
                        <div>
                            <div className="text-muted-foreground text-xs font-mono">REWARD</div>
                            <div className="text-foreground font-mono">RM{bounty.reward}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
                <h2 className="text-sm font-mono text-muted-foreground mb-3">TAGS</h2>
                <div className="flex flex-wrap gap-2" data-testid="tags-container">
                    {bounty.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-muted border border-border text-muted-foreground font-mono text-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Long Description */}
            <div className="mb-8">
                <h2 className="text-lg font-mono text-foreground mb-4">DETAILS</h2>
                <div className="bg-card/30 border border-border p-6">
                    <div className="prose dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:border prose-pre:border-border">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-foreground/80 leading-relaxed">
                            {bounty.longDescription}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Requirements */}
            {bounty.requirements.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-mono text-foreground mb-4">REQUIREMENTS</h2>
                    <div className="bg-card/30 border border-border p-6 space-y-3">
                        {bounty.requirements.map((req, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-neon-cyan/20 border border-neon-cyan/50 flex items-center justify-center text-neon-cyan font-mono text-xs shrink-0">
                                    {index + 1}
                                </div>
                                <span className="text-muted-foreground">{req}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Links */}
            <div className="mb-8">
                <h2 className="text-lg font-mono text-foreground mb-4">LINKS</h2>
                <div className="flex flex-wrap gap-4">
                    {/* Bounty Post on X */}
                    {bounty.bountyPostUrl && (
                        <a
                            href={bounty.bountyPostUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 px-4 py-2 text-white hover:bg-gray-700 transition-colors font-mono text-sm"
                        >
                            <XIcon className="w-4 h-4" />
                            View Bounty Post
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    )}

                    {/* Submission/Winner Post on X */}
                    {bounty.submissionPostUrl && (
                        <a
                            href={bounty.submissionPostUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 px-4 py-2 text-white hover:bg-gray-700 transition-colors font-mono text-sm"
                        >
                            <XIcon className="w-4 h-4" />
                            View Submission Post
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    )}

                    {/* Repository */}
                    {bounty.repositoryUrl && (
                        <a
                            href={bounty.repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 px-4 py-2 text-white hover:bg-gray-700 transition-colors font-mono text-sm"
                        >
                            <Github className="w-4 h-4" />
                            View Repository
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    )}

                    {!bounty.repositoryUrl && !bounty.bountyPostUrl && (
                        <p className="text-muted-foreground text-sm font-mono">
                            No links available for this bounty.
                        </p>
                    )}
                </div>
            </div>

            {/* Children slot for submission form or other content */}
            {children}

            {/* Footer Navigation */}
            <div className="border-t border-border pt-8 flex justify-between items-center">
                <Link
                    href="/code/bounty"
                    className="text-muted-foreground hover:text-foreground font-mono text-sm flex items-center gap-2"
                >
                    ← All Bounties
                </Link>
                <Link
                    href="/code"
                    className="text-neon-cyan hover:text-neon-cyan/80 font-mono text-sm"
                >
                    Back to Code Hub
                </Link>
            </div>
        </div>
    );
}
