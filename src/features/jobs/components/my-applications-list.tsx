"use client";

import { getUserApplications } from "../actions";
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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MyApplicationsList() {
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const { data, error } = await getUserApplications();
                if (data) {
                    setApplications(data);
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApps();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="text-center py-12 border border-white/10 rounded-lg bg-black/40">
                <p className="text-gray-400 mb-4">You haven't applied to any jobs yet.</p>
                <Link href="/jobs">
                    <Button variant="outline" className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10">
                        Browse Jobs
                    </Button>
                </Link>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "new": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "reviewing": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            case "shortlisted": return "bg-green-500/20 text-green-400 border-green-500/30";
            case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
            case "hired": return "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30";
            default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        }
    };

    return (
        <>
            {/* Desktop View */}
            <div className="hidden md:block border border-white/10 rounded-lg overflow-hidden bg-black/40">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="hover:bg-transparent border-white/10">
                            <TableHead className="text-gray-400">Job Title</TableHead>
                            <TableHead className="text-gray-400">Company</TableHead>
                            <TableHead className="text-gray-400">Date Applied</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-right text-gray-400">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.id} className="hover:bg-white/5 border-white/5">
                                <TableCell className="font-medium text-white">{app.job.title}</TableCell>
                                <TableCell className="text-gray-300">{app.job.company}</TableCell>
                                <TableCell className="text-gray-400">
                                    {format(new Date(app.createdAt), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={getStatusColor(app.status)}>
                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/jobs/${app.job.id}`}>
                                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                            View Job
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {applications.map((app) => (
                    <div key={app.id} className="bg-black/40 border border-white/10 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-white text-lg">{app.job.title}</h3>
                                <p className="text-gray-400 text-sm">{app.job.company}</p>
                            </div>
                            <Badge variant="outline" className={getStatusColor(app.status)}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                        </div>

                        <div className="flex items-center text-xs text-gray-500">
                            <span>Applied {format(new Date(app.createdAt), "MMM d, yyyy")}</span>
                        </div>

                        <div className="pt-2">
                            <Link href={`/jobs/${app.job.id}`} className="w-full block">
                                <Button variant="secondary" className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10">
                                    View Job
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
