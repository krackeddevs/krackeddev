"use client";

import dynamic from "next/dynamic";
import { Users } from "lucide-react";
import { useCommunityLocations } from "@/lib/hooks/use-landing-data";

// Lazy load the map components to reduce initial bundle size
const CommunityMapClient = dynamic(
  () => import("./community-map-client").then((mod) => mod.CommunityMapClient),
  {
    loading: () => (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-neon-primary font-mono animate-pulse">Loading community map...</div>
      </div>
    ),
    ssr: false, // Map requires browser APIs
  }
);

export function CommunityMap() {
  const { data = [], isLoading } = useCommunityLocations();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-neon-primary font-mono animate-pulse">Loading community data...</div>
      </div>
    );
  }

  const totalUsers = data.reduce((sum, d) => sum + d.value, 0);

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

      <CommunityMapClient data={data} />
    </div>
  );
}
