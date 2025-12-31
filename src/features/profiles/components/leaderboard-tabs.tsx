"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardTable } from "./leaderboard-table";
import { TopHuntersList } from "./top-hunters-list";
import { LeaderboardEntry, TopHunter } from "../types";
import { Clock, Calendar, Trophy } from "lucide-react";

interface LeaderboardTabsProps {
    allTimeData: LeaderboardEntry[];
    weeklyData: LeaderboardEntry[];
    topHunters: TopHunter[];
    currentUserId?: string;
}

export function LeaderboardTabs({ allTimeData, weeklyData, topHunters, currentUserId }: LeaderboardTabsProps) {
    const [activeTab, setActiveTab] = useState("all-time");

    return (
        <Tabs defaultValue="all-time" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-lg grid-cols-3 h-12 bg-muted/30 border border-border/50 p-1 rounded-full backdrop-blur-sm">
                    <TabsTrigger
                        value="all-time"
                        className="rounded-full text-xs sm:text-sm font-medium data-[state=active]:bg-neon-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-black transition-all"
                    >
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        All Time
                    </TabsTrigger>
                    <TabsTrigger
                        value="week"
                        className="rounded-full text-xs sm:text-sm font-medium data-[state=active]:bg-neon-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-black transition-all"
                    >
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        This Week
                    </TabsTrigger>
                    <TabsTrigger
                        value="bounties"
                        className="rounded-full text-xs sm:text-sm font-medium data-[state=active]:bg-neon-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-black transition-all"
                    >
                        <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Bounties
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="all-time" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                <div className="mb-4 text-center">
                    <h2 className="text-2xl font-bold font-mono neon-text mb-2">Legends of Code</h2>
                    <p className="text-muted-foreground">Top developers ranked by total lifetime XP.</p>
                </div>
                <LeaderboardTable data={allTimeData} currentUserId={currentUserId} showSkills />
            </TabsContent>

            <TabsContent value="week" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                <div className="mb-4 text-center">
                    <h2 className="text-2xl font-bold font-mono neon-text mb-2">Weekly Rising Stars</h2>
                    <p className="text-muted-foreground">Top XP earners over the last 7 days.</p>
                </div>
                <LeaderboardTable data={weeklyData} currentUserId={currentUserId} />
            </TabsContent>

            <TabsContent value="bounties" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                <div className="mb-4 text-center">
                    <h2 className="text-2xl font-bold font-mono neon-text mb-2">Top Bounty Hunters</h2>
                    <p className="text-muted-foreground">Most successful hunters by wins and earnings.</p>
                </div>
                <TopHuntersList hunters={topHunters} />
            </TabsContent>
        </Tabs>
    );
}
