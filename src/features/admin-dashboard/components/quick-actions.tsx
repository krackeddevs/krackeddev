"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, FileCheck, Shield, Zap } from "lucide-react";

export function QuickActions() {
    return (
        <Card className="border-2 border-green-500/30 bg-black/40 backdrop-blur-sm hover:border-green-500 hover:bg-green-500/5 transition-all duration-300">
            <CardHeader>
                <CardTitle className="font-mono text-green-500">Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Button asChild variant="outline" className="justify-start gap-2 h-auto py-3">
                    <Link href="/admin/bounties/create">
                        <Plus className="h-4 w-4" />
                        <div className="text-left">
                            <div className="font-medium">Create Bounty</div>
                            <div className="text-xs text-muted-foreground">Post new opportunity</div>
                        </div>
                    </Link>
                </Button>

                <Button asChild variant="outline" className="justify-start gap-2 h-auto py-3">
                    <Link href="/admin/submissions">
                        <FileCheck className="h-4 w-4" />
                        <div className="text-left">
                            <div className="font-medium">Review Submissions</div>
                            <div className="text-xs text-muted-foreground">Pending reviews</div>
                        </div>
                    </Link>
                </Button>

                <Button asChild variant="outline" className="justify-start gap-2 h-auto py-3">
                    <Link href="/admin/verifications">
                        <Shield className="h-4 w-4" />
                        <div className="text-left">
                            <div className="font-medium">Verifications</div>
                            <div className="text-xs text-muted-foreground">Company requests</div>
                        </div>
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
