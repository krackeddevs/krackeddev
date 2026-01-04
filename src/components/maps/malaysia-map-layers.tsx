"use client";

import { useEffect, useMemo, useState } from "react";
import { useMap } from "@/components/ui/map";
import { useTheme } from "next-themes";
import maplibregl from "maplibre-gl";

// Constants
const GEOJSON_URL = "/geo/malaysia-states-simple.json";

export function MalaysiaMapLayers({
    data,
    onHover
}: {
    data: { name: string; value: number }[];
    onHover?: (stateName: string | null, value: number, x: number, y: number) => void;
}) {
    const { map, isLoaded } = useMap();
    const { resolvedTheme } = useTheme();
    const [geoJson, setGeoJson] = useState<any>(null);

    // Fetch GeoJSON on mount
    useEffect(() => {
        fetch(GEOJSON_URL)
            .then((res) => res.json())
            .then((json) => setGeoJson(json))
            .catch((err) => console.error("Failed to load map data:", err));
    }, []);

    // State name aliases handles: User Input (keys) -> GeoJSON Shape Name (values)
    const STATE_ALIASES: Record<string, string> = {
        // Map Malay names to GeoJSON English names
        "melaka": "malacca",
        "pulau pinang": "penang",
        "pinang": "penang",

        // Map Federal Territories (long names) to GeoJSON (short names)
        "wilayah persekutuan kuala lumpur": "kuala lumpur",
        "kuala lumpur": "kuala lumpur",
        "kl": "kuala lumpur",

        "wilayah persekutuan putrajaya": "putrajaya",
        "putrajaya": "putrajaya",

        "wilayah persekutuan labuan": "labuan",
        "labuan": "labuan",
    };

    // Merge external data into GeoJSON properties when data or geoJson changes
    const enrichedGeoJson = useMemo(() => {
        if (!geoJson) return null;

        // Normalize data for faster lookup
        const dataMap = new Map();
        data.forEach(d => {
            dataMap.set(d.name.toLowerCase(), d.value);
        });

        const enrichedFeatures = geoJson.features.map((feature: any) => {
            // Fuzzy match state names
            const stateName = feature.properties.shapeName; // geoBoundaries uses shapeName

            // Try exact match first
            let count = 0;
            const lowerName = stateName.toLowerCase();

            // Attempt to find matching data entry
            const matchedEntry = data.find(d => {
                const dataLower = d.name.toLowerCase();

                // Check if data name has an alias that matches the state
                const dataAlias = STATE_ALIASES[dataLower];
                if (dataAlias && lowerName.includes(dataAlias)) {
                    return true;
                }

                // Check if state name has an alias that matches the data
                const stateAlias = STATE_ALIASES[lowerName];
                if (stateAlias && dataLower.includes(stateAlias)) {
                    return true;
                }

                // Fallback to fuzzy matching
                return dataLower.includes(lowerName) || lowerName.includes(dataLower);
            });

            if (matchedEntry) {
                count = matchedEntry.value;
            }

            return {
                ...feature,
                properties: {
                    ...feature.properties,
                    userCount: count,
                    stateName: stateName
                }
            };
        });

        return {
            ...geoJson,
            features: enrichedFeatures
        };
    }, [geoJson, data]);

    // Setup function to add source and layers
    const setupLayers = useMemo(() => {
        return () => {
            if (!map || !enrichedGeoJson) return;

            const sourceId = "malaysia-states-source";
            const fillLayerId = "malaysia-states-fill";
            const lineLayerId = "malaysia-states-line";

            if (!map.getSource(sourceId)) {
                map.addSource(sourceId, {
                    type: "geojson",
                    data: enrichedGeoJson,
                });
            } else {
                (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(enrichedGeoJson);
            }

            if (!map.getLayer(fillLayerId)) {
                map.addLayer({
                    id: fillLayerId,
                    type: "fill",
                    source: sourceId,
                    paint: {
                        "fill-color": [
                            "interpolate",
                            ["linear"],
                            ["get", "userCount"],
                            0,
                            // Monochrome mode: high contrast grayscale, otherwise: teal theme
                            resolvedTheme === "blackwhite"
                                ? "#f4f4f5"  // zinc-100 (very light for empty states)
                                : (resolvedTheme === "dark" ? "#1e293b" : "#e2e8f0"), // slate (colored)
                            1,
                            resolvedTheme === "blackwhite"
                                ? "#71717a"  // zinc-500 (medium gray for low count)
                                : (resolvedTheme === "dark" ? "#0f766e" : "#5eead4"), // teal (colored)
                            50,
                            resolvedTheme === "blackwhite"
                                ? "#27272a"  // zinc-800 (very dark for high count)
                                : (resolvedTheme === "dark" ? "#2dd4bf" : "#0d9488"), // teal (colored)
                        ],
                        "fill-opacity": 0.8,
                    },
                });

                // Re-attach listeners for the new layer instance
                map.on("mousemove", fillLayerId, (e) => {
                    if (e.features && e.features.length > 0) {
                        map.getCanvas().style.cursor = "pointer";
                        const feature = e.features[0];
                        const props = feature.properties;
                        if (onHover) {
                            onHover(props.stateName, props.userCount, e.point.x, e.point.y);
                        }
                        if (map.getLayer(fillLayerId)) {
                            map.setPaintProperty(fillLayerId, "fill-opacity", [
                                "case",
                                ["==", ["get", "shapeName"], props.shapeName],
                                1,
                                0.8
                            ]);
                        }
                    }
                });

                map.on("mouseleave", fillLayerId, () => {
                    map.getCanvas().style.cursor = "";
                    if (onHover) {
                        onHover(null, 0, 0, 0);
                    }
                    if (map.getLayer(fillLayerId)) {
                        map.setPaintProperty(fillLayerId, "fill-opacity", 0.8);
                    }
                });
            }

            if (!map.getLayer(lineLayerId)) {
                map.addLayer({
                    id: lineLayerId,
                    type: "line",
                    source: sourceId,
                    paint: {
                        "line-color": resolvedTheme === "blackwhite"
                            ? "#52525b"  // zinc-600 (monochrome)
                            : (resolvedTheme === "dark" ? "#2dd4bf" : "#0f766e"), // teal (colored)
                        "line-width": 1,
                        "line-opacity": 0.5,
                    },
                });
            }
        };
    }, [map, enrichedGeoJson, resolvedTheme, onHover]);

    // Initial load and styledata listener
    useEffect(() => {
        if (!isLoaded || !map || !enrichedGeoJson) return;

        // Initial setup
        setupLayers();

        // Re-apply layers when style changes (e.g., theme switch)
        const handleStyleData = () => {
            setupLayers();
        };

        map.on("styledata", handleStyleData);

        return () => {
            map.off("styledata", handleStyleData);
        };
    }, [isLoaded, map, enrichedGeoJson, setupLayers]);

    // One-time fit bounds
    useEffect(() => {
        if (!isLoaded || !map) return;

        // Fit bounds to Malaysia
        const sw: maplibregl.LngLatLike = [99.5, 0.5];
        const ne: maplibregl.LngLatLike = [120.0, 7.5];

        map.fitBounds([sw, ne], {
            padding: { top: 20, bottom: 20, left: 20, right: 20 },
            maxZoom: 8,
        });

        map.setMaxBounds([
            [95.0, -5.0],
            [125.0, 15.0]
        ]);
    }, [isLoaded, map]);

    // Separate effect for theme updates on existing layer
    useEffect(() => {
        if (!isLoaded || !map) return;
        const fillLayerId = "malaysia-states-fill";
        const lineLayerId = "malaysia-states-line";

        if (map.getLayer(fillLayerId)) {
            map.setPaintProperty(fillLayerId, "fill-color", [
                "interpolate",
                ["linear"],
                ["get", "userCount"],
                0,
                resolvedTheme === "blackwhite"
                    ? "#f4f4f5"  // zinc-100 (very light for empty states)
                    : (resolvedTheme === "dark" ? "#1e293b" : "#e2e8f0"),
                1,
                resolvedTheme === "blackwhite"
                    ? "#71717a"  // zinc-500 (medium gray for low count)
                    : (resolvedTheme === "dark" ? "#0f766e" : "#5eead4"),
                50,
                resolvedTheme === "blackwhite"
                    ? "#27272a"  // zinc-800 (very dark for high count)
                    : (resolvedTheme === "dark" ? "#2dd4bf" : "#0d9488"),
            ]);
        }
        if (map.getLayer(lineLayerId)) {
            map.setPaintProperty(lineLayerId, "line-color",
                resolvedTheme === "blackwhite"
                    ? "#52525b"
                    : (resolvedTheme === "dark" ? "#2dd4bf" : "#0f766e")
            );
        }
    }, [resolvedTheme, isLoaded, map]);

    return null;
}
