import { ContributionStatsCard } from "./contribution-stats";
import { ContributionStats, GithubStats, UserSubmission, BountyStats as BountyStatsType } from "../types";
// LocationCard import removed
import { DevPulse } from "./dev-pulse";
import { processDevPulseData } from "../utils/pulse-utils";
import { useMemo } from "react";
import { ProfileData } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Terminal, Code2, User, Github, ExternalLink, Linkedin } from "lucide-react";
import { GithubGraph } from "./github-graph";
import { TopLanguages } from "./top-languages";
import { BountyStats } from "./bounty-stats";
import { MySubmissions } from "./my-submissions";
import { createClient } from "@/lib/supabase/client";

interface ProfileDetailsProps {
    profile: ProfileData;
    githubStats?: GithubStats;
    bountyStats?: { totalWins: number; totalEarnings: number };
    contributionStats?: ContributionStats | null; // Added prop
    userSubmissions?: UserSubmission[];
    onEdit: () => void;
}

export function ProfileDetails({ profile, githubStats, bountyStats, contributionStats, userSubmissions, onEdit }: ProfileDetailsProps) {
    const pulseData = useMemo(() => processDevPulseData(githubStats?.contributionCalendar ? {
        totalContributions: githubStats.totalContributions,
        weeks: githubStats.contributionCalendar
    } : null), [githubStats]);
    const handleLinkGithub = () => {
        const supabase = createClient();
        supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/profile`
            }
        });
    };

    const hasSocialLinks = profile.x_url || profile.linkedin_url || profile.website_url;

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-1">
                    {profile.full_name && (
                        <p className="text-sm text-muted-foreground font-mono">{profile.full_name}</p>
                    )}
                    <h1 className="text-3xl font-bold font-mono tracking-tighter bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        {profile.username || "Anonymous Netrunner"}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span className="font-mono text-sm uppercase tracking-widest">
                            {profile.developer_role || profile.role || "Unclassified"}
                        </span>
                    </div>
                    {/* Social Links */}
                    {hasSocialLinks && (
                        <div className="flex items-center gap-3 pt-2">
                            {/* ... existing social links code ... */}
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
                <Button
                    onClick={onEdit}
                    variant="cyberpunk"
                    className="w-full md:w-auto min-w-[120px]"
                >
                    Edit Profile
                </Button>
            </div>

            {/* Contribution Stats Section */}
            <div>
                <ContributionStatsCard stats={contributionStats || null} isOwnProfile={true} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info Column */}
                <div className="col-span-1 md:col-span-2 space-y-6">

                    {/* Dev Pulse Visualization - Main Column */}
                    {pulseData && (
                        <div className="border border-border rounded-xl p-6 bg-card/40 backdrop-blur-md shadow-[0_0_30px_rgba(34,197,94,0.05)]">
                            <DevPulse data={pulseData} />
                        </div>
                    )}

                    {githubStats && (
                        <GithubGraph
                            data={githubStats.contributionCalendar}
                            totalContributions={githubStats.totalContributions}
                        />
                    )}

                    <Card className="bg-card/40 border-border backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-neon-primary font-mono text-sm uppercase tracking-widest">
                                <Terminal className="w-4 h-4" />
                                Bio / Lore
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed font-mono text-sm">
                                {profile.bio || "No lore data available for this user."}
                            </p>
                        </CardContent>
                    </Card>

                    {bountyStats && (
                        <BountyStats stats={bountyStats} />
                    )}

                    {userSubmissions && (
                        <MySubmissions submissions={userSubmissions} />
                    )}
                </div>

                {/* Stats / Attributes Column */}
                <div className="space-y-6">
                    {/* Location */}
                    <Card className="bg-card/40 border-border backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-neon-secondary font-mono text-sm uppercase tracking-widest">
                                <MapPin className="w-4 h-4" />
                                Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground font-mono text-sm">
                                {profile.location || "Unknown Location"}
                            </p>

                            {/* Dev Pulse moved to main column */}
                        </CardContent>
                    </Card>

                    {/* Tech Stack */}
                    <Card className="bg-card/40 border-border backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-neon-cyan font-mono text-sm uppercase tracking-widest">
                                <Code2 className="w-4 h-4" />
                                Tech Arsenal
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {profile.stack && profile.stack.length > 0 ? (
                                    profile.stack.map((tech) => (
                                        <Badge
                                            key={tech}
                                            variant="outline"
                                            className="border-border text-muted-foreground font-mono text-xs hover:border-neon-cyan hover:text-neon-cyan transition-colors"
                                        >
                                            {tech}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground text-xs font-mono">No tech stack declared</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {githubStats ? (
                        <TopLanguages languages={githubStats.topLanguages} />
                    ) : (
                        <Card className="bg-card/40 border-border backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-muted-foreground font-mono text-sm uppercase tracking-widest">
                                    <Github className="w-4 h-4" />
                                    GitHub Sync
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-xs text-muted-foreground font-mono">
                                    Link your GitHub account to display your contribution graph and top languages.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full border-border hover:bg-muted text-muted-foreground font-mono text-xs"
                                    onClick={handleLinkGithub}
                                >
                                    Connect GitHub
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}


