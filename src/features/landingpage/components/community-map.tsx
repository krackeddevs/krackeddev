"use client";

import { useState, useMemo } from "react";
import { Users } from "lucide-react";
import { useCommunityLocations } from "@/lib/hooks/use-landing-data";
import { MAP_PATHS, JOHOR_INDEX } from "./map-paths";
import { scaleLinear } from "d3-scale";

// Initial mapping guess - We know Johor is index 12.
// We will need to verify the others with the user or iterate.
// Order corresponds to the paths in map.svg.
const STATE_NAMES = [
  "Not Set", // 0
  "Not Set", // 1
  "Not Set", // 2
  "Not Set", // 3
  "Not Set", // 4
  "Not Set", // 5
  "Not Set", // 6
  "Not Set", // 7
  "Not Set", // 8
  "Not Set", // 9
  "Not Set", // 10
  "Not Set", // 11
  "Johor",   // 12 - Verified by gradient
  "Not Set", // 13
  "Not Set", // 14
  "Not Set", // 15
];

// Based on standard map orders, let's try a best guess for standard Malaysia map exports:
// 0: Perlis
// 1: Kedah
// 2: Pulau Pinang
// 3: Perak
// 4: Kelantan
// 5: Terengganu
// 6: Pahang
// 7: Selangor
// 8: WP Kuala Lumpur
// 9: WP Putrajaya
// 10: Negeri Sembilan
// 11: Melaka
// 12: Johor
// 13: Sarawak
// 14: Sabah
// 15: WP Labuan
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

export function CommunityMap() {
  const { data = [], isLoading } = useCommunityLocations();
  const [hoveredStateIndex, setHoveredStateIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const totalUsers = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  );

  const maxUsers = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  const colorScale = useMemo(() => {
    // Darker green for higher values
    // Using base green (#22c55e) to dark green (#14532d)
    return scaleLinear<string>()
      .domain([1, maxUsers])
      .range(["#22c55e", "#14532d"]);
  }, [maxUsers]);

  const getStateValue = (index: number) => {
    // Use guessed names for now, user can verify
    const stateName = GUESSED_STATE_NAMES[index];
    if (!stateName) return 0;

    const found = data.find((s) =>
      s.name.toLowerCase().includes(stateName.toLowerCase()) ||
      stateName.toLowerCase().includes(s.name.toLowerCase())
    );
    return found?.value || 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-green-400 font-mono">Loading community data...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-mono font-bold text-green-400 mb-2">
          🇲🇾 Our Community
        </h2>
        <p className="text-gray-400 font-mono text-sm">
          <Users className="inline-block w-4 h-4 mr-2" />
          {totalUsers} developers across Malaysia
        </p>
      </div>

      <div
        className="relative w-full h-[300px] md:h-[400px] border-2 border-green-500/30 bg-black overflow-hidden rounded-lg p-4 flex items-center justify-center z-20"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
      >
        {/* Tooltip */}
        {hoveredStateIndex !== null && (
          <div
            className="absolute z-20 pointer-events-none bg-black/90 text-green-400 px-3 py-2 font-mono text-sm border border-green-500/50 rounded shadow-[0_0_10px_rgba(34,197,94,0.2)]"
            style={{ left: tooltipPos.x + 10, top: tooltipPos.y + 10 }}
          >
            <span className="font-bold text-white">{GUESSED_STATE_NAMES[hoveredStateIndex] || "Unknown"}</span>
            <br />
            {getStateValue(hoveredStateIndex)} devs
          </div>
        )}

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

            // Determine fill color
            let fill = "#1f2937"; // default dark gray (inactive)
            if (isActive) {
              fill = colorScale(val);
            }

            // Hover logic
            if (isHovered && !isActive) fill = "#374151"; // lighter gray on hover
            if (isHovered && isActive) fill = "#4ade80"; // highlight bright green on hover active

            return (
              <path
                key={index}
                d={pathData}
                fill={fill}
                stroke={isHovered ? "#4ade80" : "#374151"}
                strokeWidth={isHovered ? "2" : "1.5"}
                fillOpacity={1} // Force solid opacity
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredStateIndex(index)}
                onMouseLeave={() => setHoveredStateIndex(null)}
              />
            );
          })}
        </svg>

        {/* Legend - increased z-index */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-4 text-xs font-mono text-gray-400 p-2 bg-black border border-green-500/30 rounded">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 inline-block mr-1 rounded-sm"></span>
            <span>Active</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-[#1f2937] inline-block mr-1 border border-gray-600 rounded-sm"></span>
            <span>No devs yet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
