"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trophy,
  Clock,
  ExternalLink,
  GitPullRequest,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Github,
} from "lucide-react";
import { getBountyBySlug } from "@/lib/bounty";
import {
  BountyDifficulty,
  BountyStatus,
  BountySubmission,
} from "@/lib/bounty/types";
import "@/styles/jobs.css";

const difficultyColors: Record<BountyDifficulty, string> = {
  beginner: "bg-green-500/20 text-green-400 border-green-500/50",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  advanced: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  expert: "bg-red-500/20 text-red-400 border-red-500/50",
};

const statusColors: Record<BountyStatus, string> = {
  active: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
  claimed: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  completed: "bg-green-500/20 text-green-400 border-green-500/50",
  expired: "bg-gray-500/20 text-gray-400 border-gray-500/50",
};

const submissionStatusIcons = {
  pending: <AlertCircle className="w-4 h-4 text-yellow-400" />,
  approved: <CheckCircle className="w-4 h-4 text-green-400" />,
  rejected: <XCircle className="w-4 h-4 text-red-400" />,
};

function SubmissionCard({ submission }: { submission: BountySubmission }) {
  return (
    <div className="bg-gray-800/30 border border-gray-700 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {submissionStatusIcons[submission.status]}
            <span className="font-mono text-sm text-white capitalize">
              {submission.status}
            </span>
          </div>
          <a
            href={submission.pullRequestUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 font-mono text-sm flex items-center gap-1"
          >
            <GitPullRequest className="w-4 h-4" />
            {submission.pullRequestUrl.replace("https://github.com/", "")}
          </a>
          <div className="text-gray-500 text-xs mt-2">
            by {submission.submittedBy} •{" "}
            {new Date(submission.submittedAt).toLocaleDateString()}
          </div>
          {submission.notes && (
            <p className="text-gray-400 text-sm mt-2">{submission.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BountyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const bounty = getBountyBySlug(slug);

  const [prUrl, setPrUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!bounty) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>
        <div className="text-center relative z-10">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-mono text-white mb-4">
            Bounty Not Found
          </h1>
          <p className="text-gray-400 mb-6">
            The bounty you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/code/bounty"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bounty Board
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate GitHub PR URL
    const githubPrRegex = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/pull\/\d+$/;
    if (!githubPrRegex.test(prUrl)) {
      setError(
        "Please enter a valid GitHub pull request URL (e.g., https://github.com/owner/repo/pull/123)"
      );
      return;
    }

    setSubmitting(true);

    // Simulate submission (in real app, this would be an API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmitting(false);
    setSubmitted(true);
    setPrUrl("");
  };

  const canSubmit = bounty.status === "active" || bounty.status === "claimed";

  return (
    <main className="min-h-screen bg-gray-900 relative">
      <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.push("/code/bounty")}
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors font-mono text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bounty Board
        </button>

        {/* Header */}
        <div className="mb-8">
          {/* Reward Badge */}
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-yellow-500 text-black px-4 py-2 font-mono font-bold text-xl">
              RM{bounty.reward}
            </div>
            <span
              className={`px-3 py-1 text-sm font-mono border ${
                statusColors[bounty.status]
              }`}
            >
              {bounty.status.toUpperCase()}
            </span>
            <span
              className={`px-3 py-1 text-sm font-mono border ${
                difficultyColors[bounty.difficulty]
              }`}
            >
              {bounty.difficulty.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-mono text-white mb-4">
            {bounty.title}
          </h1>

          <p className="text-gray-400 text-lg">{bounty.description}</p>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {bounty.deadline && (
            <div className="bg-gray-800/30 border border-gray-700 p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-gray-500 text-xs font-mono">DEADLINE</div>
                <div className="text-white font-mono">
                  {new Date(bounty.deadline).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          )}
          <div className="bg-gray-800/30 border border-gray-700 p-4 flex items-center gap-3">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-gray-500 text-xs font-mono">REWARD</div>
              <div className="text-white font-mono">RM{bounty.reward}</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <h2 className="text-sm font-mono text-gray-500 mb-3">TAGS</h2>
          <div className="flex flex-wrap gap-2">
            {bounty.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 font-mono text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Long Description */}
        <div className="mb-8">
          <h2 className="text-lg font-mono text-white mb-4">DESCRIPTION</h2>
          <div className="bg-gray-800/30 border border-gray-700 p-6">
            <div className="prose prose-invert max-w-none prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300 leading-relaxed">
                {bounty.longDescription}
              </pre>
            </div>
          </div>
        </div>

        {/* Winner Section - Only show for completed bounties */}
        {bounty.status === "completed" && bounty.submissions.length > 0 && (
          <div className="mb-8">
            {bounty.submissions
              .filter((sub) => sub.status === "approved")
              .map((winner) => (
                <div
                  key={winner.id}
                  className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 border-2 border-yellow-500/50 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-xl font-mono text-yellow-400">
                          WINNER
                        </h2>
                      </div>
                      <div className="text-white font-mono text-lg mb-2">
                        🏆 {winner.submittedBy}
                      </div>
                      <a
                        href={winner.pullRequestUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-sm flex items-center gap-1 mb-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Winning Submission
                      </a>
                      {winner.notes && (
                        <p className="text-gray-300 text-sm mt-3">
                          {winner.notes}
                        </p>
                      )}
                      <div className="text-gray-500 text-xs mt-2">
                        Completed on{" "}
                        {new Date(winner.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Requirements */}
        <div className="mb-8">
          <h2 className="text-lg font-mono text-white mb-4">REQUIREMENTS</h2>
          <div className="bg-gray-800/30 border border-gray-700 p-6 space-y-3">
            {bounty.requirements.map((req, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-mono text-xs shrink-0">
                  {index + 1}
                </div>
                <span className="text-gray-300">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="mb-8 flex flex-wrap gap-4">
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
          {bounty.issueUrl && (
            <a
              href={bounty.issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 px-4 py-2 text-white hover:bg-gray-700 transition-colors font-mono text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {bounty.issueUrl.includes("x.com") ||
              bounty.issueUrl.includes("twitter.com")
                ? "View Bounty Post"
                : "View Issue"}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Submission Form */}
        {canSubmit && (
          <div className="mb-8">
            <h2 className="text-lg font-mono text-white mb-4 flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-cyan-400" />
              SUBMIT YOUR SOLUTION
            </h2>
            <div className="bg-gray-800/50 border-2 border-cyan-500/30 p-6">
              {submitted ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-mono text-white mb-2">
                    Submission Received!
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Your pull request has been submitted for review. We&apos;ll
                    notify you once it&apos;s been reviewed.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-cyan-400 hover:text-cyan-300 font-mono text-sm"
                  >
                    Submit Another PR
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <label className="block mb-2 text-gray-400 font-mono text-sm">
                    GitHub Pull Request URL
                  </label>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={prUrl}
                        onChange={(e) => setPrUrl(e.target.value)}
                        placeholder="https://github.com/owner/repo/pull/123"
                        className="w-full bg-gray-900 border border-gray-600 px-4 py-3 font-mono text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                        required
                      />
                      {error && (
                        <p className="text-red-400 text-sm mt-2 font-mono">
                          {error}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-mono font-bold px-6 py-3 flex items-center gap-2 transition-colors"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit PR
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs mt-3 font-mono">
                    Make sure your PR is linked to the issue and follows the
                    contribution guidelines.
                  </p>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Not Accepting Submissions */}
        {!canSubmit && (
          <div className="mb-8 bg-gray-800/30 border border-gray-600 p-6 text-center">
            <div className="text-gray-500 font-mono">
              {bounty.status === "completed"
                ? "This bounty has been completed."
                : "This bounty is no longer accepting submissions."}
            </div>
          </div>
        )}

        {/* Existing Submissions */}
        {bounty.submissions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-mono text-white mb-4">
              SUBMISSIONS ({bounty.submissions.length})
            </h2>
            <div className="space-y-4">
              {bounty.submissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
          <Link
            href="/code/bounty"
            className="text-gray-400 hover:text-white font-mono text-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            All Bounties
          </Link>
          <Link
            href="/code"
            className="text-cyan-400 hover:text-cyan-300 font-mono text-sm"
          >
            Back to Code Hub
          </Link>
        </div>
      </div>
    </main>
  );
}
