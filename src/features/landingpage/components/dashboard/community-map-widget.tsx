"use client";

import { useState, useMemo } from "react";
import { MAP_PATHS } from "../map-paths";
import { useCommunityLocations, useLandingStats, LocationData } from "@/lib/hooks/use-landing-data";
import { scaleLinear } from "d3-scale";
import { Globe } from "lucide-react";

const STATE_ALIASES: Record<string, string[]> = {
    "Melaka": ["Malacca"],
    "Pulau Pinang": ["Penang"],
    "Wilayah Persekutuan Kuala Lumpur": ["Kuala Lumpur", "KL"],
    "Wilayah Persekutuan Putrajaya": ["Putrajaya"],
    "Wilayah Persekutuan Labuan": ["Labuan"],
};

const STATE_NAMES = [
    "Perlis", "Kedah", "Pulau Pinang", "Perak", "Terengganu",
    "Pahang", "Kelantan", "Negeri Sembilan", "Melaka", "Selangor",
    "Wilayah Persekutuan Putrajaya", "Wilayah Persekutuan Kuala Lumpur",
    "Johor", "Sabah", "Wilayah Persekutuan Labuan", "Sarawak"
];

interface MapWidgetProps {
    initialLocations?: LocationData[];
}

export function CommunityMapWidget({ initialLocations }: MapWidgetProps) {
    const { data: locationData = [] } = useCommunityLocations(initialLocations);
    const { data: statsData } = useLandingStats();
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const stats = {
        activeAgents: statsData?.travelers || 0,
        payoutVolume: statsData?.payoutVolume || 0,
        activeBounties: statsData?.activeBounties || 0,
    };

    const getStateValue = (index: number) => {
        const stateName = STATE_NAMES[index];
        if (!stateName) return 0;
        const lowerStateName = stateName.toLowerCase();
        const aliases = (STATE_ALIASES[stateName] || []).map(a => a.toLowerCase());

        const found = locationData.find((s) => {
            const lowerName = s.name.toLowerCase();
            return (
                lowerName === lowerStateName ||
                lowerName.includes(lowerStateName) ||
                lowerStateName.includes(lowerName) ||
                aliases.some(alias => lowerName === alias || lowerName.includes(alias))
            );
        });
        return found?.value || 0;
    };

    const maxUsers = useMemo(() => {
        return Math.max(...locationData.map((d) => d.value), 1);
    }, [locationData]);

    const opacityScale = useMemo(() => {
        return scaleLinear<number>()
            .domain([0, maxUsers])
            .range([0.2, 1]);
    }, [maxUsers]);

    return (
        <div
            className="bg-[#F9F9F9] dark:bg-card/40 border border-border/30 rounded-sm p-6 relative overflow-hidden group h-full flex flex-col min-h-[500px] backdrop-blur-sm"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
        >
            {/* Tooltip Overlay */}
            {hoveredIdx !== null && (() => {
                const userCount = getStateValue(hoveredIdx);
                const stateName = STATE_NAMES[hoveredIdx];

                return (
                    <div
                        className="absolute z-50 pointer-events-none bg-background border border-[var(--neon-primary)] px-3 py-2 font-mono text-[10px] text-foreground rounded-sm shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-md"
                        style={{ left: tooltipPos.x + 15, top: tooltipPos.y + 15 }}
                    >
                        <div className="text-[var(--neon-primary)] font-bold uppercase tracking-wider mb-0.5">
                            {stateName}
                        </div>
                        <div className="flex items-center gap-2">
                            {userCount > 0 ? (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-primary)] animate-pulse" />
                                    <span className="text-foreground/80">{userCount} OPERATIVE{userCount !== 1 ? 'S' : ''}</span>
                                </>
                            ) : (
                                <span className="text-foreground/50 text-[9px]">No operatives yet</span>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* Header Overlay */}
            <div className="z-10 flex justify-between items-start w-full">
                <div>
                    <div className="flex items-center gap-2 mb-1 text-[var(--neon-primary)]">
                        <Globe className="w-5 h-5" />
                        <h2 className="text-xl font-mono font-bold uppercase tracking-tighter">OUR COMMUNITY</h2>
                    </div>
                    <p className="text-[10px] font-mono text-foreground/70 flex items-center gap-2 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-primary)] animate-pulse" />
                        {stats.activeAgents} OPERATIVES ENGAGED
                    </p>
                </div>
            </div>

            {/* Map SVG Container */}
            <div className="relative flex-grow w-full flex items-center justify-center -mt-8">
                <svg
                    viewBox="0 0 940 400"
                    className="w-full h-auto max-h-[380px]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {MAP_PATHS.map((path, index) => {
                        const val = getStateValue(index);
                        const isActive = val > 0;
                        const isHovered = hoveredIdx === index;

                        // Landmass Style
                        let baseFill = isActive ? "var(--neon-primary)" : "var(--map-landmass)";
                        let opacity = isActive ? opacityScale(val) : 0.4;
                        let filter = "none";

                        // Hover overrides
                        if (isHovered) {
                            if (isActive) {
                                // Active state hover: Maintain bright neon
                                opacity = 1;
                                filter = "drop-shadow(0 0 8px var(--neon-primary))";
                            } else {
                                // Inactive state hover: Light up slightly
                                baseFill = "var(--muted-foreground)";
                                opacity = 0.5;
                                filter = "drop-shadow(0 0 5px var(--muted-foreground))";
                            }
                        }

                        return (
                            <path
                                key={index}
                                d={path}
                                fill={baseFill}
                                fillOpacity={opacity}
                                stroke="var(--map-border, var(--border))"
                                strokeOpacity={isHovered ? 1 : 0.5}
                                strokeWidth={isHovered ? "1.2" : "0.5"}
                                onMouseEnter={() => setHoveredIdx(index)}
                                onMouseLeave={() => setHoveredIdx(null)}
                                className="transition-all duration-300 cursor-pointer"
                                style={{ filter }}
                            />
                        );
                    })}
                </svg>

                {/* Floating Stats Block - Figma Style */}
                <div className="absolute right-0 bottom-4 space-y-1.5 md:space-y-4">
                    {[
                        { label: "Active Agents", value: stats.activeAgents, color: "text-foreground" },
                        { label: "Payouts", value: `RM${stats.payoutVolume.toLocaleString()}`, color: "text-[var(--rank-gold,#fbbf24)]" },
                        { label: "Missions", value: stats.activeBounties, color: "text-red-500" }
                    ].map((item, i) => (
                        <div key={i} className="bg-background/80 border border-border/20 p-1.5 md:p-4 rounded-sm min-w-[70px] md:min-w-[140px] text-right backdrop-blur-sm shadow-xl">
                            <div className="text-[7px] md:text-[9px] font-mono text-foreground/50 uppercase mb-0 md:mb-1 tracking-widest">{item.label}</div>
                            <div className={`text-[10px] md:text-xl font-mono font-bold leading-none ${item.color}`}>
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
