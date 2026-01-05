"use client";

import { BountyInquiry, Bounty, BountySubmissionRow } from "@/types/database";
import { EditBountyForm } from "./edit-bounty-form";
import { SubmissionList } from "./submission-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InquiryDetailsViewProps {
    inquiry: BountyInquiry;
    activeBounty?: Bounty | null;
    submissions?: BountySubmissionRow[];
    isOwner: boolean;
    backLink: string;
}

export function InquiryDetailsView({ inquiry, activeBounty, submissions = [], isOwner, backLink }: InquiryDetailsViewProps) {

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Button variant="ghost" size="sm" asChild className="pl-0 text-muted-foreground hover:text-foreground">
                            <Link href={backLink}>
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Inquiries
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-3xl font-mono font-bold text-neon-primary/90">
                        {activeBounty?.title || inquiry.title}
                    </h1>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">{activeBounty?.status || inquiry.status}</Badge>
                        {activeBounty && (
                            <a
                                href={`/code/bounty/${activeBounty.slug}`}
                                target="_blank"
                                className="text-xs text-muted-foreground hover:text-neon-cyan flex items-center gap-1"
                            >
                                View public listing <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="overview">Overview & Edit</TabsTrigger>
                    {activeBounty && (
                        <TabsTrigger value="submissions">
                            Submissions
                            {submissions.length > 0 && <span className="ml-2 px-1.5 py-0.5 rounded-full bg-foreground/10 text-xs">{submissions.length}</span>}
                        </TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <Card className="bg-card/50">
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EditBountyForm
                                inquiry={inquiry}
                                activeBounty={activeBounty}
                                isReadOnly={!isOwner}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {activeBounty && (
                    <TabsContent value="submissions" className="mt-6">
                        <Card className="bg-card/50">
                            <CardHeader>
                                <CardTitle>Review Submissions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <SubmissionList submissions={submissions} isOwner={isOwner} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
