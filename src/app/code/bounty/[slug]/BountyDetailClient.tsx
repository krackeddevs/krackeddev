"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle,
    Link2,
    Send,
    LogOut,
    Lock,
    LogIn,
} from "lucide-react";
import {
    BountyDetail,
    SubmissionCard,
    fetchBountySubmissions,
    submitBountySolution,
    fetchBountyBySlug,
} from "@/features/bounty-board";
import type { Bounty, BountySubmission } from "@/features/bounty-board";
import { useSupabase } from "@/context/SupabaseContext";
import "@/styles/bounty.css";

interface BountyDetailClientProps {
    slug: string;
}

export default function BountyDetailClient({ slug }: BountyDetailClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { supabase, user, profile, openLoginModal, signOut } = useSupabase();

    const [bounty, setBounty] = useState<Bounty | null>(null);
    const [loading, setLoading] = useState(true);
    const [prUrl, setPrUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
    const [submissions, setSubmissions] = useState<BountySubmission[]>([]);

    // Fetch Bounty Data using server action (DB takes precedence)
    useEffect(() => {
        let cancelled = false;

        const loadBounty = async () => {
            const { data, error } = await fetchBountyBySlug(slug);

            if (cancelled) return;

            if (error || !data) {
                console.error("Bounty not found:", error);
                setLoading(false);
                return;
            }

            setBounty(data);
            setLoading(false);
        };

        loadBounty();

        return () => {
            cancelled = true;
        };
    }, [slug]);

    // Fetch Submissions
    useEffect(() => {
        if (!bounty) return;

        // Use static submissions if available
        setSubmissions(bounty.submissions ?? []);

        // Also fetch from DB
        const loadSubmissions = async () => {
            const { data } = await fetchBountySubmissions(slug);
            if (data.length > 0) {
                setSubmissions(data);
            }
        };

        loadSubmissions();
    }, [bounty, slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!user || !bounty) {
            setError("Please sign in to submit a solution.");
            openLoginModal();
            return;
        }

        setSubmitting(true);

        // Use the server action instead of direct Supabase call
        const { data, error } = await submitBountySolution(
            bounty.slug,
            bounty.title,
            bounty.reward,
            prUrl,
            user.id
        );

        if (error) {
            setSubmitting(false);
            setError(error);
            return;
        }

        setSubmitting(false);
        setSubmitted(true);

        if (data) {
            // Update submittedBy with profile info
            const submittedBy =
                profile?.username ||
                profile?.full_name ||
                (typeof user.id === "string" ? `${user.id.slice(0, 8)}…` : "You");

            setSubmissions((prev) => [
                {
                    ...data,
                    submittedBy,
                },
                ...prev,
            ]);
        }

        setPrUrl("");
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent animate-spin rounded-full"></div>
            </main>
        );
    }

    if (!bounty) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>
                <div className="text-center relative z-10">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-2xl font-mono text-white mb-4">
                        Bounty Not Found
                    </h1>
                    <p className="text-gray-400 mb-6">
                        The bounty you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <button
                        onClick={() => router.push("/code/bounty")}
                        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-mono"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Bounty Board
                    </button>
                </div>
            </main>
        );
    }

    const canSubmit = bounty.status === "active" || bounty.status === "claimed";
    const isGuest = !user;

    // FR9/FR10: Guest users see login required screen
    if (isGuest) {
        return (
            <main className="min-h-screen relative">
                <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>

                {/* Header with Navigation */}
                <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-40 backdrop-blur-sm">
                    <div className="container mx-auto px-4 py-3 max-w-4xl">
                        <button
                            onClick={() => router.push("/code/bounty")}
                            className="inline-flex items-center text-gray-400 hover:text-white transition-colors font-mono text-sm"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            <span className="hidden md:inline">Back to Bounty Board</span>
                            <span className="md:hidden">Back</span>
                        </button>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
                    {/* Bounty Preview Card */}
                    <div className="bg-gray-800/50 border-2 border-cyan-500/30 p-8 mb-8">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-mono text-xs uppercase">
                                {bounty.status}
                            </span>
                            <span className="text-2xl font-mono font-bold text-cyan-400">
                                RM{bounty.reward}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold font-mono text-white mb-4">
                            {bounty.title}
                        </h1>
                        <p className="text-gray-400 font-mono text-sm line-clamp-2">
                            {bounty.description?.substring(0, 150)}...
                        </p>
                    </div>

                    {/* Login Required Card */}
                    <div className="bg-background/80 border-2 border-neon-primary/50 p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 bg-neon-primary/10 border-2 border-neon-primary flex items-center justify-center">
                            <Lock className="w-8 h-8 text-neon-primary" />
                        </div>
                        <h2 className="text-xl font-bold font-mono text-white mb-3">
                            Login Required
                        </h2>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            Sign in to view full bounty details, requirements, and submit your solution.
                        </p>
                        <button
                            onClick={() => openLoginModal(true)}
                            className="inline-flex items-center gap-2 bg-neon-primary hover:bg-neon-primary/90 text-black font-mono font-bold px-8 py-3 transition-colors"
                        >
                            <LogIn className="w-5 h-5" />
                            Sign In to View Details
                        </button>
                        <p className="text-gray-500 text-sm mt-4 font-mono">
                            Don&apos;t have an account?{" "}
                            <button
                                onClick={() => openLoginModal(true)}
                                className="text-neon-primary hover:underline"
                            >
                                Sign up for free
                            </button>
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen relative">
            <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>

            {/* Header with Navigation */}
            <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-40 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-3 max-w-4xl">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.push("/code/bounty")}
                            className="inline-flex items-center text-gray-400 hover:text-white transition-colors font-mono text-sm"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            <span className="hidden md:inline">Back to Bounty Board</span>
                            <span className="md:hidden">Back</span>
                        </button>

                        {user && (
                            <button
                                onClick={() => setShowSignOutConfirm(true)}
                                className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-mono text-sm px-3 py-1.5 border border-gray-700 hover:border-gray-600"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Sign Out Confirmation Modal */}
            {showSignOutConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
                    <div className="bg-background border-2 border-cyan-500 p-6 max-w-md w-full">
                        <h2 className="text-xl font-mono text-cyan-400 mb-4">
                            CONFIRM SIGN OUT
                        </h2>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to sign out?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowSignOutConfirm(false)}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-mono py-2 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowSignOutConfirm(false);
                                    signOut();
                                }}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-mono py-2 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
                {/* Bounty Detail Component */}
                <BountyDetail bounty={bounty}>
                    {/* Submission Form - Only for active bounties AND logged in users */}
                    {canSubmit && (
                        <div className="mb-8">
                            <h2 className="text-lg font-mono text-white mb-4 flex items-center gap-2">
                                <Link2 className="w-5 h-5 text-cyan-400" />
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
                                            Your submission has been received for review. We&apos;ll
                                            notify you once it&apos;s been reviewed.
                                        </p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="text-cyan-400 hover:text-cyan-300 font-mono text-sm"
                                        >
                                            Submit Another Link
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <label className="block mb-2 text-gray-400 font-mono text-sm">
                                            Submission Link
                                        </label>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex-1">
                                                <input
                                                    type="url"
                                                    value={prUrl}
                                                    onChange={(e) => setPrUrl(e.target.value)}
                                                    placeholder="https://your-demo.vercel.app or https://github.com/.../pull/123"
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
                                                        Submit
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-gray-500 text-xs mt-3 font-mono">
                                            Submit your deployed app, GitHub PR, or any link showing your work.
                                            Tag @KrackedDevs on X for extra visibility!
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Completed Notice */}
                    {bounty.status === "completed" && (
                        <div className="mb-8 bg-green-500/10 border border-green-500/30 p-6 text-center">
                            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                            <div className="text-green-400 font-mono text-lg mb-2">
                                This bounty has been completed!
                            </div>
                            <p className="text-gray-400 text-sm">
                                Congratulations to the winner. Check out other active bounties on
                                the board.
                            </p>
                        </div>
                    )}

                    {/* Expired Notice */}
                    {bounty.status === "expired" && (
                        <div className="mb-8 bg-gray-800/30 border border-gray-600 p-6 text-center">
                            <div className="text-gray-500 font-mono">
                                This bounty has expired and is no longer accepting submissions.
                            </div>
                        </div>
                    )}

                    {/* Existing Submissions */}
                    {submissions.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-lg font-mono text-white mb-4">
                                SUBMISSIONS ({submissions.length})
                            </h2>
                            <div className="space-y-4">
                                {submissions.map((submission) => (
                                    <SubmissionCard key={submission.id} submission={submission} />
                                ))}
                            </div>
                        </div>
                    )}
                </BountyDetail>
            </div>
        </main>
    );
}
