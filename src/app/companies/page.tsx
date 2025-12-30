import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, BadgeCheck, Search } from "lucide-react";
import Link from "next/link";
import "@/styles/jobs.css";

export const metadata: Metadata = {
    title: "Browse Companies | KrackedDev",
    description: "Explore companies hiring on KrackedDev and discover job opportunities",
};

import type { Company } from "@/types/database";

async function getCompanies(): Promise<Company[]> {
    const supabase = await createClient();

    const { data: companies } = await supabase
        .from("companies")
        .select("*")
        .order("is_verified", { ascending: false })
        .order("name");

    return companies || [];
}

export default async function CompaniesPage() {
    const companies = await getCompanies();
    const verifiedCount = companies.filter(c => c.is_verified).length;

    return (
        <main className="min-h-screen w-full bg-background relative">
            {/* Global Grid Overlay (Managed by global CSS) */}

            {/* CRT Scanline Overlay */}
            <div className="scanlines fixed inset-0 pointer-events-none z-40 h-screen"></div>

            <div className="relative z-20 container mx-auto px-4 max-w-7xl pt-32 pb-16">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Building2 className="h-10 w-10 text-neon-primary" />
                        <h1 className="text-4xl md:text-6xl font-bold font-mono text-foreground tracking-tight uppercase">
                            Company Directory
                        </h1>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground font-mono text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-neon-primary text-2xl font-bold">{companies.length}</span>
                            <span>{companies.length === 1 ? 'company' : 'companies'} hiring</span>
                        </div>
                        {verifiedCount > 0 && (
                            <>
                                <span className="hidden sm:inline text-muted-foreground/30">•</span>
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="h-4 w-4 text-blue-400" />
                                    <span>{verifiedCount} verified</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-10 max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="SEARCH COMPANIES..."
                            className="pl-12 h-12 bg-card/50 border-2 border-border focus:border-neon-primary font-mono text-foreground placeholder:text-muted-foreground uppercase text-sm"
                        />
                    </div>
                </div>

                {companies.length === 0 ? (
                    <div className="border-2 border-border bg-card/50 backdrop-blur-sm rounded-lg p-12">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-20 h-20 rounded-lg border-2 border-border bg-muted/5 flex items-center justify-center mb-6">
                                <Building2 className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold font-mono text-foreground mb-2 uppercase">No Companies Yet</h3>
                            <p className="text-muted-foreground font-mono text-sm text-center max-w-md">
                                Check back later as companies join the platform
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {companies.map((company) => (
                            <Link
                                key={company.id}
                                href={`/companies/${company.slug}`}
                                className="group"
                            >
                                <div className="h-full border-2 border-border bg-card/40 backdrop-blur-sm rounded-lg p-6
                                    hover:border-neon-primary hover:bg-neon-primary/5 transition-all duration-300
                                    hover:shadow-[0_0_30px_rgba(21,128,61,0.2)] hover:-translate-y-1">

                                    {/* Company Logo & Name */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="relative flex-shrink-0">
                                            {company.logo_url ? (
                                                <img
                                                    src={company.logo_url}
                                                    alt={company.name}
                                                    className="w-16 h-16 rounded-lg object-cover border-2 border-border"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-lg bg-muted/10 border-2 border-border flex items-center justify-center">
                                                    <Building2 className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-2 mb-1">
                                                <h3 className="text-lg font-bold font-mono text-foreground group-hover:text-neon-primary transition-colors line-clamp-1 uppercase">
                                                    {company.name}
                                                </h3>
                                                {company.is_verified && (
                                                    <BadgeCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                                )}
                                            </div>
                                            {company.industry && (
                                                <p className="text-xs text-muted-foreground font-mono line-clamp-1 uppercase">
                                                    {company.industry}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Company Description */}
                                    {company.description && (
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed font-mono">
                                            {company.description}
                                        </p>
                                    )}

                                    {/* Company Meta Info */}
                                    <div className="flex flex-wrap gap-2 text-xs font-mono mb-4">
                                        {company.location && (
                                            <div className="flex items-center gap-1 px-2 py-1 border border-border rounded bg-muted/5 text-muted-foreground">
                                                <MapPin className="w-3 h-3" />
                                                <span className="uppercase">{company.location}</span>
                                            </div>
                                        )}
                                        {company.size && (
                                            <div className="flex items-center gap-1 px-2 py-1 border border-border rounded bg-muted/5 text-muted-foreground">
                                                <Users className="w-3 h-3" />
                                                <span className="uppercase">{company.size}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* View Details Indicator */}
                                    <div className="pt-4 border-t border-border flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground font-mono uppercase">
                                            View Profile
                                        </span>
                                        <span className="text-neon-primary opacity-0 group-hover:opacity-100 transition-opacity text-xl font-mono">
                                            →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
