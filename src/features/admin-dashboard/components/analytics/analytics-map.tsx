"use client";

import React, { useState, useCallback } from 'react';
import { Map, MapControls } from "@/components/ui/map";
import { MalaysiaMapLayers } from "@/components/maps/malaysia-map-layers";

interface AnalyticsMapProps {
    data: { name: string; value: number }[];
}

export function AnalyticsMap({ data }: AnalyticsMapProps) {
    const [tooltipInfo, setTooltipInfo] = useState<{ name: string, value: number, x: number, y: number } | null>(null);

    const handleHover = useCallback((stateName: string | null, value: number, x: number, y: number) => {
        if (stateName) {
            setTooltipInfo({ name: stateName, value, x, y });
        } else {
            setTooltipInfo(null);
        }
    }, []);

    return (
        <div className="w-full h-[300px] md:h-[400px] border-2 border-border rounded-lg bg-card/40 backdrop-blur-sm p-4 flex flex-col relative overflow-hidden hover:border-border/80 transition-all duration-300">
            <div className="flex justify-between items-center mb-2 md:mb-4">
                <h3 className="text-lg font-semibold text-foreground">User Distribution (Malaysia)</h3>
            </div>

            <div className="w-full h-full relative z-10 rounded overflow-hidden">
                <Map
                    initialViewState={{
                        longitude: 109.5,
                        latitude: 4.0,
                        zoom: 4.5,
                    }}
                    scrollZoom={false}
                    attributionControl={false}
                >
                    <MalaysiaMapLayers data={data} onHover={handleHover} />

                    <MapControls position="bottom-right" />

                    {/* Custom Tooltip Overlay - reused style */}
                    {tooltipInfo && (
                        <div
                            className="absolute z-50 pointer-events-none bg-popover/90 text-neon-primary px-3 py-2 font-mono text-sm border border-border rounded shadow-md"
                            style={{
                                left: tooltipInfo.x + 10,
                                top: tooltipInfo.y + 10,
                                transform: 'translate(0, 0)'
                            }}
                        >
                            <span className="font-bold text-popover-foreground">{tooltipInfo.name}</span>
                            <br />
                            {tooltipInfo.value} Users
                        </div>
                    )}
                </Map>
            </div>

            {/* Legend/Info */}
            <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2 text-[10px] md:text-xs text-muted-foreground p-1 md:p-2 bg-background/80 rounded border z-20 backdrop-blur-sm">
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
