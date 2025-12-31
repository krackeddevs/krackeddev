import { getModerationQueue, resolveFlag } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Check, Trash, Ban, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function ModerationPage() {
    const queue = await getModerationQueue();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Moderation Queue</h1>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                    {queue.length} Pending
                </Badge>
            </div>

            <div className="border rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Resource</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Flagger</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {queue.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    All clean! No flagged content found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            queue.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="max-w-[300px]">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-medium line-clamp-1">
                                                {/* Display snippet based on type */}
                                                {item.content?.title || item.content?.content || item.content?.body || "Unknown Content"}
                                            </div>
                                            <div className="text-xs text-muted-foreground font-mono truncate">
                                                ID: {item.resource_id}
                                            </div>
                                            {/* Link to view context */}
                                            {item.resource_type === "question" && (
                                                <Link href={`/community/question/${item.content?.slug || item.resource_id}`} target="_blank" className="text-xs text-blue-400 hover:underline flex items-center gap-1 w-fit">
                                                    View <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {item.resource_type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20">
                                            {item.reason}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{item.flagger?.username || "Unknown"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <form action={async () => {
                                                "use server";
                                                await resolveFlag(item.resource_id, item.resource_type, "keep");
                                            }}>
                                                <Button size="sm" variant="outline" className="h-8 hover:bg-green-500/10 hover:text-green-500 border-green-200 dark:border-green-900">
                                                    <Check className="h-3.5 w-3.5 mr-2" />
                                                    Keep
                                                </Button>
                                            </form>

                                            <form action={async () => {
                                                "use server";
                                                await resolveFlag(item.resource_id, item.resource_type, "delete");
                                            }}>
                                                <Button size="sm" variant="outline" className="h-8 hover:bg-red-500/10 hover:text-red-500 border-red-200 dark:border-red-900">
                                                    <Trash className="h-3.5 w-3.5 mr-2" />
                                                    Delete
                                                </Button>
                                            </form>

                                            <form action={async () => {
                                                "use server";
                                                await resolveFlag(item.resource_id, item.resource_type, "ban");
                                            }}>
                                                <Button size="sm" variant="destructive" className="h-8 bg-red-600 hover:bg-red-700">
                                                    <Ban className="h-3.5 w-3.5 mr-2" />
                                                    Ban
                                                </Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
