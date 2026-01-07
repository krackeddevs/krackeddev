"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardTable } from "./leaderboard-table";
import { TopHuntersList } from "./top-hunters-list";
import { ActiveContributorsTable } from "./active-contributors-table";
import { LeaderboardEntry, TopHunter, ActiveContributor } from "../types";
import { Clock, Calendar, Trophy, Activity, Loader2 } from "lucide-react";

interface LeaderboardTabsProps {
    initialAllTimeData: LeaderboardEntry[];
    currentUserId?: string;
}

// Client-side fetch functions for progressive loading
const fetchWeeklyData = async (): Promise<{ data: LeaderboardEntry[] }> => {
    const response = await fetch('/api/leaderboard?timeframe=week&limit=30');
    if (!response.ok) throw new Error('Failed to fetch weekly data');
    return response.json();
};

const fetchTopHuntersData = async (): Promise<{ data: TopHunter[] }> => {
    const response = await fetch('/api/leaderboard/top-hunters?limit=30');
    if (!response.ok) throw new Error('Failed to fetch top hunters');
    return response.json();
};

const fetchActiveContributorsData = async (): Promise<{ data: ActiveContributor[] }> => {
    const response = await fetch('/api/leaderboard/active-contributors?limit=30');
    if (!response.ok) throw new Error('Failed to fetch active contributors');
    return response.json();
};

export function LeaderboardTabs({ initialAllTimeData, currentUserId }: LeaderboardTabsProps) {
    const [activeTab, setActiveTab] = useState("all-time");

    // Progressive loading: Only fetch data when tab is activated
    const { data: weeklyData, isLoading: weeklyLoading } = useQuery({
        queryKey: ['leaderboard', 'week'],
        queryFn: fetchWeeklyData,
        enabled: activeTab === 'week',
        staleTime: 1000 * 60 * 15, // 15 minutes
    });

    const { data: topHuntersData, isLoading: huntersLoading } = useQuery({
        queryKey: ['top-hunters'],
        queryFn: fetchTopHuntersData,
        enabled: activeTab === 'bounties',
        staleTime: 1000 * 30, // 30 seconds
    });

    const { data: activeContributorsData, isLoading: contributorsLoading } = useQuery({
        queryKey: ['active-contributors'],
        queryFn: fetchActiveContributorsData,
        enabled: activeTab === 'active',
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-neon-primary" />
            <span className="ml-3 text-muted-foreground">Loading rankings...</span>
        </div>
    );

    return (
        <Tabs defaultValue="all-time" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-16">
                <TabsList className="grid w-full max-w-3xl grid-cols-4 h-12 bg-card/40 border border-border/50 p-1 rounded-none backdrop-blur-md">
                    {[
                        { value: "all-time", label: "Global", icon: Clock },
                        { value: "week", label: "Weekly", icon: Calendar },
                        { value: "active", label: "Active", icon: Activity },
                        { value: "bounties", label: "Hunters", icon: Trophy },
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="rounded-none text-[10px] font-bold font-mono uppercase tracking-[0.2em] data-[state=active]:bg-[var(--neon-primary)] data-[state=active]:text-background transition-all"
                        >
                            <tab.icon className="w-3.5 h-3.5 mr-2 hidden sm:inline" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            <TabsContent value="all-time" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 outline-none">
                <div className="mb-8 border-l-2 border-[var(--neon-primary)] pl-4">
                    <h2 className="text-xl font-black font-mono text-foreground uppercase tracking-tight">LEGENDS OF THE STACK</h2>
                    <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mt-0.5">TOP OPERATIVES RANKED BY TOTAL LIFETIME XP.</p>
                </div>
                <LeaderboardTable data={initialAllTimeData} currentUserId={currentUserId} showSkills />
            </TabsContent>

            <TabsContent value="week" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 outline-none">
                <div className="mb-8 border-l-2 border-[var(--neon-primary)] pl-4">
                    <h2 className="text-xl font-black font-mono text-foreground uppercase tracking-tight">RISING SIGNATURES</h2>
                    <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mt-0.5">MOST ACTIVE INTELLIGENCE EARNERS OVER THE LAST 7 DAYS.</p>
                </div>
                {weeklyLoading ? (
                    <LoadingSpinner />
                ) : (
                    <LeaderboardTable data={weeklyData?.data || []} currentUserId={currentUserId} />
                )}
            </TabsContent>

            <TabsContent value="active" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 outline-none">
                <div className="mb-8 border-l-2 border-[var(--neon-primary)] pl-4">
                    <h2 className="text-xl font-black font-mono text-foreground uppercase tracking-tight">ACTIVE OPERATIVES</h2>
                    <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mt-0.5">PEAK ACTIVITY DETECTED IN LAST 30 DAYS (GITHUB + COMMUNITY).</p>
                </div>
                {contributorsLoading ? (
                    <LoadingSpinner />
                ) : (
                    <ActiveContributorsTable data={activeContributorsData?.data || []} currentUserId={currentUserId} />
                )}
            </TabsContent>

            <TabsContent value="bounties" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 outline-none">
                <div className="mb-8 border-l-2 border-[var(--neon-primary)] pl-4">
                    <h2 className="text-xl font-black font-mono text-foreground uppercase tracking-tight">ELITE HUNTERS</h2>
                    <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mt-0.5">TOP SUCCESS RATE FOR BOUNTY TARGETS AND SYSTEM REWARDS.</p>
                </div>
                {huntersLoading ? (
                    <LoadingSpinner />
                ) : (
                    <TopHuntersList hunters={topHuntersData?.data || []} />
                )}
            </TabsContent>
        </Tabs>
    );
}
