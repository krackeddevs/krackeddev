"use client";

import { Building2, Globe, Linkedin, Twitter, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface CompanyHeaderProps {
    company: {
        name: string;
        logo_url?: string | null;
        banner_url?: string | null;
        website_url?: string | null;
        linkedin_url?: string | null;
        twitter_url?: string | null;
        is_verified?: boolean;
    };
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
    return (
        <div className="relative">
            {/* Banner */}
            {company.banner_url ? (
                <div className="h-64 w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
                    <img
                        src={company.banner_url}
                        alt={`${company.name} banner`}
                        className="h-full w-full object-cover"
                    />
                </div>
            ) : (
                <div className="h-64 w-full bg-gradient-to-r from-blue-500 to-purple-600" />
            )}

            {/* Company Info Overlay */}
            <div className="container mx-auto px-4">
                <div className="relative -mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
                    {/* Logo */}
                    <Avatar className="h-32 w-32 border-4 border-background">
                        <AvatarImage src={company.logo_url || ""} alt={company.name} />
                        <AvatarFallback className="text-2xl">
                            <Building2 className="h-16 w-16" />
                        </AvatarFallback>
                    </Avatar>

                    {/* Company Name & Links */}
                    <div className="flex-1 space-y-2 pb-4">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold">{company.name}</h1>
                            {company.is_verified && (
                                <BadgeCheck className="h-6 w-6 text-blue-500" />
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-2">
                            {company.website_url && (
                                <Button variant="outline" size="sm" asChild>
                                    <a href={company.website_url} target="_blank" rel="noopener noreferrer">
                                        <Globe className="mr-2 h-4 w-4" />
                                        Website
                                    </a>
                                </Button>
                            )}
                            {company.linkedin_url && (
                                <Button variant="outline" size="sm" asChild>
                                    <a href={company.linkedin_url} target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="h-4 w-4" />
                                    </a>
                                </Button>
                            )}
                            {company.twitter_url && (
                                <Button variant="outline" size="sm" asChild>
                                    <a href={company.twitter_url} target="_blank" rel="noopener noreferrer">
                                        <Twitter className="h-4 w-4" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
