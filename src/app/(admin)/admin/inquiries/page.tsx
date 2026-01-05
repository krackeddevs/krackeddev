import { createClient } from "@/lib/supabase/server";
import { InquiryActionButtons } from "@/features/admin/components/inquiry-action-buttons";
import { AdminPageHeader } from "@/features/admin-dashboard/components/admin-page-header";
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
import { User, Building2 } from "lucide-react";

export default async function AdminInquiriesPage() {
    const supabase = await createClient();

    // Fetch ALL inquiries
    const { data: inquiries, error } = await supabase
        .from("bounty_inquiries")
        .select("*, profiles(email, full_name, username)")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching inquiries:", error);
        return <div className="text-destructive p-8">Failed to load inquiries.</div>;
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Bounty Inquiries"
                description="Review and manage all incoming project requests."
                breadcrumbs={[{ label: "Inquiries" }]}
            />

            <div className="rounded-md border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="w-[180px]">Created</TableHead>
                            <TableHead>Submitter</TableHead>
                            <TableHead className="w-[30%]">Title / Brief</TableHead>
                            <TableHead>Budget</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!inquiries || inquiries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No inquiries found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            inquiries.map((inquiry) => (
                                <TableRow key={inquiry.id} className="hover:bg-muted/10">
                                    {/* Date */}
                                    <TableCell className="font-mono text-xs text-muted-foreground align-top py-4">
                                        {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                                    </TableCell>

                                    {/* Submitter */}
                                    <TableCell className="align-top py-4">
                                        <div className="flex flex-col gap-1">
                                            {inquiry.submitter_type === 'company' ? (
                                                <div className="flex items-center gap-2 font-medium text-neon-secondary">
                                                    <Building2 className="w-4 h-4" />
                                                    {inquiry.company_name}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 font-medium text-neon-primary">
                                                    <User className="w-4 h-4" />
                                                    Individual
                                                </div>
                                            )}
                                            <span className="text-xs text-muted-foreground font-mono">
                                                {inquiry.email}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Title / Brief */}
                                    <TableCell className="align-top py-4">
                                        <div className="flex flex-col gap-2">
                                            {inquiry.title && (
                                                <span className="font-bold text-foreground">
                                                    {inquiry.title}
                                                </span>
                                            )}
                                            <div className="text-xs text-muted-foreground font-mono opacity-80 whitespace-pre-wrap line-clamp-3 bg-muted/20 p-2 rounded border border-border/50">
                                                {inquiry.description}
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Budget */}
                                    <TableCell className="align-top py-4">
                                        <div className="font-mono text-xs font-bold text-neon-cyan border border-neon-cyan/30 px-2 py-1 rounded bg-neon-cyan/5 w-fit whitespace-nowrap">
                                            {inquiry.estimated_budget ? `RM ${Number(inquiry.estimated_budget).toLocaleString()}` : inquiry.budget_range}
                                        </div>
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell className="align-top py-4">
                                        <Badge variant="outline" className={`
                                            uppercase text-[10px] tracking-wider font-bold
                                            ${inquiry.status === 'new' ? 'text-blue-400 border-blue-400 bg-blue-400/10' : ''}
                                            ${inquiry.status === 'contacted' ? 'text-yellow-400 border-yellow-400 bg-yellow-400/10' : ''}
                                            ${inquiry.status === 'approved' ? 'text-neon-primary border-neon-primary bg-neon-primary/10' : ''}
                                            ${inquiry.status === 'closed' ? 'text-muted-foreground border-muted-foreground bg-muted/10' : ''}
                                        `}>
                                            {inquiry.status}
                                        </Badge>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-right align-top py-4">
                                        <div className="flex items-center gap-2 justify-end">
                                            <Button size="sm" variant="outline" asChild>
                                                <a href={`/admin/inquiries/${inquiry.id}`}>View</a>
                                            </Button>
                                            <InquiryActionButtons
                                                inquiryId={inquiry.id}
                                                currentStatus={inquiry.status}
                                                hasTitle={!!inquiry.title}
                                            />
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
