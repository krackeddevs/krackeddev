"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react"; // Removed useTransition as it might be overkill for now
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
            <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search questions..."
                    className="pl-8 bg-muted/50 border-input/50 focus-visible:ring-1"
                    value={searchValue}
                    onChange={onSearchChange}
                    onKeyDown={onKeyDown}
                    onBlur={() => handleSearch(searchValue)}
                />
            </div>

            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-border">
                {["newest", "top", "unanswered"].map((filter) => (
                    <Button
                        key={filter}
                        variant={currentFilter === filter ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => handleFilterChange(filter)}
                        className={`capitalize text-xs h-8 ${currentFilter === filter ? "bg-background shadow-sm" : "hover:bg-muted/50"}`}
                    >
                        {filter}
                    </Button>
                ))}
            </div>
        </div>
    );
}
