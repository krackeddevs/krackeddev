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
        <div className="border border-white/10 rounded-lg overflow-hidden bg-black/40">
            <Table>
                <TableHeader className="bg-white/5">
                    <TableRow className="hover:bg-transparent border-white/10">
                        <TableHead className="text-gray-400">Candidate</TableHead>
                        <TableHead className="text-gray-400">Applied For</TableHead>
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Resume</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.map((app) => (
                        <TableRow key={app.id} className="hover:bg-white/5 border-white/5">
                            <TableCell className="font-medium text-white">
                                <div>{app.candidate.fullName || app.candidate.username}</div>
                                <div className="text-xs text-gray-500">{app.candidate.email}</div>
                            </TableCell>
                            <TableCell className="text-gray-300">{app.job.title}</TableCell>
                            <TableCell className="text-gray-400">
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
                                    <SelectTrigger className="w-[130px] h-8 bg-black/50 border-white/10">
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
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                No applications yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
