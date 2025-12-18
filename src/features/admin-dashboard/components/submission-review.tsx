"use client";

import React, { useState, useEffect } from "react";
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    CreditCard,
    ExternalLink,
    GitPullRequest,
} from "lucide-react";
import {
    fetchAllSubmissions,
    reviewSubmission,
    markSubmissionPaid,
} from "@/features/bounty-board";
import type { AdminSubmission } from "@/features/bounty-board";
import { useSupabase } from "@/context/SupabaseContext";

const statusColors = {
    pending: "text-yellow-400 bg-yellow-900/30",
    approved: "text-green-400 bg-green-900/30",
    rejected: "text-red-400 bg-red-900/30",
};

const statusIcons = {
    pending: <AlertCircle className="w-4 h-4" />,
    approved: <CheckCircle className="w-4 h-4" />,
    rejected: <XCircle className="w-4 h-4" />,
};

export function SubmissionReview() {
    const { user } = useSupabase();
    const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [selectedSubmission, setSelectedSubmission] = useState<AdminSubmission | null>(null);
    const [modalAction, setModalAction] = useState<"approve" | "reject" | "pay" | null>(null);
    const [comment, setComment] = useState("");
    const [paymentRef, setPaymentRef] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        setLoading(true);
        const { data, error } = await fetchAllSubmissions();
        if (error) {
            setError(error);
        } else {
            setSubmissions(data);
        }
        setLoading(false);
    };

    const openModal = (submission: AdminSubmission, action: "approve" | "reject" | "pay") => {
        setSelectedSubmission(submission);
        setModalAction(action);
        setComment("");
        setPaymentRef("");
    };

    const closeModal = () => {
        setSelectedSubmission(null);
        setModalAction(null);
        setComment("");
        setPaymentRef("");
    };

    const handleReview = async () => {
        if (!selectedSubmission || !modalAction || !user) return;
        if (modalAction !== "pay" && !comment.trim()) {
            setError("Comment is required");
            return;
        }

        setProcessing(true);
        setError(null);

        if (modalAction === "pay") {
            const { success, error } = await markSubmissionPaid(
                selectedSubmission.id,
                paymentRef
            );
            if (!success) {
                setError(error || "Failed to mark as paid");
                setProcessing(false);
                return;
            }
        } else {
            // Map modal action to server action status
            const status = modalAction === "approve" ? "approved" : "rejected";
            const { success, error } = await reviewSubmission(
                selectedSubmission.id,
                status,
                comment,
                user.id
            );
            if (!success) {
                setError(error || "Failed to review submission");
                setProcessing(false);
                return;
            }
        }

        setProcessing(false);
        closeModal();
        loadSubmissions();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent animate-spin rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-mono text-white">Submission Review</h2>
                <div className="text-gray-400 text-sm">
                    {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
                </div>
            </div>

            {error && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {submissions.length === 0 ? (
                <div className="bg-gray-800/30 border border-gray-700 p-8 text-center text-gray-400">
                    No submissions to review
                </div>
            ) : (
                <div className="space-y-4">
                    {submissions.map((submission) => (
                        <div
                            key={submission.id}
                            className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono ${statusColors[submission.status]}`}
                                        >
                                            {statusIcons[submission.status]}
                                            {submission.status}
                                        </span>
                                        <span className="text-cyan-400 font-mono text-sm">
                                            RM{submission.bountyReward}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-medium mb-1">
                                        {submission.bountyTitle}
                                    </h3>
                                    <a
                                        href={submission.pullRequestUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
                                    >
                                        <GitPullRequest className="w-4 h-4" />
                                        {submission.pullRequestUrl.replace("https://github.com/", "")}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                    <div className="text-gray-500 text-xs mt-2">
                                        Submitted {new Date(submission.createdAt).toLocaleDateString()}
                                    </div>
                                    {submission.reviewNotes && (
                                        <div className="mt-2 text-sm text-gray-400 bg-gray-800/50 p-2 rounded">
                                            <span className="text-gray-500">Review: </span>
                                            {submission.reviewNotes}
                                        </div>
                                    )}
                                    {submission.paymentRef && (
                                        <div className="mt-2 text-sm text-green-400 flex items-center gap-1">
                                            <CreditCard className="w-4 h-4" />
                                            Paid: {submission.paymentRef}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    {submission.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => openModal(submission, "approve")}
                                                className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded flex items-center gap-1"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => openModal(submission, "reject")}
                                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm rounded flex items-center gap-1"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {submission.status === "approved" && !submission.paymentRef && (
                                        <button
                                            onClick={() => openModal(submission, "pay")}
                                            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded flex items-center gap-1"
                                        >
                                            <CreditCard className="w-4 h-4" />
                                            Mark Paid
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedSubmission && modalAction && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-mono text-white mb-4">
                            {modalAction === "approve" && "Approve Submission"}
                            {modalAction === "reject" && "Reject Submission"}
                            {modalAction === "pay" && "Mark as Paid"}
                        </h3>

                        {modalAction !== "pay" ? (
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-2">
                                    Comment (required)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                                    rows={3}
                                    placeholder="Enter review comment..."
                                />
                            </div>
                        ) : (
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-2">
                                    Transaction Reference (required)
                                </label>
                                <input
                                    type="text"
                                    value={paymentRef}
                                    onChange={(e) => setPaymentRef(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                                    placeholder="e.g., TXN123456"
                                />
                            </div>
                        )}

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReview}
                                disabled={processing || (modalAction !== "pay" && !comment.trim()) || (modalAction === "pay" && !paymentRef.trim())}
                                className={`px-4 py-2 text-white rounded flex items-center gap-2 ${modalAction === "approve" ? "bg-green-600 hover:bg-green-500" :
                                    modalAction === "reject" ? "bg-red-600 hover:bg-red-500" :
                                        "bg-cyan-600 hover:bg-cyan-500"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {processing && <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />}
                                {modalAction === "approve" && "Approve"}
                                {modalAction === "reject" && "Reject"}
                                {modalAction === "pay" && "Confirm Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
