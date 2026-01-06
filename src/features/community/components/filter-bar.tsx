"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce"; // Assuming we have this or I'll implement simple timeout

// Helper for debouncing if hook doesn't exist
// better to use useEffect with timeout

export function FilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentFilter = searchParams.get("filter") || "newest";
    const currentSearch = searchParams.get("search") || "";

    const [searchValue, setSearchValue] = useState(currentSearch);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (filter: string) => {
        router.push(pathname + "?" + createQueryString("filter", filter));
    };

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        // Reset page to 1 on search
        params.delete("page");
        router.push(pathname + "?" + params.toString());
    };

    // Simple debounce effect
    // We already have searchValue state
    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchValue(val);
        // Debounce logic could be here, or use keydown 'Enter'
        // For now let's just use Enter key or Blur to avoid too many refreshes, or a wrapper
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch(searchValue);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
            <div className="relative w-full sm:w-[320px] group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50 group-focus-within:text-[var(--neon-primary)] transition-colors" />
                <Input
                    placeholder="SEARCH INTERFACE..."
                    className="pl-10 bg-card/40 border-border/50 focus-visible:ring-1 focus-visible:ring-[var(--neon-primary)]/50 font-mono text-[10px] tracking-widest uppercase h-10 rounded-none transition-all placeholder:text-foreground/40"
                    value={searchValue}
                    onChange={onSearchChange}
                    onKeyDown={onKeyDown}
                    onBlur={() => handleSearch(searchValue)}
                />
            </div>

            <div className="flex items-center gap-1 bg-card/20 p-1 border border-border/50 rounded-none backdrop-blur-sm">
                {["newest", "top", "unanswered"].map((filter) => {
                    const isActive = currentFilter === filter;
                    return (
                        <Button
                            key={filter}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFilterChange(filter)}
                            className={cn(
                                "capitalize text-[9px] h-8 font-bold font-mono tracking-widest px-4 rounded-none transition-all",
                                isActive
                                    ? "bg-[var(--neon-primary)] text-background shadow-[0_0_15px_rgba(var(--neon-primary-rgb),0.3)] hover:bg-[var(--neon-primary)]/90"
                                    : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                            )}
                        >
                            {filter}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
