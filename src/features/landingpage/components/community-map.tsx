"use client";

import { useState, useMemo } from "react";
import { Users } from "lucide-react";
import { MAP_PATHS, JOHOR_INDEX } from "./map-paths";
import { scaleLinear } from "d3-scale";

// Initial mapping guess - We know Johor is index 12.
// We will need to verify the others with the user or iterate.
// Order corresponds to the paths in map.svg.
const STATE_ALIASES: Record<string, string[]> = {
  "Melaka": ["Malacca"],
  "Pulau Pinang": ["Penang"],
  "Wilayah Persekutuan Kuala Lumpur": ["Kuala Lumpur", "KL"],
  "Wilayah Persekutuan Putrajaya": ["Putrajaya"],
  "Wilayah Persekutuan Labuan": ["Labuan"],
};

// Based on standard map orders for these SVG paths:
// Index 12 is Johor (verified).
const GUESSED_STATE_NAMES = [
  "Perlis",
  "Kedah",
  "Pulau Pinang",
  "Perak",
  "Terengganu",
  "Pahang",
  "Kelantan",
  "Negeri Sembilan",
  "Melaka",
  "Selangor",
  "Wilayah Persekutuan Putrajaya",
  "Wilayah Persekutuan Kuala Lumpur",
  "Johor",
  "Sabah",
  "Wilayah Persekutuan Labuan",
  "Sarawak"
];

import { useCommunityLocations, LocationData } from "@/lib/hooks/use-landing-data";

// ... (existing constants) ...

export function CommunityMap({ initialData }: { initialData?: LocationData[] }) {
  const { data = [], isLoading } = useCommunityLocations(initialData);
  const [hoveredStateIndex, setHoveredStateIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const totalUsers = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  );

  const maxUsers = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  const opacityScale = useMemo(() => {
    // Starting from 0.4 to ensure even states with 1 user are clearly visible
    return scaleLinear<number>()
      .domain([1, maxUsers])
      .range([0.4, 1]);
  }, [maxUsers]);

  const getStateValue = (index: number) => {
    const stateName = GUESSED_STATE_NAMES[index];
    if (!stateName) return 0;

    const lowerStateName = stateName.toLowerCase();
    const aliases = (STATE_ALIASES[stateName] || []).map(a => a.toLowerCase());

    const found = data.find((s) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-neon-primary font-mono animate-pulse">Loading community data...</div>
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

      <div
        className="relative w-full h-[300px] md:h-[400px] bg-card/40 backdrop-blur-sm border border-border overflow-hidden rounded-lg p-4 flex items-center justify-center z-20"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
      >
        {/* Tooltip */}
        {hoveredStateIndex !== null && (() => {
          const userCount = getStateValue(hoveredStateIndex);
          const stateName = GUESSED_STATE_NAMES[hoveredStateIndex] || "Unknown";

          return (
            <div
              className="absolute z-20 pointer-events-none bg-popover/95 text-neon-primary px-3 py-2 font-mono text-sm border border-neon-primary/50 rounded shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-md"
              style={{ left: tooltipPos.x + 10, top: tooltipPos.y + 10 }}
            >
              <span className="font-bold text-popover-foreground">{stateName}</span>
              <br />
              {userCount === 0 ? (
                <span className="text-muted-foreground text-xs">No operatives yet</span>
              ) : (
                <span>{userCount} operative{userCount !== 1 ? 's' : ''}</span>
              )}
            </div>
          );
        })()}

        {/* SVG Map */}
        <svg
          viewBox="0 0 940 400"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          {MAP_PATHS.map((pathData, index) => {
            const val = getStateValue(index);
            const isActive = val > 0;
            const isHovered = hoveredStateIndex === index;

            // Use opacity for intensity to support CSS variables (and B&W mode)
            let fill = "var(--muted)";
            let fillOpacity = 1;

            if (isActive) {
              fill = "var(--neon-primary)";
              fillOpacity = opacityScale(val);
            }

            // Hover logic overrides
            if (isHovered && !isActive) {
              fill = "var(--accent)";
            }
            if (isHovered && isActive) {
              fill = "var(--neon-primary)";
              fillOpacity = 1; // max bright on hover
            }

            return (
              <path
                key={index}
                d={pathData}
                fill={fill}
                stroke={isHovered ? "var(--neon-primary)" : "var(--border)"}
                strokeWidth={isHovered ? "2" : "1.5"}
                fillOpacity={fillOpacity}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredStateIndex(index)}
                onMouseLeave={() => setHoveredStateIndex(null)}
              />
            );
          })}
        </svg>

        {/* Legend - increased z-index */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-4 text-xs font-mono text-muted-foreground p-2 bg-card border border-border rounded">
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
