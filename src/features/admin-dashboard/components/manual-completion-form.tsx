'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, Trophy, Loader2 } from 'lucide-react';
import { markBountyCompletedManually } from '@/features/bounty-board/actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ManualCompletionFormProps {
    bountyId: string;
    currentStatus: string;
    currentWinner?: {
        name?: string;
        xHandle?: string;
        xUrl?: string;
        submissionUrl?: string;
    };
    onComplete?: () => void;
}

export function ManualCompletionForm({
    bountyId,
    currentStatus,
    currentWinner,
    onComplete,
}: ManualCompletionFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [winnerName, setWinnerName] = useState(currentWinner?.name || '');
    const [winnerXHandle, setWinnerXHandle] = useState(currentWinner?.xHandle || '');
    const [winnerXUrl, setWinnerXUrl] = useState(currentWinner?.xUrl || '');
    const [winnerSubmissionUrl, setWinnerSubmissionUrl] = useState(currentWinner?.submissionUrl || '');

    const isAlreadyCompleted = currentStatus === 'completed';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!winnerName.trim()) {
            toast.error('Winner name is required');
            return;
        }

        setIsLoading(true);

        const result = await markBountyCompletedManually(bountyId, {
            winnerName,
            winnerXHandle: winnerXHandle || undefined,
            winnerXUrl: winnerXUrl || undefined,
            winnerSubmissionUrl: winnerSubmissionUrl || undefined,
        });

        setIsLoading(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Bounty marked as completed with winner info');
            onComplete?.();
        }
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-6">
            <CollapsibleTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-between",
                        isAlreadyCompleted && "border-green-500/50 text-green-400"
                    )}
                >
                    <span className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        {isAlreadyCompleted ? 'Update Winner Info' : 'Manual Completion (External Submission)'}
                    </span>
                    <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen && "rotate-180"
                    )} />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Use this to mark the bounty as completed when the submission was done outside
                        the platform (e.g., via X/Twitter, direct email, etc.).
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="winnerName">Winner Name *</Label>
                                <Input
                                    id="winnerName"
                                    placeholder="John Doe"
                                    value={winnerName}
                                    onChange={(e) => setWinnerName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="winnerXHandle">X/Twitter Handle</Label>
                                <Input
                                    id="winnerXHandle"
                                    placeholder="johndoe"
                                    value={winnerXHandle}
                                    onChange={(e) => setWinnerXHandle(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="winnerXUrl">X/Twitter Profile URL</Label>
                                <Input
                                    id="winnerXUrl"
                                    placeholder="https://x.com/johndoe"
                                    value={winnerXUrl}
                                    onChange={(e) => setWinnerXUrl(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="winnerSubmissionUrl">Submission URL</Label>
                                <Input
                                    id="winnerSubmissionUrl"
                                    placeholder="https://x.com/johndoe/status/..."
                                    value={winnerSubmissionUrl}
                                    onChange={(e) => setWinnerSubmissionUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading || !winnerName.trim()}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Trophy className="mr-2 h-4 w-4" />
                                        {isAlreadyCompleted ? 'Update Winner' : 'Mark as Completed'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
