"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { flagContent } from "@/features/moderation/actions";

interface FlagModalProps {
    resourceId: string;
    resourceType: "chat" | "question" | "answer";
    children?: React.ReactNode;
}

const FLAG_REASONS = [
    { value: "spam", label: "Spam or Unsolicited Promotion" },
    { value: "harassment", label: "Harassment or Hate Speech" },
    { value: "misinformation", label: "Misinformation or Incorrect" },
    { value: "violation", label: "Community Guidelines Violation" },
    { value: "other", label: "Other" },
];

export function FlagModal({ resourceId, resourceType, children }: FlagModalProps) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) {
            toast.error("Please select a reason");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("resourceId", resourceId);
        formData.append("resourceType", resourceType);
        formData.append("reason", `${reason}${details ? `: ${details}` : ""}`);

        // Handle optimistic update by potentially notifying parent component to hide
        // For now, we rely on toast confirmation

        const result = await flagContent(formData);
        setIsSubmitting(false);

        if (result.success) {
            toast.success("Content flagged for moderation");
            setOpen(false);
            setReason("");
            setDetails("");
        } else {
            toast.error((result.error as string) || "Failed to flag content");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Flag className="h-4 w-4" />
                        <span className="sr-only">Flag content</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Report Content</DialogTitle>
                    <DialogDescription>
                        Help us keep the community safe. Why are you flagging this?
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger id="reason">
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {FLAG_REASONS.map((r) => (
                                    <SelectItem key={r.value} value={r.value}>
                                        {r.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="details">Additional Details (Optional)</Label>
                        <Textarea
                            id="details"
                            placeholder="Provide more context if needed..."
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="resize-none"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="destructive" disabled={isSubmitting || !reason}>
                            {isSubmitting ? "Submitting..." : "Report Content"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
