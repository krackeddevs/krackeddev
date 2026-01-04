"use client";

import { useEffect, useMemo, useState } from "react";
import { useMap } from "@/components/ui/map";
import { useTheme } from "next-themes";
import maplibregl from "maplibre-gl";

// Constants
const GEOJSON_URL = "/geo/malaysia-states.json";

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
            const matchedEntry = data.find(d =>
                d.name.toLowerCase().includes(lowerName) ||
                lowerName.includes(d.name.toLowerCase())
            );

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
                            resolvedTheme === "dark" ? "#18181b" : "#f4f4f5",
                            1,
                            resolvedTheme === "dark" ? "#3f3f46" : "#d4d4d8",
                            50,
                            resolvedTheme === "dark" ? "#71717a" : "#52525b",
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
                        "line-color": resolvedTheme === "dark" ? "#52525b" : "#a1a1aa",
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
                resolvedTheme === "dark" ? "#18181b" : "#f4f4f5",
                1,
                resolvedTheme === "dark" ? "#3f3f46" : "#d4d4d8",
                50,
                resolvedTheme === "dark" ? "#71717a" : "#52525b",
            ]);
        }
        if (map.getLayer(lineLayerId)) {
            map.setPaintProperty(lineLayerId, "line-color", resolvedTheme === "dark" ? "#52525b" : "#a1a1aa");
        }
    }, [resolvedTheme, isLoaded, map]);

    return null;
}
