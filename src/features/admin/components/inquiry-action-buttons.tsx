"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket, MessageSquare, XCircle } from "lucide-react";
import { publishBounty, updateInquiryStatus } from "@/features/admin/actions/publish-bounty";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface InquiryActionButtonsProps {
    inquiryId: string;
    currentStatus: string;
    hasTitle: boolean; // Only publishable if it has the new schema fields
}

export function InquiryActionButtons({ inquiryId, currentStatus, hasTitle }: InquiryActionButtonsProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePublish = async () => {
        if (!hasTitle) {
            toast.error("Cannot publish legacy inquiry (missing Title/Budget fields).");
            return;
        }

        if (!confirm("Are you sure you want to PUBLISH this bounty Live?")) return;

        setLoading(true);
        const result = await publishBounty(inquiryId);
        setLoading(false);

        if (result.success) {
            toast.success("Bounty Published Successfully!");
            router.refresh();
        } else {
            toast.error(result.error);
        }
    };

    const handleStatusUpdate = async (status: string) => {
        setLoading(true);
        const result = await updateInquiryStatus(inquiryId, status);
        setLoading(false);

        if (result.success) {
            toast.success(`Status updated to ${status}`);
            router.refresh();
        } else {
            toast.error(result.error);
        }
    };

    if (currentStatus === 'approved') {
        return (
            <div className="flex items-center gap-2 justify-end text-neon-primary">
                <span className="text-xs font-bold tracking-wider uppercase opacity-80">Published</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {/* Publish Button */}
            <Button
                size="sm"
                onClick={handlePublish}
                disabled={loading || !hasTitle}
                className="bg-neon-primary text-primary-foreground hover:bg-neon-secondary font-bold"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4 mr-2" />}
                Approve & Publish
            </Button>

            {/* Contacted Button */}
            {currentStatus === 'new' && (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate('contacted')}
                    disabled={loading}
                    className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Mark Contacted
                </Button>
            )}

            {/* Close/Reject Button */}
            {currentStatus !== 'closed' && (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleStatusUpdate('closed')}
                    disabled={loading}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                    <XCircle className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
