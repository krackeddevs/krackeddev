"use client";

import { useEffect, useState } from "react";

function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function: easeOutExpo
      const easedProgress =
        progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
}

import { useLandingStats, LandingStats } from "@/lib/hooks/use-landing-data";

// ... (Counter component stays the same) ...

export function LiveStats({ initialData }: { initialData?: LandingStats | null }) {
  const { data: stats } = useLandingStats(initialData);

  if (!stats) return null; // Or a loading skeleton

  const statItems = [
    { label: "TOTAL BOUNTIES PAID", value: stats.payoutVolume, prefix: "RM" },
    { label: "LIVE MISSIONS", value: stats.activeBounties, prefix: "" },
    { label: "ACTIVE AGENTS", value: stats.travelers, prefix: "" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statItems.map((item, idx) => (
          <div
            key={idx}
            className="group relative bg-card/60 border border-neon-primary/30 p-8 rounded-sm backdrop-blur-sm overflow-hidden"
          >
            {/* CRT Scanline overlay for card */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,255,0,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <span className="text-sm md:text-base text-neon-primary/80 font-mono tracking-[0.2em] mb-2 uppercase">
                {item.label}
              </span>
              <div className="text-4xl md:text-5xl font-bold text-foreground font-mono drop-shadow-[0_0_10px_var(--neon-primary)]">
                {item.prefix}
                <Counter end={item.value} />
              </div>
            </div>

            {/* Corner acccents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neon-primary" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-neon-primary" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-neon-primary" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neon-primary" />
          </div>
        ))}
      </div>
    </div>
  );
}
