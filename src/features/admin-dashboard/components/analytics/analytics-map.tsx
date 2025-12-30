"use client";

import React, { useMemo, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { MAP_PATHS } from '@/features/landingpage/components/map-paths';

interface AnalyticsMapProps {
    data: { name: string; value: number }[];
}

// Map standard state names to what the data might have
const STATE_NAMES = [
    "Perlis", "Kedah", "Pulau Pinang", "Perak", "Terengganu", "Pahang",
    "Kelantan", "Negeri Sembilan", "Melaka", "Selangor", "Wilayah Persekutuan Putrajaya",
    "Wilayah Persekutuan Kuala Lumpur", "Johor", "Sabah", "Wilayah Persekutuan Labuan", "Sarawak"
];

export function AnalyticsMap({ data }: AnalyticsMapProps) {
    const [tooltipContent, setTooltipContent] = useState<string | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [hoveredStateIndex, setHoveredStateIndex] = useState<number | null>(null);

    const maxVal = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);

    const getStateValue = (index: number) => {
        const stateName = STATE_NAMES[index];
        if (!stateName) return 0;

        // Match broad or specific
        const found = data.find((s) =>
            s.name.toLowerCase().includes(stateName.toLowerCase()) ||
            stateName.toLowerCase().includes(s.name.toLowerCase())
        );
        return found?.value || 0;
    };

    return (
        <div className="w-full h-[300px] md:h-[400px] border-2 border-border rounded-lg bg-card/40 backdrop-blur-sm p-4 flex flex-col relative overflow-hidden hover:border-border/80 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2 md:mb-4 text-left text-foreground">User Distribution (Malaysia)</h3>

            {/* Tooltip */}
            {tooltipContent && (
                <div
                    className="absolute z-20 pointer-events-none bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-md text-sm border border-border"
                    style={{
                        left: tooltipPos.x + 10,
                        top: tooltipPos.y + 10
                    }}
                >
                    {tooltipContent}
                </div>
            )}

            <div
                className="w-full h-full flex items-center justify-center relative z-10"
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipPos({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                    });
                }}
            >
                <svg
                    viewBox="0 0 940 400"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full max-h-[350px]"
                >
                    {MAP_PATHS.map((pathData, index) => {
                        const val = getStateValue(index);
                        const isActive = val > 0;
                        const isHovered = hoveredStateIndex === index;
                        const stateName = STATE_NAMES[index] || "Unknown";
                        const percentage = Math.min((val / maxVal) * 100, 100);

                        // Use CSS color-mix for theme-aware gradients!
                        // Base: muted (inactive) -> Target: neon-primary (active)
                        const fillStyle = isActive
                            ? { fill: `color-mix(in srgb, var(--muted), var(--neon-primary) ${percentage}%)` }
                            : { fill: 'var(--muted)' };

                        return (
                            <path
                                key={index}
                                d={pathData}
                                style={fillStyle}
                                stroke={isHovered ? "var(--neon-cyan)" : "var(--border)"}
                                strokeWidth={isHovered ? "2" : "1"}
                                className={`transition-all duration-200 cursor-pointer ${isHovered && !isActive ? 'hover:fill-muted-foreground/50' : ''} ${isHovered && isActive ? 'brightness-110' : ''}`}
                                onMouseEnter={() => {
                                    setHoveredStateIndex(index);
                                    setTooltipContent(`${stateName}: ${val} Users`);
                                }}
                                onMouseLeave={() => {
                                    setHoveredStateIndex(null);
                                    setTooltipContent(null);
                                }}
                            />
                        );
                    })}
                </svg>
            </div>

            {/* Legend/Info */}
            <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2 text-[10px] md:text-xs text-muted-foreground p-1 md:p-2 bg-background/80 rounded border z-20">
                <div className="flex items-center">
                    <span className="w-2 h-2 md:w-3 md:h-3 bg-neon-primary rounded-full inline-block mr-1"></span>
                    <span>Active</span>
                </div>
                <div className="flex items-center ml-2">
                    <span className="w-2 h-2 md:w-3 md:h-3 bg-muted rounded-full inline-block mr-1 border border-border"></span>
                    <span>No Users</span>
                </div>
            </div>
        </div>
    );
}
