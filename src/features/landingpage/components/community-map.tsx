"use client";

import { useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Users } from "lucide-react";
import { useCommunityLocations } from "@/lib/hooks/use-landing-data";

const GEO_URL = "/malaysia-states.json";

export function CommunityMap() {
  const { data = [], isLoading } = useCommunityLocations();
  const [position, setPosition] = useState({
    coordinates: [109, 4] as [number, number],
    zoom: 1,
  });
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const colorScale = useMemo(() => {
    const max = Math.max(...data.map((d) => d.value), 1);
    return scaleLinear<string>().domain([0, max]).range(["#1a1a2e", "#22c55e"]); // Dark to neon green
  }, [data]);

  const totalUsers = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data],
  );

  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 0.5) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  }

  function handleMoveEnd(position: {
    coordinates: [number, number];
    zoom: number;
  }) {
    setPosition(position);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-green-400 font-mono">
          Loading community data...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-mono font-bold text-green-400 mb-2">
          🇲🇾 Our Community
        </h2>
        <p className="text-gray-400 font-mono text-sm">
          <Users className="inline-block w-4 h-4 mr-2" />
          {totalUsers} developers across Malaysia
        </p>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[300px] md:h-[400px] border-2 border-green-500/30 bg-gray-900/80 overflow-hidden">
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className="h-8 w-8 bg-gray-800 hover:bg-gray-700 border border-green-500/50"
          >
            <Plus className="h-4 w-4 text-green-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="h-8 w-8 bg-gray-800 hover:bg-gray-700 border border-green-500/50"
          >
            <Minus className="h-4 w-4 text-green-400" />
          </Button>
        </div>

        {/* Custom Tooltip */}
        {tooltipContent && (
          <div
            className="absolute z-20 pointer-events-none bg-gray-800 text-green-400 px-3 py-2 font-mono text-sm border border-green-500/50"
            style={{
              left: tooltipPos.x + 10,
              top: tooltipPos.y + 10,
            }}
          >
            {tooltipContent}
          </div>
        )}

        <div
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 3500,
              center: [109, 4],
            }}
            width={800}
            height={400}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates}
              onMoveEnd={handleMoveEnd}
              minZoom={0.5}
              maxZoom={4}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateName =
                      geo.properties.name || geo.properties.STATE;
                    const cur = data.find((s) =>
                      s.name.toLowerCase().includes(stateName?.toLowerCase()),
                    );
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={cur ? colorScale(cur.value) : "#1a1a2e"}
                        stroke="#22c55e"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#4ade80", outline: "none" },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={() => {
                          setTooltipContent(
                            `${stateName}: ${cur?.value || 0} devs`,
                          );
                        }}
                        onMouseLeave={() => {
                          setTooltipContent(null);
                        }}
                        onTouchStart={() => {
                          setTooltipContent(
                            `${stateName}: ${cur?.value || 0} devs`,
                          );
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs font-mono text-gray-400 p-2 bg-gray-900/80 border border-green-500/30">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 inline-block mr-1"></span>
            <span>Active</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-[#1a1a2e] inline-block mr-1 border border-green-500/30"></span>
            <span>No devs yet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
