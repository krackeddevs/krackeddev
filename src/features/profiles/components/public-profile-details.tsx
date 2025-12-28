"use client";

import { ContributionStatsCard } from "./contribution-stats";
import { ContributionStats, GithubStats, BountyStats as BountyStatsType } from "../types";
import { ProfileData } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Terminal, Code2, User, ExternalLink, Linkedin, Trophy, Coins, ArrowLeft } from "lucide-react";
import { GithubGraph } from "./github-graph";
import { TopLanguages } from "./top-languages";
import Link from "next/link";
import { DevPulse } from "./dev-pulse";
import { processDevPulseData } from "../utils/pulse-utils";
import { useMemo } from "react";

interface PublicProfileDetailsProps {
    profile: ProfileData & { avatar_url?: string };
    githubStats?: GithubStats;
    bountyStats?: BountyStatsType;
    contributionStats?: ContributionStats | null;
}

export function PublicProfileDetails({ profile, githubStats, bountyStats, contributionStats }: PublicProfileDetailsProps) {
    const pulseData = useMemo(() => processDevPulseData(githubStats?.contributionCalendar ? {
        totalContributions: githubStats.totalContributions,
        weeks: githubStats.contributionCalendar
    } : null), [githubStats]);

    const hasSocialLinks = profile.x_url || profile.linkedin_url || profile.website_url;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in duration-500">
            {/* Back Button */}
            <Link
                href="/members"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors font-mono text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Members
            </Link>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 border-b border-white/10 pb-6">
                {/* Avatar */}
                {profile.avatar_url && (
                    <img
                        src={profile.avatar_url}
                        alt={profile.username || "User"}
                        className="w-24 h-24 rounded-full border-2 border-neon-primary"
                    />
                )}
                <div className="space-y-1 flex-1">
                    {profile.full_name && (
                        <h1 className="text-2xl font-bold font-mono tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            {profile.full_name}
                        </h1>
                    )}
                    <p className="text-lg text-muted-foreground font-mono">
                        @{profile.username || "anonymous"}
                    </p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span className="font-mono text-sm uppercase tracking-widest">
                            {profile.developer_role || profile.role || "Developer"}
                        </span>
                    </div>
                    {/* Social Links */}
                    {hasSocialLinks && (
                        <div className="flex items-center gap-3 pt-2">
                            {profile.x_url && (
                                <a href={profile.x_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-neon-primary transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </a>
                            )}
                            {profile.linkedin_url && (
                                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-neon-primary transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            )}
                            {profile.website_url && (
                                <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-neon-primary transition-colors">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Contribution Stats */}
            <div>
                <ContributionStatsCard stats={contributionStats || null} isOwnProfile={false} />
            </div>

            {/* Dev Pulse moved to main column */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info Column */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    {/* Bio */}
                    {profile.bio && (
                        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-neon-primary font-mono text-sm uppercase tracking-widest">
                                    <Terminal className="w-4 h-4" />
                                    Bio / Lore
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-zinc-300 leading-relaxed font-mono text-sm">
                                    {profile.bio}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Bounty Stats */}
                    {bountyStats && (bountyStats.totalWins > 0 || bountyStats.totalEarnings > 0) && (
                        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-white/5 border border-white/10">
                                        <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                                        <p className="text-2xl font-bold font-mono text-white">{bountyStats.totalWins}</p>
                                        <p className="text-xs text-muted-foreground font-mono uppercase">Bounties Won</p>
                                    </div>
                                    <div className="text-center p-4 bg-white/5 border border-white/10">
                                        <Coins className="w-6 h-6 text-neon-cyan mx-auto mb-2" />
                                        <p className="text-2xl font-bold font-mono text-white">RM {bountyStats.totalEarnings}</p>
                                        <p className="text-xs text-muted-foreground font-mono uppercase">Total Earnings</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Dev Pulse Visualization - Main Column */}
                    {pulseData && (
                        <div className="border border-white/10 rounded-xl p-6 bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(34,197,94,0.05)]">
                            <DevPulse data={pulseData} />
                        </div>
                    )}

                    {/* GitHub Graph */}
                    {githubStats && (
                        <GithubGraph
                            data={githubStats.contributionCalendar}
                            totalContributions={githubStats.totalContributions}
                        />
                    )}
                </div>

                {/* Side Column */}
                <div className="col-span-1 space-y-6">
                    {/* Location */}
                    {profile.location && (
                        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-neon-primary font-mono text-sm uppercase tracking-widest">
                                    <MapPin className="w-4 h-4" />
                                    Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-zinc-300 font-mono text-sm">{profile.location}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tech Stack */}
                    {profile.stack && profile.stack.length > 0 && (
                        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-neon-primary font-mono text-sm uppercase tracking-widest">
                                    <Code2 className="w-4 h-4" />
                                    Tech Arsenal
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {profile.stack.map((tech) => (
                                        <Badge
                                            key={tech}
                                            variant="outline"
                                            className="bg-white/5 text-zinc-300 border-white/20 font-mono text-xs"
                                        >
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Top Languages */}
                    {githubStats?.topLanguages && githubStats.topLanguages.length > 0 && (
                        <TopLanguages languages={githubStats.topLanguages} />
                    )}
                </div>
            </div>
        </div>
    );
}
