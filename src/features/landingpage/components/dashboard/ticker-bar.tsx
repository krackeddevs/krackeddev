"use client";

import { usePageViews } from "@/lib/hooks/use-page-views";
import { usePrayerTimes } from "@/lib/hooks/use-prayer-times";
import { usePathname } from "next/navigation";

export function TickerBar() {
    const pathname = usePathname();
    const { data: pageViews } = usePageViews(pathname || "/");
    const { data: nextPrayer } = usePrayerTimes();

    const tickerItems = [
        { label: "Next prayer (KL)", value: nextPrayer ? `${nextPrayer.name} ${nextPrayer.time}` : "---" },
        { label: "State", value: "STAY KRACKED." },
        { label: "Page visits", value: pageViews != null ? pageViews.toLocaleString() : "0" },
    ];

    return (
        <div className="h-7 border-b border-border/10 bg-background overflow-hidden flex items-center transition-colors">
            {/* Container for the marquee */}
            <div className="flex whitespace-nowrap animate-marquee-infinite">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center">
                        {tickerItems.map((item, index) => (
                            <div key={index} className="flex items-center mx-10">
                                <span className="text-[9px] font-mono text-foreground/30 mr-2 uppercase tracking-wide">{item.label}:</span>
                                <span className="text-[9px] font-mono text-[var(--neon-primary)] uppercase font-bold tracking-widest">{item.value}</span>
                                <span className="ml-10 text-foreground/10">•</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <style jsx global>{`
        @keyframes marquee-kracked {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          animation: marquee-kracked 40s linear infinite;
        }
      `}</style>
        </div>
    );
}
