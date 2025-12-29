"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ExternalLink, MapPin, DollarSign } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
        <div className="space-y-6 container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Jobs</h2>
                    <p className="text-muted-foreground">Manage your open positions</p>
                </div>
                <Link href="/dashboard/company/jobs/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Post Job
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {jobs.map((job) => (
                    <Card key={job.id} className="overflow-hidden">
                        <CardHeader className="pb-3 grid grid-cols-[1fr_auto] items-start gap-4 space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    {job.title}
                                    {!job.is_active && <Badge variant="secondary">Inactive</Badge>}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-3.5 w-3.5" /> {job.location}
                                    {job.is_remote && " (Remote)"}
                                    <span className="inline-block mx-1">•</span>
                                    {job.employment_type}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/dashboard/company/jobs/${job.id}/edit`}>
                                        Edit
                                    </Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/jobs/${job.id}`} target="_blank">
                                        View Live <ExternalLink className="ml-2 h-3 w-3" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
