"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import {
    approveVerificationRequest,
    rejectVerificationRequest,
    requestMoreInfoAction,
} from "../admin-actions";
import { toast } from "sonner";

interface AdminVerificationActionsProps {
    requestId: string;
}

export function AdminVerificationActions({ requestId }: AdminVerificationActionsProps) {
    const router = useRouter();
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [isRequestingInfo, setIsRequestingInfo] = useState(false);
    const [adminNotes, setAdminNotes] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [infoMessage, setInfoMessage] = useState("");

    const handleApprove = async () => {
        setIsApproving(true);
        try {
            const result = await approveVerificationRequest(requestId, adminNotes);
            if (result.success) {
                toast.success("Verification request approved!");
                router.push("/admin/verifications");
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to approve request");
        } finally {
            setIsApproving(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }

        setIsRejecting(true);
        try {
            const result = await rejectVerificationRequest(requestId, rejectionReason, adminNotes);
            if (result.success) {
                toast.success("Verification request rejected");
                router.push("/admin/verifications");
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to reject request");
        } finally {
            setIsRejecting(false);
        }
    };

    const handleRequestInfo = async () => {
        if (!infoMessage.trim()) {
            toast.error("Please provide a message");
            return;
        }

        setIsRequestingInfo(true);
        try {
            const result = await requestMoreInfoAction(requestId, infoMessage);
            if (result.success) {
                toast.success("Request for more information sent");
                router.push("/admin/verifications");
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to request more information");
        } finally {
            setIsRequestingInfo(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
                <CardDescription>Review and take action on this verification request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="admin-notes">Admin Notes (Internal)</Label>
                    <Textarea
                        id="admin-notes"
                        placeholder="Add internal notes about this request..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="mt-2"
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="default" className="gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Approve
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Approve Verification Request</DialogTitle>
                                <DialogDescription>
                                    This will mark the company as verified and display the verified badge on their
                                    profile.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => { }}>
                                    Cancel
                                </Button>
                                <Button onClick={handleApprove} disabled={isApproving}>
                                    {isApproving ? "Approving..." : "Confirm Approval"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="gap-2">
                                <XCircle className="h-4 w-4" />
                                Reject
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Reject Verification Request</DialogTitle>
                                <DialogDescription>
                                    Please provide a reason for rejection. This will be sent to the company.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                                    <Textarea
                                        id="rejection-reason"
                                        placeholder="Explain why this request is being rejected..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="mt-2"
                                        rows={4}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setRejectionReason("")}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleReject}
                                    disabled={isRejecting || !rejectionReason.trim()}
                                >
                                    {isRejecting ? "Rejecting..." : "Confirm Rejection"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Request More Info
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Request More Information</DialogTitle>
                                <DialogDescription>
                                    Ask the company to provide additional information or clarification.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <Label htmlFor="info-message">Message *</Label>
                                    <Textarea
                                        id="info-message"
                                        placeholder="What additional information do you need?"
                                        value={infoMessage}
                                        onChange={(e) => setInfoMessage(e.target.value)}
                                        className="mt-2"
                                        rows={4}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setInfoMessage("")}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleRequestInfo}
                                    disabled={isRequestingInfo || !infoMessage.trim()}
                                >
                                    {isRequestingInfo ? "Sending..." : "Send Request"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
