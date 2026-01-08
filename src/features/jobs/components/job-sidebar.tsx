"use client";

import { useState } from "react";
import { Search, MapPin, Briefcase, DollarSign, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { POPULAR_LOCATIONS, SALARY_RANGE_OPTIONS } from "@/lib/constants/jobs";
import type { JobFilters } from "../types";

interface JobSidebarProps {
    filters: JobFilters;
    onFiltersChange: (filters: JobFilters) => void;
    availableTypes: string[];
}

export function JobSidebar({ filters, onFiltersChange, availableTypes }: JobSidebarProps) {
    const [localSearch, setLocalSearch] = useState(filters.search);

    const normalizedTypes = Array.from(new Set(availableTypes.map(t => {
        const lower = t.toLowerCase().trim().replace(/\s+/g, '-');
        return lower === 'full-time' || lower === 'full time' ? 'full-time' : lower;
    })));

    const getDisplayName = (type: string) => {
        if (type === 'full-time') return 'Full-time';
        return type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearch(e.target.value);
    };

    const handleSearchSubmit = () => {
        onFiltersChange({ ...filters, search: localSearch });
    };

    const updateFilter = (key: keyof JobFilters, value: any) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    return (
        <aside className="w-full space-y-8">
            {/* Search Section */}
            <div className="space-y-2">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-1">// Ops Search</div>
                <div className="flex gap-2">
                    <div className="relative flex-grow group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[var(--neon-cyan)] transition-colors" />
                        <Input
                            placeholder="Identify Signal..."
                            value={localSearch}
                            onChange={handleSearchChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                            className="pl-10 bg-muted/20 border-border/10 focus:border-[var(--neon-cyan)]/50 rounded-none h-10 font-mono text-xs uppercase tracking-widest placeholder:text-muted-foreground/30"
                        />
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="space-y-6">
                {/* Location Filter */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-1">
                        <MapPin className="w-3 h-3" />
                        <span>Location Spectrum</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            onClick={() => updateFilter("location", "")}
                            className={cn(
                                "text-[9px] px-2 py-1 border font-mono uppercase tracking-tighter transition-all",
                                filters.location === ""
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-muted/20 text-foreground border-border/20 hover:border-border/40"
                            )}
                        >
                            Global
                        </button>
                        {POPULAR_LOCATIONS.slice(0, 8).map((loc) => (
                            <button
                                key={loc}
                                onClick={() => updateFilter("location", loc)}
                                className={cn(
                                    "text-[9px] px-2 py-1 border font-mono uppercase tracking-tighter transition-all",
                                    filters.location === loc
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-muted/20 text-foreground border-border/20 hover:border-border/40"
                                )}
                            >
                                {loc}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Employment Type */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-1">
                        <Briefcase className="w-3 h-3" />
                        <span>Contract Protocol</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                        <button
                            onClick={() => updateFilter("type", "")}
                            className={cn(
                                "text-[9px] px-2 py-2 border font-mono uppercase tracking-tighter text-left transition-all",
                                filters.type === ""
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-muted/20 text-foreground border-border/20 hover:border-border/40"
                            )}
                        >
                            All Types
                        </button>
                        {normalizedTypes.map((t) => (
                            <button
                                key={t}
                                onClick={() => updateFilter("type", t)}
                                className={cn(
                                    "text-[9px] px-2 py-2 border font-mono uppercase tracking-tighter text-left transition-all",
                                    filters.type === t
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-muted/20 text-foreground border-border/20 hover:border-border/40"
                                )}
                            >
                                {getDisplayName(t)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Salary Threshold */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-1">
                        <DollarSign className="w-3 h-3" />
                        <span>Reward Threshold</span>
                    </div>
                    <div className="space-y-1.5">
                        {SALARY_RANGE_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => updateFilter("salaryMin", opt.value)}
                                className={cn(
                                    "w-full text-left text-[9px] px-3 py-2 border font-mono uppercase tracking-tighter transition-all flex justify-between items-center group",
                                    filters.salaryMin === opt.value
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-muted/20 text-foreground border-border/20 hover:border-border/40"
                                )}
                            >
                                <span>{opt.label}</span>
                                {filters.salaryMin === opt.value && <div className="w-1 h-1 bg-black rounded-full" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reset Action */}
            <Button
                variant="ghost"
                onClick={() => onFiltersChange({ search: "", location: "", type: "", salaryMin: 0 })}
                className="w-full rounded-none border border-dashed border-border/20 text-[10px] font-mono uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
                Clear All Filters
            </Button>
        </aside>
    );
}
