"use client";

import Link from "next/link";
import { Briefcase, MapPin, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    is_remote: boolean;
    employment_type: string;
    salary_min?: number | null;
    salary_max?: number | null;
    posted_at: string;
}

interface CompanyJobsListProps {
    jobs: Job[];
    companyName: string;
}

export function CompanyJobsList({ jobs, companyName }: CompanyJobsListProps) {
    if (jobs.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Open Positions</CardTitle>
                    <CardDescription>Current job openings at {companyName}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No open positions</h3>
                        <p className="text-muted-foreground">Check back later for new opportunities</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Open Positions</CardTitle>
                <CardDescription>{jobs.length} job{jobs.length !== 1 ? 's' : ''} available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {jobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {/* Job Title & Type */}
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary">{job.employment_type}</Badge>
                                            {job.is_remote && <Badge variant="outline">Remote</Badge>}
                                        </div>
                                    </div>
                                </div>

                                {/* Job Details */}
                                <div className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{job.location}</span>
                                    </div>
                                    {(job.salary_min || job.salary_max) && (
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" />
                                            <span>
                                                {job.salary_min && job.salary_max
                                                    ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                                                    : job.salary_min
                                                        ? `From $${job.salary_min.toLocaleString()}`
                                                        : `Up to $${job.salary_max?.toLocaleString()}`}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>Posted {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })}</span>
                                    </div>
                                </div>

                                {/* Description Preview */}
                                <p className="text-muted-foreground line-clamp-2">
                                    {job.description}
                                </p>

                                {/* View Job Button */}
                                <div className="pt-2">
                                    <Button asChild>
                                        <Link href={`/jobs/${job.id}`}>
                                            View Job Details
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}
