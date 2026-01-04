"use client";

import { useState, useCallback } from "react";
import { Map, MapControls } from "@/components/ui/map";
import { MalaysiaMapLayers } from "@/components/maps/malaysia-map-layers";

export function CommunityMapClient({ data }: { data: { name: string; value: number }[] }) {
    const [tooltipInfo, setTooltipInfo] = useState<{ name: string, value: number, x: number, y: number } | null>(null);

    const handleHover = useCallback((stateName: string | null, value: number, x: number, y: number) => {
        if (stateName) {
            setTooltipInfo({ name: stateName, value, x, y });
        } else {
            setTooltipInfo(null);
        }
    }, []);

    return (
        <div className="relative w-full h-[300px] md:h-[500px] bg-card border border-border overflow-hidden rounded-lg z-20">
            <Map
                center={[109.5, 4.0]}
                zoom={4.5}
                scrollZoom={false}
                attributionControl={false}
            >
                <MalaysiaMapLayers data={data} onHover={handleHover} />
                <MapControls position="bottom-right" />

                {/* Custom Tooltip Overlay */}
                {tooltipInfo && (
                    <div
                        className="absolute z-50 pointer-events-none bg-popover/90 text-neon-primary px-3 py-2 font-mono text-sm border border-neon-primary/50 rounded shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                        style={{
                            left: tooltipInfo.x + 10,
                            top: tooltipInfo.y + 10,
                            transform: 'translate(0, 0)'
                        }}
                    >
                        <span className="font-bold text-popover-foreground">{tooltipInfo.name}</span>
                        <br />
                        {tooltipInfo.value} devs
                    </div>
                )}
            </Map>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-4 text-xs font-mono text-muted-foreground p-2 bg-card/80 backdrop-blur-sm border border-border rounded">
                <div className="flex items-center">
                    <span className="w-3 h-3 inline-block mr-1 rounded-sm bg-[#27272a] dark:bg-[#2dd4bf]"></span>
                    <span>Active</span>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 inline-block mr-1 border border-border rounded-sm bg-[#f4f4f5] dark:bg-muted"></span>
                    <span>No devs yet</span>
                </div>
            </div>
        </div>
    );
}
