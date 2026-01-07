"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { BarChart3, Lock } from "lucide-react";
import { closePoll } from "@/features/admin/poll-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Poll {
    id: string;
    question: string;
    description: string | null;
    status: "active" | "closed";
    end_at: string;
    created_at: string;
    created_by: string;
    votes?: { count: number }[];
}

export function PollsTable({ polls }: { polls: Poll[] }) {
    // const { toast } = useToast();
    const router = useRouter();

    async function handleClose(id: string) {
        const result = await closePoll(id);
        if (result.error) {
            toast.error("Error", {
                description: result.error,
            });
        } else {
            toast.success("Success", {
                description: "Poll closed",
            });
            router.refresh();
        }
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Votes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {polls.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No polls created yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        polls.map((poll) => {
                            const isExpired = new Date(poll.end_at) < new Date();
                            // Supabase returns votes as array of objects if using select(..., votes(count))
                            // But usually it returns [{count: 5}]
                            // Depending on the query in poll-actions.ts:
                            // votes:poll_votes(count) -> returns array of objects with count property?
                            // Actually `count` is a specialized aggregate.
                            // Let's assume for now it returns array of votes, we take length. 
                            // Or if we used `count` aggregate, it might be `.count` property on the array or object.
                            // Let's check `poll-actions.ts` implementation: `votes:poll_votes(count)`
                            // This returns `votes: [{count: number}]`
                            // Wait, Supabase `select('*, votes:poll_votes(count)')` returns `votes: [{count: N}]` usually where N is total? No.
                            // It returns the rows of votes. `count` modifier changes it to return count.
                            // It returns `votes: [{count: number}]` per GROUP? No.
                            // `poll_votes(count)` returns the count of related rows. It usually returns `votes: [{count: 123}]` (array with 1 element)
                            // Let's safely access it.
                            const voteCount = Array.isArray(poll.votes) && poll.votes.length > 0
                                ? (poll.votes[0] as any).count
                                : 0;

                            return (
                                <TableRow key={poll.id}>
                                    <TableCell className="font-medium">{poll.question}</TableCell>
                                    <TableCell>
                                        {poll.status === "closed" ? (
                                            <Badge variant="secondary">Closed</Badge>
                                        ) : isExpired ? (
                                            <Badge variant="outline" className="text-orange-500 border-orange-500">Ended</Badge>
                                        ) : (
                                            <Badge className="bg-neon-cyan text-primary-foreground hover:bg-neon-cyan/80">Active</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {formatDistanceToNow(new Date(poll.end_at), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                                        {voteCount}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {poll.status === "active" && !isExpired && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleClose(poll.id)}
                                            >
                                                <Lock className="w-4 h-4 mr-2" />
                                                Close
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
