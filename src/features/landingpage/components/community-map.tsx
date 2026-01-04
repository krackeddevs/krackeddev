"use client";

import { Users } from "lucide-react";
import { useCommunityLocations } from "@/lib/hooks/use-landing-data";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";

// Lazy load the map with no SSR
const CommunityMapClient = dynamic(
  () => import("./community-map-client").then((mod) => mod.CommunityMapClient),
  { ssr: false }
);

export function CommunityMap() {
  const { data = [], isLoading } = useCommunityLocations();
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to load map when it comes into view
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px", // Start loading slightly before it's visible
      }
    );

    observer.observe(mapContainerRef.current);

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-neon-primary font-mono animate-pulse">Loading community data...</div>
      </div>
    );
  }

  const totalUsers = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8" ref={mapContainerRef}>
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-mono font-bold text-neon-primary mb-2">
          🇲🇾 Our Community
        </h2>
        <p className="text-muted-foreground font-mono text-sm">
          <Users className="inline-block w-4 h-4 mr-2" />
          {totalUsers} developers across Malaysia
        </p>
      </div>

      {shouldLoadMap ? (
        <CommunityMapClient data={data} />
      ) : (
        // Skeleton loader - shows immediately, no delay
        <div className="relative w-full h-[300px] md:h-[500px] bg-card border border-border rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/20 animate-pulse">
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <div className="text-muted-foreground font-mono text-sm">
                  Loading map...
                </div>
                <div className="w-48 h-2 bg-muted rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-neon-primary/50 animate-pulse" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
