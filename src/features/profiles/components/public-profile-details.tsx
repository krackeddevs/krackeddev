"use client";

import { ContributionStatsCard } from "./contribution-stats";
import { ContributionStats, GithubStats, BountyStats as BountyStatsType } from "../types";
import { ProfileData } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Terminal, Code2, User, ExternalLink, Linkedin, Trophy, Coins, ArrowLeft, Globe } from "lucide-react";
import { GithubGraph } from "./github-graph";
import { TopLanguages } from "./top-languages";
import Link from "next/link";
import { DevPulse } from "./dev-pulse";
import { processDevPulseData } from "../utils/pulse-utils";
import { useMemo } from "react";
import { XPProgressBar } from "./xp-progress-bar";
import { useHUDData } from "../hooks/use-hud-data";
import { TerminalFeed } from "./terminal-feed";

interface PublicProfileDetailsProps {
    profile: ProfileData & { avatar_url?: string };
    githubStats?: GithubStats;
    bountyStats?: BountyStatsType;
    contributionStats?: ContributionStats | null;
}

export function PublicProfileDetails({ profile, githubStats, bountyStats, contributionStats }: PublicProfileDetailsProps) {
    const { logs, metrics } = useHUDData(profile.id, contributionStats, bountyStats, profile);

    const pulseData = useMemo(() => processDevPulseData(githubStats?.contributionCalendar ? {
        totalContributions: githubStats.totalContributions,
        weeks: githubStats.contributionCalendar
    } : null), [githubStats]);

    const hasSocialLinks = profile.x_url || profile.linkedin_url || profile.website_url;

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-10 animate-in fade-in duration-500 selection:bg-[var(--neon-cyan)]/30">
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
                                <span className="text-[10px] font-mono text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 px-2 py-0.5 border border-[var(--neon-cyan)]/20 tracking-widest uppercase">
                                    ID: 0x{profile.id.slice(0, 8).toUpperCase()}
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-50">Authorized_User</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black font-mono tracking-tighter text-foreground uppercase italic leading-none">
                                {profile.full_name || profile.username}
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground font-mono font-light tracking-widest">
                                @{profile.username || "anonymous"}
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

                        {/* Social Signals */}
                        {hasSocialLinks && (
                            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                                {profile.x_url && (
                                    <a href={profile.x_url} target="_blank" rel="noopener noreferrer" className="p-2 border border-border/20 bg-muted/5 hover:border-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/10 text-muted-foreground hover:text-white transition-all group">
                                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                    </a>
                                )}
                                {profile.linkedin_url && (
                                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 border border-border/20 bg-muted/5 hover:border-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/10 text-muted-foreground hover:text-white transition-all group">
                                        <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                                {profile.website_url && (
                                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="p-2 border border-border/20 bg-muted/5 hover:border-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/10 text-muted-foreground hover:text-white transition-all group">
                                        <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* XP/Level HUD Module */}
                    <div className="w-full md:w-64 space-y-3 bg-transparent border border-border/20 p-5 backdrop-blur-md relative overflow-hidden group/hud">
                        <div className="absolute top-0 left-0 w-2 h-[1px] bg-[var(--neon-cyan)]" />
                        <div className="absolute top-0 left-0 w-[1px] h-2 bg-[var(--neon-cyan)]" />
                        <div className="flex justify-between items-end mb-1">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none">Protocol Grade</span>
                                <span className="text-[7px] font-mono text-[var(--neon-cyan)]/40 uppercase mt-1">Class: SR_DEV_V3</span>
                            </div>
                            <span className="text-[10px] font-mono text-[var(--neon-cyan)] font-black italic">LVL {(profile.level || 1).toString().padStart(2, '0')}</span>
                        </div>
                        <div className="h-4 w-full bg-background/50 border border-[var(--neon-cyan)]/20 rounded-none overflow-hidden p-0.5 relative">
                            <div
                                className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] relative shadow-[0_0_15px_rgba(var(--neon-cyan-rgb),0.4)] z-10 transition-all duration-1000"
                                style={{ width: `${Math.min(100, ((profile.xp || 0) % 100))}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center relative z-10">
                            <span className="text-[11px] font-mono font-black text-foreground">{profile.xp || 0} <span className="opacity-40 font-normal">XP</span></span>
                            <div className="flex gap-1 items-center">
                                <div className="w-1 h-1 bg-[var(--neon-cyan)] animate-pulse" />
                                <span className="text-[9px] font-mono text-muted-foreground uppercase opacity-40">Uplink Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid (9:3) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column (9) */}
                <div className="lg:col-span-9 space-y-10">
                    {/* Activity & Progress */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 bg-background/30 border border-[var(--neon-cyan)]/20 p-6 flex flex-col justify-center gap-6 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none" />
                            <XPProgressBar showDetails profile={profile} />
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
                            <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-foreground shrink-0">Dev Pulse Grid</span>
                            <div className="h-px w-full bg-border/10" />
                        </div>
                        {pulseData && <DevPulse data={pulseData} />}
                    </div>

                    {/* Bounty Success Board */}
                    {bountyStats && (bountyStats.totalWins > 0 || bountyStats.totalEarnings > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-background/20 border border-[var(--neon-cyan)]/20 p-6 flex items-center justify-between group hover:border-[var(--neon-cyan)]/50 transition-colors">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Contracts Archived</div>
                                    <div className="text-3xl font-black font-mono text-foreground uppercase italic tracking-tighter shadow-none">{bountyStats.totalWins.toString().padStart(2, '0')}</div>
                                </div>
                                <Trophy className="w-10 h-10 text-[var(--neon-cyan)] opacity-20 group-hover:opacity-100 transition-all duration-500 scale-125" />
                            </div>
                            <div className="bg-background/20 border border-[var(--neon-purple)]/20 p-6 flex items-center justify-between group hover:border-[var(--neon-purple)]/50 transition-colors">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Total Reward Payout</div>
                                    <div className="text-3xl font-black font-mono text-foreground uppercase italic tracking-tighter shadow-none">RM {bountyStats.totalEarnings}</div>
                                </div>
                                <Coins className="w-10 h-10 text-[var(--neon-purple)] opacity-20 group-hover:opacity-100 transition-all duration-500 scale-125" />
                            </div>
                        </div>
                    )}

                    {/* Bio / Lore Section */}
                    {profile.bio && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-foreground shrink-0">Identity Lore</span>
                                <div className="h-px w-full bg-border/10" />
                            </div>
                            <div className="bg-background/50 border-l-4 border-l-[var(--neon-purple)] p-6 font-mono text-sm text-foreground/70 italic leading-relaxed backdrop-blur-sm">
                                "{profile.bio || "ACCESS_DENIED: User lore not found in sector database."}"
                            </div>
                        </div>
                    )}

                    {/* Contribution History */}
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
                </div>

                {/* Right Column (3) */}
                <div className="lg:col-span-3 space-y-10">
                    {/* Activity Feed / Terminal */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--neon-cyan)] font-bold uppercase tracking-widest">
                            <Terminal className="w-3 h-3" />
                            <span>Recent Logs</span>
                        </div>
                        <div className="bg-background/80 border border-[var(--neon-purple)]/20 p-0 h-[450px] overflow-hidden relative group/term">
                            <div className="absolute inset-0 bg-scanline pointer-events-none opacity-5 z-20" />
                            <TerminalFeed logs={logs} />
                        </div>
                    </div>

                    {/* Tech Arsenal */}
                    {profile.stack && profile.stack.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--neon-purple)] font-bold uppercase tracking-widest">
                                <Code2 className="w-3 h-3" />
                                <span>Tech Arsenal</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profile.stack.map((tech) => (
                                    <div
                                        key={tech}
                                        className="px-2 py-1 bg-background/30 border border-border/20 text-foreground/70 font-mono text-[10px] uppercase tracking-wider hover:border-[var(--neon-cyan)]/50 hover:text-[var(--neon-cyan)] transition-colors cursor-default"
                                    >
                                        {tech}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Global Stats */}
                    <div className="bg-[var(--neon-cyan)]/[0.02] border border-border/10 p-6 space-y-4">
                        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">// System Summary</div>
                        <div className="space-y-4">
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
