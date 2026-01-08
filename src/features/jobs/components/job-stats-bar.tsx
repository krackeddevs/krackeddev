import { cn } from "@/lib/utils";
import type { JobStats } from "../types";

interface JobStatsBarProps {
    stats: JobStats;
}

export function JobStatsBar({ stats }: JobStatsBarProps) {
    const statItems = [
        { label: "ACTIVE CONTRACTS", value: stats.totalJobs.toString().padStart(3, '0'), color: "text-cyan-700 dark:text-[var(--neon-cyan)]", borderColor: "border-neon-cyan/30" },
        { label: "REMOTE ROLES", value: stats.remoteJobs.toString().padStart(2, '0'), color: "text-purple-700 dark:text-[var(--neon-purple)]", borderColor: "border-neon-purple/30" },
        { label: "VERIFIED COMPANIES", value: stats.verifiedCompanies.toString().padStart(2, '0'), color: "text-emerald-700 dark:text-[var(--neon-primary)]", borderColor: "border-[var(--neon-primary)]/30" },
        { label: "NEW THIS WEEK", value: stats.newJobs.toString().padStart(2, '0'), color: "text-lime-700 dark:text-[var(--neon-lime)]", borderColor: "border-neon-lime/30" },
    ];

    return (
        <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            data-testid="job-stats-bar"
        >
            {statItems.map((item) => (
                <div key={item.label} className={cn("bg-muted/30 border p-6 flex flex-col justify-between min-h-[120px] transition-colors duration-300", item.borderColor)}>
                    <div className="text-[10px] font-mono opacity-50 tracking-[0.2em] uppercase text-foreground">{item.label}</div>
                    <div
                        className={cn("text-3xl font-bold font-mono tracking-tighter", item.color)}
                    >
                        {item.value}
                    </div>
                </div>
            ))}
        </div>
    );
}
