"use client";

import { useActionState, useEffect, useState } from "react";
import { createComment } from "@/features/community/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CommentFormProps {
    answerId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CommentForm({ answerId, onSuccess, onCancel }: CommentFormProps) {
    const [state, action, isPending] = useActionState(createComment, null);
    const [body, setBody] = useState("");

    useEffect(() => {
        if (state?.success) {
            setBody("");
            onSuccess?.();
            toast.success("Comment posted!");
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state, onSuccess]);

    return (
        <form action={action} className="space-y-2 mt-2">
            <input type="hidden" name="answer_id" value={answerId} />
            <Textarea
                name="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write a comment... (min 5 chars)"
                className="min-h-[80px] bg-muted/40 text-sm"
                required
                minLength={5}
                maxLength={500}
            />
            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" size="sm" disabled={isPending || body.length < 5}>
                    {isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                    Add Comment
                </Button>
            </div>
        </form>
    );
}
