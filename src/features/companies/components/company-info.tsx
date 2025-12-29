"use client";

import { Building2, MapPin, Users, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CompanyInfoProps {
    company: {
        name: string;
        description?: string | null;
        size?: string | null;
        location?: string | null;
        industry?: string | null;
    };
}

export function CompanyInfo({ company }: CompanyInfoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>About {company.name}</CardTitle>
                <CardDescription>Company Overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Description */}
                {company.description && (
                    <div>
                        <h3 className="mb-2 font-semibold">About Us</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{company.description}</p>
                    </div>
                )}

                {/* Company Details */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {company.size && (
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Company Size</p>
                                <p className="text-sm text-muted-foreground">{company.size} employees</p>
                            </div>
                        </div>
                    )}

                    {company.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Location</p>
                                <p className="text-sm text-muted-foreground">{company.location}</p>
                            </div>
                        </div>
                    )}

                    {company.industry && (
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Industry</p>
                                <Badge variant="secondary">{company.industry}</Badge>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
