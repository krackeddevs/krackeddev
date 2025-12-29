import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, MapPin, Users, BadgeCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Browse Companies | KrackedDev",
    description: "Explore companies hiring on KrackedDev and discover job opportunities",
};

async function getCompanies() {
    const supabase = await createClient();

    const { data: companies } = await supabase
        .from("companies")
        .select("*")
        .order("name");

    return companies || [];
}


export default async function CompaniesPage() {
    const companies = await getCompanies();

    return (
        <div className="min-h-screen bg-background pt-32 pb-16">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold font-mono text-white mb-4 tracking-tight">
                        COMPANY DIRECTORY
                    </h1>
                    <p className="text-muted-foreground text-lg font-mono">
                        {companies.length} {companies.length === 1 ? 'company' : 'companies'} hiring on KrackedDev
                    </p>
                </div>

                {companies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2 font-mono">NO COMPANIES YET</h3>
                        <p className="text-muted-foreground font-mono">Check back later as companies join the platform</p>
                    </div>
                ) : (
                    <div className="grid gap-4 max-w-2xl mx-auto">
                        {companies.map((company) => (
                            <Link
                                key={company.id}
                                href={`/companies/${company.slug}`}
                                className="group"
                            >
                                <div className="relative border-2 border-neon-primary/50 rounded-lg p-6 bg-background/50 backdrop-blur-sm
                                    hover:border-neon-primary hover:bg-neon-primary/5 transition-all duration-300
                                    hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">

                                    <div className="flex items-center gap-4">
                                        {/* Company Icon/Logo */}
                                        <div className="relative flex-shrink-0">
                                            {company.logo_url ? (
                                                <img
                                                    src={company.logo_url}
                                                    alt={company.name}
                                                    className="w-14 h-14 rounded-lg object-cover border border-neon-primary/30"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-lg bg-neon-primary/10 border border-neon-primary/30 flex items-center justify-center">
                                                    <Building2 className="w-7 h-7 text-neon-primary" />
                                                </div>
                                            )}
                                            {company.is_verified && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-background">
                                                    <BadgeCheck className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Company Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-bold font-mono text-neon-primary group-hover:text-white transition-colors">
                                                {company.name}
                                            </h3>
                                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground font-mono">
                                                {company.industry && (
                                                    <span className="flex items-center gap-1">
                                                        <span className="text-neon-primary">▸</span> {company.industry}
                                                    </span>
                                                )}
                                                {company.location && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {company.location}
                                                    </span>
                                                )}
                                                {company.size && (
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" /> {company.size}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Arrow indicator */}
                                        <div className="text-neon-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-2xl font-mono">→</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
