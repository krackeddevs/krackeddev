"use client";

import { getCompanyApplications, updateApplicationStatus } from "@/features/jobs/actions";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface ApplicantsTableProps {
    companyId: string;
}

export function ApplicantsTable({ companyId }: ApplicantsTableProps) {
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const { data } = await getCompanyApplications(companyId);
                if (data) setApplications(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApps();
    }, [companyId]);

    const handleStatusChange = async (appId: string, newStatus: string) => {
        try {
            await updateApplicationStatus(appId, newStatus);
            setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: newStatus } : a));
            toast.success("Status updated");
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleDownloadResume = async (path: string) => {
        const { data } = supabase.storage.from("resumes").getPublicUrl(path);
        // Wait, public URL only works if bucket is public. It is PRIVATE.
        // Need signed URL.
        const { data: signed, error } = await supabase.storage.from("resumes").createSignedUrl(path, 60);
        if (error) {
            toast.error("Failed to get download link");
            return;
        }
        window.open(signed.signedUrl, "_blank");
    };

    if (isLoading) return <Loader2 className="w-6 h-6 animate-spin mx-auto mt-10" />;

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block border border-border rounded-lg overflow-hidden bg-card/40">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="text-muted-foreground">Candidate</TableHead>
                            <TableHead className="text-muted-foreground">Applied For</TableHead>
                            <TableHead className="text-muted-foreground">Date</TableHead>
                            <TableHead className="text-muted-foreground">Resume</TableHead>
                            <TableHead className="text-muted-foreground">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.id} className="hover:bg-muted/10 border-border">
                                <TableCell className="font-medium text-foreground">
                                    <div>{app.candidate.fullName || app.candidate.username}</div>
                                    <div className="text-xs text-muted-foreground">{app.candidate.email}</div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{app.job.title}</TableCell>
                                <TableCell className="text-muted-foreground">
                                    {format(new Date(app.createdAt), "MMM d")}
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm" onClick={() => handleDownloadResume(app.resumeUrl)}>
                                        <Download className="w-4 h-4 mr-2" />
                                        PDF
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Select defaultValue={app.status} onValueChange={(val) => handleStatusChange(app.id, val)}>
                                        <SelectTrigger className="w-[130px] h-8 bg-background border-border">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="reviewing">Reviewing</SelectItem>
                                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                            <SelectItem value="hired">Hired</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                        {applications.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No applications yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {applications.map((app) => (
                    <div key={app.id} className="bg-card/40 border border-border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-bold text-foreground text-lg">{app.candidate.fullName || app.candidate.username}</div>
                                <div className="text-sm text-muted-foreground">{app.candidate.email}</div>
                            </div>
                            <div className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded">
                                {format(new Date(app.createdAt), "MMM d")}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Applied For</div>
                            <div className="text-sm text-foreground">{app.job.title}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button variant="outline" size="sm" className="w-full border-border" onClick={() => handleDownloadResume(app.resumeUrl)}>
                                <Download className="w-4 h-4 mr-2" />
                                Resume
                            </Button>
                            <Select defaultValue={app.status} onValueChange={(val) => handleStatusChange(app.id, val)}>
                                <SelectTrigger className="w-full h-9 bg-background border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="reviewing">Reviewing</SelectItem>
                                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="hired">Hired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ))}
                {applications.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border border-border rounded-lg bg-card/40">
                        No applications yet.
                    </div>
                )}
            </div>
        </>
    );
}
