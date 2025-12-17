"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Coins } from "lucide-react";
import { BountyStats as BountyStatsType } from "../types";
import { cn } from "@/lib/utils";

interface BountyStatsProps {
    stats: BountyStatsType;
    className?: string;
}

export function BountyStats({ stats, className }: BountyStatsProps) {
    // Format currency to MYR (or generic currency)
    const formattedEarnings = new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
        maximumFractionDigits: 0,
    }).format(stats.totalEarnings);

    return (
        <div className={cn("grid grid-cols-2 gap-4", className)}>
            {/* Wins Card */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-neon-primary/50 transition-colors duration-300">
                <div className="absolute inset-0 bg-neon-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="p-3 rounded-full bg-neon-primary/10 text-neon-primary mb-1 group-hover:scale-110 transition-transform duration-300">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                            Verif. Wins
                        </p>
                        <h3 className="text-3xl font-bold font-mono text-white tracking-tighter">
                            {stats.totalWins}
                        </h3>
                    </div>
                </CardContent>
            </Card>

            {/* Earnings Card */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-neon-yellow/50 transition-colors duration-300">
                <div className="absolute inset-0 bg-neon-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="p-3 rounded-full bg-neon-yellow/10 text-neon-yellow mb-1 group-hover:scale-110 transition-transform duration-300">
                        <Coins className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                            Total Earnings
                        </p>
                        <h3 className="text-2xl font-bold font-mono text-white tracking-tighter">
                            {formattedEarnings}
                        </h3>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
