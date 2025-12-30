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
            <div className="text-center py-12 border border-border rounded-lg bg-card/40 backdrop-blur-sm">
                <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet.</p>
                <Link href="/jobs">
                    <Button variant="outline" className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 hover:text-neon-cyan">
                        Browse Jobs
                    </Button>
                </Link>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "new": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "reviewing": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
            case "shortlisted": return "bg-green-500/10 text-green-600 border-green-500/20";
            case "rejected": return "bg-red-500/10 text-red-600 border-red-500/20";
            case "hired": return "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20";
            default: return "bg-muted text-muted-foreground border-border";
        }
    };

    return (
        <>
            {/* Desktop View */}
            <div className="hidden md:block border border-border rounded-lg overflow-hidden bg-card/40 backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="text-muted-foreground">Job Title</TableHead>
                            <TableHead className="text-muted-foreground">Company</TableHead>
                            <TableHead className="text-muted-foreground">Date Applied</TableHead>
                            <TableHead className="text-muted-foreground">Status</TableHead>
                            <TableHead className="text-right text-muted-foreground">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.id} className="hover:bg-muted/5 border-border">
                                <TableCell className="font-medium text-foreground">{app.job.title}</TableCell>
                                <TableCell className="text-muted-foreground">{app.job.company}</TableCell>
                                <TableCell className="text-muted-foreground">
                                    {format(new Date(app.createdAt), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={getStatusColor(app.status)}>
                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/jobs/${app.job.id}`}>
                                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
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
                    <div key={app.id} className="bg-card/40 backdrop-blur-sm border border-border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-foreground text-lg">{app.job.title}</h3>
                                <p className="text-muted-foreground text-sm">{app.job.company}</p>
                            </div>
                            <Badge variant="outline" className={getStatusColor(app.status)}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                        </div>

                        <div className="flex items-center text-xs text-muted-foreground">
                            <span>Applied {format(new Date(app.createdAt), "MMM d, yyyy")}</span>
                        </div>

                        <div className="pt-2">
                            <Link href={`/jobs/${app.job.id}`} className="w-full block">
                                <Button variant="secondary" className="w-full bg-muted/50 hover:bg-muted/80 text-foreground border border-border">
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
