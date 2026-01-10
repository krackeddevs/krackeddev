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
import { XPProgressBar } from "./xp-progress-bar";
import { TerminalFeed } from "./terminal-feed";
import { useHUDData } from "../hooks/use-hud-data";
import { TrophyIcon } from "lucide-react";
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
    const { logs, metrics } = useHUDData(profile.id, contributionStats ?? null, bountyStats ?? null, profile);

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
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 selection:bg-[var(--neon-cyan)]/30">
            {/* Header / Identity HUD */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--neon-purple)] to-transparent opacity-10 blur-sm group-hover:opacity-20 transition-opacity" />
                <div className="relative bg-background/50 border border-[var(--neon-cyan)]/20 p-6 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-8 backdrop-blur-xl">
                    {/* Scanning Avatar */}
                    <div className="relative shrink-0">
                        <div className="absolute -inset-2 border-2 border-[var(--neon-purple)]/30 border-dashed rounded-full animate-spin-slow" />
                        <div className="absolute inset-0 bg-[var(--neon-purple)] blur-xl opacity-10 animate-pulse" />
                        <div className="relative w-32 h-32 rounded-full border-4 border-foreground/10 overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                            {profile.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.username || "User"}
                                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                                    <User className="w-12 h-12 text-muted-foreground/30" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-scanline pointer-events-none opacity-20" />
                        </div>
                        {/* Status Blip */}
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-background border-2 border-[var(--neon-lime)] rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-2.5 h-2.5 bg-[var(--neon-lime)] rounded-full animate-pulse shadow-[0_0_8px_var(--neon-lime)]" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="space-y-1">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                <span className="text-[10px] font-mono text-[var(--neon-purple)] bg-[var(--neon-purple)]/10 px-2 py-0.5 border border-[var(--neon-purple)]/20 tracking-widest uppercase">
                                    OWNER_ACCESS_GRANTED
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-50">Node: Local_Auth</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black font-mono tracking-tighter text-foreground uppercase italic leading-none">
                                {profile.full_name || profile.username || "ANONYMOUS"}
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground font-mono font-light tracking-widest">
                                @{profile.username || "netrunner"}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-muted-foreground">
                            <div className="flex items-center gap-2 group/role transition-colors hover:text-[var(--neon-cyan)]">
                                <Terminal className="w-4 h-4 text-[var(--neon-cyan)]" />
                                <span className="font-mono text-xs uppercase tracking-[0.3em] font-bold">
                                    {profile.developer_role || profile.role || "Specialist"}
                                </span>
                            </div>
                            {profile.location && (
                                <div className="flex items-center gap-2 transition-colors hover:text-[var(--neon-purple)]">
                                    <MapPin className="w-4 h-4 text-[var(--neon-purple)]" />
                                    <span className="font-mono text-xs uppercase tracking-widest">{profile.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action HUD Module */}
                    <div className="w-full md:w-auto flex flex-col gap-3">
                        <Button
                            onClick={onEdit}
                            variant="cyberpunk"
                            className="bg-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/80 text-black font-mono font-black uppercase tracking-widest px-8 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                        >
                            Configure Identity
                        </Button>
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">Last Sync: Just Now</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-lime)] animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid (9:3) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column (9) */}
                <div className="lg:col-span-9 space-y-12">
                    {/* Activity & Progress */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 bg-background/30 border border-[var(--neon-cyan)]/20 p-6 flex flex-col justify-center gap-6 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none" />
                            <XPProgressBar showDetails />
                        </div>
                        <div className="md:col-span-8">
                            <ContributionStatsCard
                                stats={contributionStats || null}
                            />
                        </div>
                    </div>

                    {/* Dev Pulse Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-foreground shrink-0">Neural Dev Pulse</span>
                            <div className="h-px w-full bg-border/10" />
                        </div>
                        {pulseData && <DevPulse data={pulseData} />}
                    </div>

                    {/* GitHub Network Matrix */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-foreground shrink-0">Network Matrix</span>
                            <div className="h-px w-full bg-border/10" />
                        </div>
                        {githubStats && (
                            <GithubGraph
                                data={githubStats.contributionCalendar}
                                totalContributions={githubStats.totalContributions}
                            />
                        )}
                    </div>

                    {/* Bio / Mission Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        <div className="md:col-span-7 space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-foreground shrink-0">Identity Lore</span>
                                <div className="h-px w-full bg-border/10" />
                            </div>
                            <div className="bg-background/50 border-l-4 border-l-[var(--neon-purple)] p-6 font-mono text-sm text-foreground/70 italic leading-relaxed backdrop-blur-sm">
                                "{profile.bio || "ACCESS_DENIED: User lore not found in sector database."}"
                            </div>
                        </div>

                        <div className="md:col-span-5 space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-foreground shrink-0">Bounty Archives</span>
                                <div className="h-px w-full bg-border/10" />
                            </div>
                            {bountyStats ? (
                                <BountyStats stats={bountyStats} />
                            ) : (
                                <div className="bg-background/30 border border-border/10 p-6 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                                    No archive data detected
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mission Submissions */}
                    {userSubmissions && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-foreground shrink-0">Active Operations</span>
                                <div className="h-px w-full bg-border/10" />
                            </div>
                            <MySubmissions submissions={userSubmissions} />
                        </div>
                    )}
                </div>

                {/* Right Column (3) */}
                <div className="lg:col-span-3 space-y-12">
                    {/* System Log Terminal */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--neon-purple)] font-bold uppercase tracking-widest">
                            <Terminal className="w-3 h-3" />
                            <span>Authorization Logs</span>
                        </div>
                        <div className="bg-background/80 border border-[var(--neon-purple)]/20 p-0 h-[450px] overflow-hidden relative group/term">
                            <div className="absolute inset-0 bg-scanline pointer-events-none opacity-5 z-20" />
                            <TerminalFeed logs={logs} />
                        </div>
                    </div>

                    {/* Tech Arsenal */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--neon-cyan)] font-bold uppercase tracking-widest">
                            <Code2 className="w-3 h-3" />
                            <span>Tech Arsenal</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profile.stack && profile.stack.length > 0 ? (
                                profile.stack.map((tech) => (
                                    <div
                                        key={tech}
                                        className="px-2 py-1 bg-background/30 border border-border/20 text-foreground/70 font-mono text-[10px] uppercase tracking-wider hover:border-[var(--neon-cyan)]/50 hover:text-[var(--neon-cyan)] transition-colors cursor-default"
                                    >
                                        {tech}
                                    </div>
                                ))
                            ) : (
                                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest italic opacity-40">No arsenal declared</div>
                            )}
                        </div>
                    </div>

                    {/* GitHub Connection */}
                    {(!githubStats || !contributionStats) && (
                        <div className="bg-[var(--neon-purple)]/[0.03] border border-[var(--neon-purple)]/20 p-6 space-y-4 relative overflow-hidden group/uplink">
                            <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />
                            <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--neon-purple)] font-bold uppercase tracking-widest mb-2">
                                <Github className="w-3 h-3" />
                                <span>External Uplink</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">
                                {contributionStats ? "GitHub grid data missing. Establish a live uplink to track full neural matrix." : "Sync GitHub to monitor contribution streaks and neural uptime."}
                            </p>
                            <Button
                                variant="outline"
                                className="w-full border-[var(--neon-purple)]/30 hover:bg-[var(--neon-purple)]/10 text-[var(--neon-purple)] font-mono text-[10px] uppercase tracking-widest rounded-none py-6 group-hover/uplink:border-[var(--neon-purple)] transition-all"
                                onClick={handleLinkGithub}
                            >
                                {contributionStats ? "Recalibrate Uplink" : "Connect Uplink"}
                            </Button>
                        </div>
                    )}

                    {/* System Summary */}
                    <div className="bg-[var(--neon-cyan)]/[0.02] border border-border/10 p-6 space-y-4">
                        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">// Dashboard Summary</div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-muted-foreground uppercase">Identity Integrity</span>
                                <span className="text-[var(--neon-lime)] font-bold">100%</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-muted-foreground uppercase">Signal Stability</span>
                                <span className={`${metrics.signalStability > 80 ? 'text-[var(--neon-lime)]' : metrics.signalStability > 50 ? 'text-[var(--neon-cyan)]' : 'text-orange-500'} font-bold`}>
                                    {metrics.signalStability}% {metrics.signalStability > 90 ? 'EXCELLENT' : metrics.signalStability > 70 ? 'STABLE' : 'DEGRADED'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-muted-foreground uppercase">Archive Grade</span>
                                <span className="text-[var(--neon-cyan)] font-bold">GRADE_{metrics.archiveGrade}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-muted-foreground uppercase">Node Uptime</span>
                                <span className="text-[var(--neon-purple)] font-bold">{metrics.nodeUptime}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scanning Animation Styles */}
            <style jsx global>{`
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .bg-scanline {
                    background: linear-gradient(to bottom, transparent, rgba(34, 211, 238, 0.1) 50%, transparent);
                    background-size: 100% 4px;
                    animation: scan 6s linear infinite;
                }
                @keyframes scan {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(100%); }
                }
            `}</style>
        </div>
    );
}


