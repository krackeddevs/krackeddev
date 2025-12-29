"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ExternalLink, MapPin, DollarSign } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
// ... other imports

interface JobsListProps {
    jobs: any[]; // define proper type
}

export function JobsList({ jobs }: JobsListProps) {
    if (!jobs || jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed min-h-[400px]">
                <div className="bg-secondary/50 p-4 rounded-full mb-4">
                    <PlusCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                    Create your first job posting to start attracting top talent.
                </p>
                <Link href="/dashboard/company/jobs/new">
                    <Button>Post a Job</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <DashboardHeader
                heading="Jobs"
                text="Manage your open positions"
            >
                <Link href="/dashboard/company/jobs/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Post Job
                    </Button>
                </Link>
            </DashboardHeader>

            {/* Desktop Table View */}
            <div className="hidden md:block border border-white/10 rounded-lg overflow-hidden bg-black/40">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="hover:bg-transparent border-white/10">
                            <TableHead className="text-gray-400">Title</TableHead>
                            <TableHead className="text-gray-400">Location</TableHead>
                            <TableHead className="text-gray-400">Type</TableHead>
                            <TableHead className="text-gray-400">Posted</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-right text-gray-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobs.map((job) => (
                            <TableRow key={job.id} className="hover:bg-white/5 border-white/5">
                                <TableCell className="font-medium text-white">{job.title}</TableCell>
                                <TableCell className="text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {job.location}
                                        {job.is_remote && " (Remote)"}
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-400">{job.employment_type}</TableCell>
                                <TableCell className="text-gray-400">
                                    {new Date(job.posted_at).toLocaleDateString('en-US')}
                                </TableCell>
                                <TableCell>
                                    {!job.is_active ? (
                                        <Badge variant="secondary">Inactive</Badge>
                                    ) : (
                                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/company/jobs/${job.id}/edit`}>
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/jobs/${job.id}`} target="_blank">
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden">
                {jobs.map((job) => (
                    <Card key={job.id} className="overflow-hidden bg-black/40 border-white/10">
                        <CardHeader className="pb-3 grid grid-cols-[1fr_auto] items-start gap-4 space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="text-xl flex items-center gap-2 text-white">
                                    {job.title}
                                    {!job.is_active && <Badge variant="secondary">Inactive</Badge>}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-sm text-gray-400">
                                    <MapPin className="h-3.5 w-3.5" /> {job.location}
                                    {job.is_remote && " (Remote)"}
                                    <span className="inline-block mx-1">•</span>
                                    {job.employment_type}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5">
                                    <Link href={`/dashboard/company/jobs/${job.id}/edit`}>
                                        Edit
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <DollarSign className="h-3.5 w-3.5" />
                                    {job.salary_min && job.salary_max
                                        ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                                        : "Salary not specified"}
                                </div>
                                <div>
                                    Posted {new Date(job.posted_at).toLocaleDateString('en-US')}
                                </div>
                            </div>
                            <div className="mt-4">
                                <Button variant="secondary" className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10" asChild>
                                    <Link href={`/jobs/${job.id}`} target="_blank">
                                        View Live Job <ExternalLink className="ml-2 h-3 w-3" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
