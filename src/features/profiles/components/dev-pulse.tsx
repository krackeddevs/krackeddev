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
    const [signalId, setSignalId] = useState("");

    useEffect(() => {
        setSignalId(Math.random().toString(16).slice(2, 10).toUpperCase());
    }, []);

    // Shared Motion Value for synchronization
    const progress = useMotionValue(0);

    // Map 0-1 progress to 0%-100% for offsetDistance
    const offsetDistance = useTransform(progress, (v) => `${v * 100}%`);

    // Run the animation loop
    useEffect(() => {
        // Reset progress to 0 when timeframe changes to avoid jumps
        progress.set(0);

        const durationMap = {
            daily: 8,
            monthly: 16,
            yearly: 24
        };

        const controls = animate(progress, 1, {
            duration: durationMap[timeframe],
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 0
        });
        return () => controls.stop();
    }, [progress, timeframe]);

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
        const height = 150; // Slightly shorter for HUD feel
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
        <div className={cn("w-full bg-card/40 border border-[var(--neon-cyan)]/20 rounded-none overflow-hidden backdrop-blur-md shadow-[0_0_20px_rgba(var(--neon-cyan-rgb),0.05)] flex flex-col min-h-[350px] relative group", className)}>
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--neon-cyan)]/30 z-30" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--neon-cyan)]/30 z-30" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--neon-cyan)]/30 z-30" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--neon-cyan)]/30 z-30" />

            {/* Header / Telemetry Row */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--neon-cyan)]/10 gap-3 shrink-0 bg-[var(--neon-cyan)]/5">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Activity className="w-5 h-5 text-[var(--neon-cyan)] animate-pulse" />
                        <div className="absolute inset-0 bg-[var(--neon-cyan)] blur-sm opacity-50 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-[11px] font-black text-[var(--neon-cyan)] tracking-[0.2em] uppercase font-mono">
                            Neural Dev Pulse
                        </h2>
                        <div className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest leading-none mt-1">
                            Status: <span className="text-[var(--neon-lime)]">Syncing_</span>
                        </div>
                    </div>
                </div>

                <div className="flex bg-card/40 border border-[var(--neon-cyan)]/20 p-0.5 rounded-none scale-90 origin-right shadow-inner">
                    {(["daily", "monthly", "yearly"] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={cn(
                                "px-3 py-1.5 transition-all duration-300 text-[9px] font-mono uppercase tracking-widest",
                                timeframe === t
                                    ? "bg-[var(--neon-cyan)] text-primary-foreground font-black shadow-[0_0_10px_var(--neon-cyan)]"
                                    : "text-muted-foreground hover:text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10"
                            )}
                        >
                            {t === 'daily' ? 'Live' : t === 'monthly' ? 'Burst' : 'History'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="relative flex-grow flex flex-col overflow-hidden">
                {/* HUD Grid Overlays */}
                <div className="absolute inset-0 pointer-events-none z-0 opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(to right, var(--neon-cyan) 1px, transparent 1px), linear-gradient(to bottom, var(--neon-cyan) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px"
                    }}
                />

                {/* Horizontal Scanline */}
                <div className="absolute inset-x-0 h-[1px] bg-[var(--neon-cyan)]/20 z-10 animate-scanline pointer-events-none" />

                {/* Telemetry Labels */}
                <div className="absolute top-4 left-4 z-20 font-mono text-[7px] text-[var(--neon-cyan)]/40 uppercase space-y-1 select-none hidden sm:block">
                    <div>Sector: PHANTOM_01</div>
                    <div>Kernel: v4.2.0-STABLE</div>
                    <div>Latency: 14ms</div>
                </div>

                <div className="absolute top-4 right-4 z-20 font-mono text-[7px] text-[var(--neon-cyan)]/40 uppercase text-right space-y-1 select-none hidden sm:block">
                    <div>Signal_ID: {signalId || "INITIALIZING..."}</div>
                    <div>Buffer: 0xCF42</div>
                    <div>Uptime: 99.98%</div>
                </div>

                <div className="relative w-full h-[200px] mt-8 flex items-center justify-center z-10 px-8">
                    <div className="relative w-full h-full flex items-center overflow-visible">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 150" preserveAspectRatio="none">
                            <line x1="0" y1="75" x2="1000" y2="75" stroke="var(--neon-cyan)" strokeWidth="0.5" strokeDasharray="10 10" className="opacity-20" />

                            <defs>
                                <linearGradient id="liveGradientHUD" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0" />
                                    <stop offset="50%" stopColor="var(--neon-cyan)" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="var(--neon-cyan)" stopOpacity="1" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Background Trace (Shadow) */}
                            <path
                                d={pathD}
                                stroke="var(--neon-cyan)"
                                strokeOpacity="0.05"
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transition-all duration-500"
                            />

                            {/* Static Trace base */}
                            <path
                                d={pathD}
                                stroke="var(--neon-cyan)"
                                strokeOpacity="0.15"
                                strokeWidth="1"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transition-all duration-500"
                            />

                            {/* Animated Trace (Driven by shared MotionValue) */}
                            <motion.path
                                d={pathD}
                                stroke="url(#liveGradientHUD)"
                                strokeWidth="2.5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                filter="url(#glow)"
                                style={{
                                    pathLength: progress,
                                }}
                            />

                            {/* Scanning Dot */}
                            <motion.circle
                                key={timeframe}
                                r="3.5"
                                fill="white"
                                style={{
                                    offsetPath: `path("${pathD}")`,
                                    "--offset-distance": offsetDistance,
                                    offsetDistance: "var(--offset-distance)",
                                    filter: "drop-shadow(0 0 8px var(--neon-cyan))"
                                } as any}
                            />
                        </svg>

                        <div className="absolute inset-0 pointer-events-none" />
                    </div>
                </div>

                {/* Bottom Activity Bar */}
                <div className="mt-auto px-4 py-3 bg-[var(--neon-cyan)]/5 border-t border-[var(--neon-cyan)]/10 flex items-center justify-between z-20">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[7px] font-mono text-muted-foreground uppercase opacity-50 tracking-tighter">Total Sequence</span>
                            <span className="text-xs font-black font-mono text-[var(--neon-cyan)] tracking-tighter shadow-none">
                                {cyclesInView.toString().padStart(5, '0')} <span className="text-[8px] opacity-50">CYCLES</span>
                            </span>
                        </div>
                        <div className="h-6 w-[1px] bg-[var(--neon-cyan)]/20" />
                        <div className="flex flex-col">
                            <span className="text-[7px] font-mono text-muted-foreground uppercase opacity-50 tracking-tighter">Peak Intensity</span>
                            <span className="text-xs font-black font-mono text-[var(--neon-lime)] tracking-tighter">
                                {maxCount.toString().padStart(2, '0')} <span className="text-[8px] opacity-50">PULSE/S</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-1 items-center">
                        <div className="w-1.5 h-1.5 bg-[var(--neon-cyan)] animate-pulse shadow-[0_0_5px_var(--neon-cyan)]" />
                        <span className="text-[9px] font-mono text-[var(--neon-cyan)] uppercase tracking-[0.2em] animate-pulse">Live Signal Stream</span>
                    </div>
                </div>

                {/* Animation Styles */}
                <style jsx>{`
                    @keyframes scanline {
                        0% { transform: translateY(-100%); opacity: 0; }
                        50% { opacity: 1; }
                        100% { transform: translateY(350px); opacity: 0; }
                    }
                    .animate-scanline {
                        animation: scanline 4s linear infinite;
                    }
                `}</style>
            </div>
        </div>
    );
}
