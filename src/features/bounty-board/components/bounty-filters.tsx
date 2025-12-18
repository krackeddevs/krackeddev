"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import type { BountyFilters, BountyDifficulty, BountyStatus } from "../types";

interface BountyFiltersProps {
    filters: BountyFilters;
    onFiltersChange: (filters: BountyFilters) => void;
    availableTags?: string[];
}

const DIFFICULTY_OPTIONS: { value: BountyDifficulty | "all"; label: string }[] = [
    { value: "all", label: "All Difficulties" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" },
];

const STATUS_OPTIONS: { value: BountyStatus | "all"; label: string }[] = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "claimed", label: "Claimed" },
    { value: "expired", label: "Expired" },
];

export function BountyFilters({
    filters,
    onFiltersChange,
    availableTags = [],
}: BountyFiltersProps) {
    const [showTagDropdown, setShowTagDropdown] = useState(false);

    const updateFilter = useCallback(
        <K extends keyof BountyFilters>(key: K, value: BountyFilters[K]) => {
            onFiltersChange({ ...filters, [key]: value });
        },
        [filters, onFiltersChange]
    );

    const toggleTag = useCallback(
        (tag: string) => {
            const newTags = filters.tags.includes(tag)
                ? filters.tags.filter((t) => t !== tag)
                : [...filters.tags, tag];
            updateFilter("tags", newTags);
        },
        [filters.tags, updateFilter]
    );

    const clearAllFilters = useCallback(() => {
        onFiltersChange({
            search: "",
            status: "all",
            difficulty: "all",
            tags: [],
        });
    }, [onFiltersChange]);

    const hasActiveFilters =
        filters.search !== "" ||
        filters.status !== "all" ||
        filters.difficulty !== "all" ||
        filters.tags.length > 0;

    return (
        <div
            className="bg-gray-800/30 border border-gray-700 p-4 mb-8"
            data-testid="bounty-filters"
        >
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search bounties..."
                        value={filters.search}
                        onChange={(e) => updateFilter("search", e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 pl-10 pr-4 py-2 font-mono text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                        data-testid="search-input"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={filters.status}
                    onChange={(e) =>
                        updateFilter("status", e.target.value as BountyStatus | "all")
                    }
                    className="bg-gray-900 border border-gray-600 px-4 py-2 font-mono text-sm text-white focus:border-cyan-500 focus:outline-none"
                    data-testid="status-filter"
                >
                    {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Difficulty Filter */}
                <select
                    value={filters.difficulty}
                    onChange={(e) =>
                        updateFilter("difficulty", e.target.value as BountyDifficulty | "all")
                    }
                    className="bg-gray-900 border border-gray-600 px-4 py-2 font-mono text-sm text-white focus:border-cyan-500 focus:outline-none"
                    data-testid="difficulty-filter"
                >
                    {DIFFICULTY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Tag Filter */}
                {availableTags.length > 0 && (
                    <div className="relative">
                        <button
                            onClick={() => setShowTagDropdown(!showTagDropdown)}
                            className="bg-gray-900 border border-gray-600 px-4 py-2 font-mono text-sm text-white focus:border-cyan-500 focus:outline-none min-w-[140px] text-left"
                            data-testid="tags-filter-button"
                        >
                            Tags {filters.tags.length > 0 && `(${filters.tags.length})`}
                        </button>
                        {showTagDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-600 p-2 z-50 max-h-48 overflow-y-auto min-w-[200px]">
                                {availableTags.map((tag) => (
                                    <label
                                        key={tag}
                                        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-800 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters.tags.includes(tag)}
                                            onChange={() => toggleTag(tag)}
                                            className="accent-cyan-500"
                                        />
                                        <span className="text-gray-300 text-sm font-mono">{tag}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Active Filter Tags */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <span className="text-gray-500 text-sm font-mono">Active filters:</span>

                    {filters.search && (
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-mono flex items-center gap-1">
                            &quot;{filters.search}&quot;
                            <button
                                onClick={() => updateFilter("search", "")}
                                className="hover:text-white"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}

                    {filters.status !== "all" && (
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-mono flex items-center gap-1">
                            {filters.status}
                            <button
                                onClick={() => updateFilter("status", "all")}
                                className="hover:text-white"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}

                    {filters.difficulty !== "all" && (
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-mono flex items-center gap-1">
                            {filters.difficulty}
                            <button
                                onClick={() => updateFilter("difficulty", "all")}
                                className="hover:text-white"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}

                    {filters.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-mono flex items-center gap-1"
                        >
                            {tag}
                            <button onClick={() => toggleTag(tag)} className="hover:text-white">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}

                    <button
                        onClick={clearAllFilters}
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-xs underline"
                        data-testid="clear-filters-button"
                    >
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
}
