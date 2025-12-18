import { Trophy, CheckCircle, ExternalLink } from "lucide-react";
import type { BountyWinner } from "../types";

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

interface WinnerDisplayProps {
    winner: BountyWinner;
    completedAt?: string;
}

export function WinnerDisplay({ winner, completedAt }: WinnerDisplayProps) {
    return (
        <div
            className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 border-2 border-yellow-500/50 p-6"
            data-testid="winner-display"
        >
            <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-mono text-yellow-400 font-bold">WINNER</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-800 border-2 border-yellow-500/50 flex items-center justify-center text-3xl">
                    🏆
                </div>
                <div>
                    <div
                        className="text-white font-mono text-xl mb-1"
                        data-testid="winner-name"
                    >
                        {winner.name}
                    </div>
                    <a
                        href={winner.xUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-2"
                        data-testid="winner-x-link"
                    >
                        <XIcon className="w-4 h-4" />@{winner.xHandle}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
            {winner.submissionUrl && (
                <a
                    href={winner.submissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-mono text-sm"
                    data-testid="winning-submission-link"
                >
                    <CheckCircle className="w-4 h-4" />
                    View Winning Submission
                    <ExternalLink className="w-3 h-3" />
                </a>
            )}
            {completedAt && (
                <div className="text-gray-500 text-xs mt-4 font-mono" data-testid="completed-date">
                    Completed on{" "}
                    {new Date(completedAt).toLocaleDateString("en-MY", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>
            )}
        </div>
    );
}
