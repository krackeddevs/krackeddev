"use client";

import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";
import { DevPulseData } from "../types";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface DevPulseProps {
    data: DevPulseData;
    className?: string;
}

type Timeframe = "daily" | "monthly" | "yearly";

export function DevPulse({ data, className }: DevPulseProps) {
    const [timeframe, setTimeframe] = useState<Timeframe>("daily");

    // Shared Motion Value for synchronization
    const progress = useMotionValue(0);

    // Map 0-1 progress to 0%-100% for offsetDistance
    const offsetDistance = useTransform(progress, (v) => `${v * 100}%`);

    // Run the animation loop
    useEffect(() => {
        const controls = animate(progress, 1, {
            duration: 8,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 0
        });
        return controls.stop;
    }, [progress]);

    const currentData = useMemo(() => {
        switch (timeframe) {
            case "daily": return data.weekly;
            case "monthly": return data.monthly;
            case "yearly": return data.yearly;
        }
    }, [data, timeframe]);

    const maxCount = Math.max(...currentData.map(d => d.count), 1);
    const cyclesInView = currentData.reduce((acc, curr) => acc + curr.count, 0);

    const pathD = useMemo(() => {
        const width = 1000;
        const height = 200;
        if (currentData.length === 0) return `M 0 ${height / 2} L ${width} ${height / 2}`;

        const segmentWidth = width / currentData.length;
        const baseline = height / 2;
        let path = `M 0 ${baseline}`;

        currentData.forEach((item, index) => {
            const x = index * segmentWidth;
            const intensity = item.count / maxCount;
            // Slightly exaggerated spikes for "Active" look even with low data
            const spikeHeight = intensity > 0 ? (intensity * (height * 0.45)) + 10 : 0;

            if (spikeHeight > 0) {
                path += ` L ${x + segmentWidth * 0.2} ${baseline}`;
                path += ` L ${x + segmentWidth * 0.4} ${baseline - spikeHeight}`;
                path += ` L ${x + segmentWidth * 0.6} ${baseline + (spikeHeight * 0.5)}`;
                path += ` L ${x + segmentWidth * 0.8} ${baseline}`;
            } else {
                path += ` L ${x + segmentWidth} ${baseline}`;
            }
        });

        path += ` L ${width} ${baseline}`;
        return path;
    }, [currentData, maxCount]);

    return (
        <div className={cn("w-full bg-card/40 border border-border rounded-xl overflow-hidden backdrop-blur-md shadow-sm flex flex-col min-h-[300px]", className)}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-border/50 gap-3 shrink-0">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-neon-primary" />
                    <h2 className="text-sm font-bold text-foreground tracking-tight uppercase">Activity Trends</h2>
                </div>

                <div className="flex bg-muted/50 p-0.5 rounded-lg scale-90 origin-right">
                    {(["daily", "monthly", "yearly"] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={cn(
                                "px-2 py-1 rounded transition-colors text-[10px] font-mono uppercase",
                                timeframe === t ? "bg-neon-primary text-black font-bold" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {t === 'daily' ? '7D' : t === 'monthly' ? '30D' : '1Y'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="relative flex-grow flex flex-col bg-muted/10 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: "var(--grid-background)", backgroundSize: "20px 20px" }} />

                <div className="relative w-full h-full p-4 flex items-center justify-center z-10">
                    <div className="relative w-full h-full flex items-center overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                            <line x1="0" y1="100" x2="1000" y2="100" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" className="opacity-30" />

                            <defs>
                                <linearGradient id="liveGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="var(--neon-primary)" stopOpacity="0" />
                                    <stop offset="20%" stopColor="var(--neon-primary)" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="var(--neon-primary)" stopOpacity="1" />
                                </linearGradient>
                            </defs>

                            {/* Background Trace */}
                            <path
                                d={pathD}
                                stroke="var(--neon-primary)"
                                strokeOpacity="0.1"
                                strokeWidth="1"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Animated Trace (Driven by shared MotionValue) */}
                            <motion.path
                                d={pathD}
                                stroke="url(#liveGradient)"
                                strokeWidth="3"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                    pathLength: progress, // Syncs with progress 0-1
                                    filter: "drop-shadow(0 0 4px var(--neon-primary))"
                                }}
                            />

                            {/* Scanning Dot (Driven by shared MotionValue transformed to %) */}
                            <motion.circle
                                key={timeframe} // Force remount when path changes to ensure offset-path updates correctly
                                r="4"
                                fill="white"
                                style={{
                                    offsetPath: `path("${pathD}")`,
                                    // Use CSS variable to avoid React unknown prop warning for offsetDistance
                                    "--offset-distance": offsetDistance,
                                    offsetDistance: "var(--offset-distance)",
                                    filter: "drop-shadow(0 0 8px var(--neon-primary))"
                                } as any}
                            />
                        </svg>

                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
                    </div>
                </div>

                <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none z-20">
                    <p className="text-[10px] text-muted-foreground font-mono bg-card/40 inline-block px-2 rounded backdrop-blur-sm border border-border/50">
                        {cyclesInView} TOTAL CONTRIBUTIONS • LIVE SIGNAL
                    </p>
                </div>
            </div>
        </div>
    );
}
