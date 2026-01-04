"use client";

import { useMemo, useState, useCallback } from "react";
import { Users } from "lucide-react";
import { useCommunityLocations } from "@/lib/hooks/use-landing-data";
import { Map, MapControls } from "@/components/ui/map";
import { MalaysiaMapLayers } from "@/components/maps/malaysia-map-layers";

export function CommunityMap() {
  const { data = [], isLoading } = useCommunityLocations();
  const [tooltipInfo, setTooltipInfo] = useState<{ name: string, value: number, x: number, y: number } | null>(null);

  const totalUsers = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  );

  const handleHover = useCallback((stateName: string | null, value: number, x: number, y: number) => {
    if (stateName) {
      setTooltipInfo({ name: stateName, value, x, y });
    } else {
      setTooltipInfo(null);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-neon-primary font-mono animate-pulse">Loading community map...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-mono font-bold text-neon-primary mb-2">
          🇲🇾 Our Community
        </h2>
        <p className="text-muted-foreground font-mono text-sm">
          <Users className="inline-block w-4 h-4 mr-2" />
          {totalUsers} developers across Malaysia
        </p>
      </div>

      <div className="relative w-full h-[300px] md:h-[500px] bg-card border border-border overflow-hidden rounded-lg z-20">
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
            <span className="w-3 h-3 bg-neon-primary inline-block mr-1 rounded-sm"></span>
            <span>Active</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-muted inline-block mr-1 border border-border rounded-sm"></span>
            <span>No devs yet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
