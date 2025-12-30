"use client";

import { AdminDataTable, Column } from "@/features/admin-dashboard/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    CreditCard,
    ExternalLink,
    GitPullRequest,
} from "lucide-react";
import { reviewSubmission, markSubmissionPaid } from "@/features/bounty-board";
import type { AdminSubmission } from "@/features/bounty-board";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/lib/toast";

interface SubmissionsTableClientProps {
    submissions: AdminSubmission[];
    userId: string;
}

export function SubmissionsTableClient({ submissions, userId }: SubmissionsTableClientProps) {
    const router = useRouter();
    const [selectedSubmission, setSelectedSubmission] = useState<AdminSubmission | null>(null);
    const [modalAction, setModalAction] = useState<"approve" | "reject" | "pay" | null>(null);
    const [comment, setComment] = useState("");
    const [paymentRef, setPaymentRef] = useState("");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="outline" className="gap-1 bg-background" style={{ borderColor: 'var(--status-warning)', color: 'var(--status-warning)' }}>
                        <AlertCircle className="h-3 w-3" />
                        Pending
                    </Badge>
                );
            case "approved":
                return (
                    <Badge className="gap-1 border" style={{ backgroundColor: 'var(--status-success)', borderColor: 'var(--status-success)', color: 'var(--background)' }}>
                        <CheckCircle className="h-3 w-3" />
                        Approved
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge className="gap-1 border" style={{ backgroundColor: 'var(--status-error)', borderColor: 'var(--status-error)', color: 'var(--background)' }}>
                        <XCircle className="h-3 w-3" />
                        Rejected
                    </Badge>
                );
            default:
                return null;
        }
    };

    const openModal = (submission: AdminSubmission, action: "approve" | "reject" | "pay") => {
        setSelectedSubmission(submission);
        setModalAction(action);
        setComment("");
        setPaymentRef("");
        setError(null);
    };

    const closeModal = () => {
        setSelectedSubmission(null);
        setModalAction(null);
        setComment("");
        setPaymentRef("");
        setError(null);
    };

    const handleReview = async () => {
        if (!selectedSubmission || !modalAction) return;
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
                toast.error(error || "Failed to mark as paid");
                setProcessing(false);
                return;
            }
            toast.success("Submission marked as paid successfully");
        } else {
            const status = modalAction === "approve" ? "approved" : "rejected";
            const { success, error } = await reviewSubmission(
                selectedSubmission.id,
                status,
                comment,
                userId
            );
            if (!success) {
                setError(error || "Failed to review submission");
                toast.error(error || "Failed to review submission");
                setProcessing(false);
                return;
            }
            toast.success(`Submission ${status} successfully`);
        }

        setProcessing(false);
        closeModal();
        router.refresh();
    };

    const columns: Column<AdminSubmission>[] = [
        {
            key: "bountyTitle",
            label: "Bounty",
            sortable: true,
            render: (submission) => (
                <div>
                    <div className="font-medium">{submission.bountyTitle}</div>
                    <a
                        href={submission.pullRequestUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neon-cyan hover:text-neon-cyan/80 flex items-center gap-1 mt-1"
                    >
                        <GitPullRequest className="w-3 h-3" />
                        {submission.pullRequestUrl.replace("https://github.com/", "")}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            ),
            mobileRender: (submission) => (
                <div className="space-y-2">
                    <div className="font-bold">{submission.bountyTitle}</div>
                    <div className="flex items-center justify-between">
                        {getStatusBadge(submission.status)}
                        <span className="text-neon-primary font-semibold">RM{submission.bountyReward}</span>
                    </div>
                    <a
                        href={submission.pullRequestUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neon-cyan hover:text-neon-cyan/80 flex items-center gap-1"
                    >
                        <GitPullRequest className="w-3 h-3" />
                        PR Link
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            ),
        },
        {
            key: "bountyReward",
            label: "Reward",
            sortable: true,
            render: (submission) => (
                <span className="font-semibold text-neon-primary">
                    RM{submission.bountyReward}
                </span>
            ),
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (submission) => (
                <div className="space-y-1">
                    {getStatusBadge(submission.status)}
                    {submission.paymentRef && (
                        <div className="text-xs text-neon-primary flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />
                            Paid: {submission.paymentRef}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "createdAt",
            label: "Submitted",
            sortable: true,
            render: (submission) =>
                formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true }),
        },
        {
            key: "actions",
            label: "Actions",
            render: (submission) => (
                <div className="flex gap-2">
                    {submission.status === "pending" && (
                        <>
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => openModal(submission, "approve")}
                            >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openModal(submission, "reject")}
                            >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                            </Button>
                        </>
                    )}
                    {submission.status === "approved" && !submission.paymentRef && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openModal(submission, "pay")}
                        >
                            <CreditCard className="w-4 h-4 mr-1" />
                            Mark Paid
                        </Button>
                    )}
                </div>
            ),
            mobileRender: (submission) => (
                <div className="flex flex-col gap-2 pt-2 border-t">
                    {submission.status === "pending" && (
                        <>
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => openModal(submission, "approve")}
                                className="w-full"
                            >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openModal(submission, "reject")}
                                className="w-full"
                            >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                            </Button>
                        </>
                    )}
                    {submission.status === "approved" && !submission.paymentRef && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openModal(submission, "pay")}
                            className="w-full"
                        >
                            <CreditCard className="w-4 h-4 mr-1" />
                            Mark Paid
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <AdminDataTable
                data={submissions}
                columns={columns}
                searchPlaceholder="Search by bounty title or PR URL..."
                emptyMessage="No submissions to review"
            />

            {/* Review Dialog */}
            <Dialog open={!!selectedSubmission && !!modalAction} onOpenChange={closeModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {modalAction === "approve" && "Approve Submission"}
                            {modalAction === "reject" && "Reject Submission"}
                            {modalAction === "pay" && "Mark as Paid"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedSubmission?.bountyTitle}
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {modalAction !== "pay" ? (
                        <div className="space-y-2">
                            <Label htmlFor="comment">Comment (required)</Label>
                            <Textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Enter review comment..."
                                rows={3}
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="paymentRef">Transaction Reference (required)</Label>
                            <Input
                                id="paymentRef"
                                value={paymentRef}
                                onChange={(e) => setPaymentRef(e.target.value)}
                                placeholder="e.g., TXN123456"
                            />
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={closeModal} disabled={processing}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReview}
                            disabled={
                                processing ||
                                (modalAction !== "pay" && !comment.trim()) ||
                                (modalAction === "pay" && !paymentRef.trim())
                            }
                            variant={
                                modalAction === "approve"
                                    ? "default"
                                    : modalAction === "reject"
                                        ? "destructive"
                                        : "outline"
                            }
                        >
                            {processing && "Processing..."}
                            {!processing && modalAction === "approve" && "Approve"}
                            {!processing && modalAction === "reject" && "Reject"}
                            {!processing && modalAction === "pay" && "Confirm Payment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
