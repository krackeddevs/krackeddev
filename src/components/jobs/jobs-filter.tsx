"use client";

import { useState, useEffect } from "react";
import { useQueryState } from "nuqs";
import { jobSearchParams } from "@/lib/search-params";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useJobFilters } from "@/lib/hooks/jobs/use-job-filters";
import { SALARY_RANGE_OPTIONS, POPULAR_LOCATIONS } from "@/lib/constants/jobs";
import { cn } from "@/lib/utils";

export function JobsFilter() {
  const [search, setSearch] = useQueryState("search", jobSearchParams.search);
  const [location, setLocation] = useQueryState(
    "location",
    jobSearchParams.location
  );
  const [type, setType] = useQueryState("type", jobSearchParams.type);
  const [salaryMin, setSalaryMin] = useQueryState(
    "salaryMin",
    jobSearchParams.salaryMin
  );

  const { data: filters, isLoading } = useJobFilters();
  const [localSearch, setLocalSearch] = useState(search || "");

  useEffect(() => {
    setLocalSearch(search || "");
  }, [search]);

  const handleSearch = () => {
    setSearch(localSearch || null); // Clear if empty
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative w-full max-w-sm group">
          <Input
            placeholder="Frontend Engineer..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground pl-4 pr-9 h-8 md:h-10 text-xs md:text-sm rounded-none focus-visible:ring-0 focus-visible:border-neon-cyan transition-all group-hover:border-foreground/50"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch("");
                setSearch(null);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-neon-cyan/20 rounded-sm transition-colors group"
              aria-label="Clear search"
            >
              <X className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground group-hover:text-neon-cyan" />
            </button>
          )}
        </div>
        <Button
          className="bg-card text-neon-cyan border border-neon-cyan/50 hover:bg-neon-cyan hover:text-black h-8 md:h-10 rounded-none px-6 font-mono text-xs md:text-sm transition-all shadow-[0_0_10px_var(--neon-cyan)] hover:shadow-[0_0_20px_var(--neon-cyan)]"
          variant="default"
          onClick={handleSearch}
        >
          <Search className="w-3 h-3 md:w-4 md:h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 text-sm font-mono">
        <span className="text-muted-foreground uppercase tracking-wider text-xs">
          // Filter by
        </span>

        <div className="flex flex-wrap gap-2">
          {/* Location Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "bg-card/50 border-border text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/5 rounded-none h-8 md:h-10 text-xs md:text-sm gap-2 transition-all",
                  location &&
                  "text-neon-cyan border-neon-cyan bg-neon-cyan/10 shadow-[0_0_10px_var(--neon-cyan)]"
                )}
              >
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                {location || "Locations"}
                {location ? (
                  <div
                    role="button"
                    className="ml-1 rounded-full p-0.5 hover:bg-neon-cyan/20"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLocation(null);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </div>
                ) : (
                  <ChevronDown className="w-3 h-3 opacity-50 ml-1" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-popover border-neon-cyan/20 text-popover-foreground rounded-none shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              align="start"
            >
              <DropdownMenuLabel className="text-neon-cyan font-mono text-xs uppercase tracking-wider">
                Select Location
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neon-cyan/20" />
              <DropdownMenuRadioGroup
                value={location || ""}
                onValueChange={(val) => setLocation(val || null)}
              >
                <DropdownMenuRadioItem
                  value=""
                  className="focus:bg-neon-cyan/10 focus:text-neon-cyan cursor-pointer font-mono text-xs"
                >
                  Any Location
                </DropdownMenuRadioItem>
                {POPULAR_LOCATIONS.map((loc) => (
                  <DropdownMenuRadioItem
                    key={loc}
                    value={loc}
                    className="focus:bg-neon-cyan/10 focus:text-neon-cyan cursor-pointer font-mono text-xs"
                  >
                    {loc}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Employment Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "bg-card/50 border-border text-muted-foreground hover:text-neon-purple hover:border-neon-purple/50 hover:bg-neon-purple/5 rounded-none h-8 md:h-10 text-xs md:text-sm gap-2 transition-all",
                  type &&
                  "text-neon-purple border-neon-purple bg-neon-purple/10 shadow-[0_0_10px_var(--neon-purple)]"
                )}
              >
                <Briefcase className="w-3 h-3 md:w-4 md:h-4" />
                {type || "Type"}
                {type ? (
                  <div
                    role="button"
                    className="ml-1 rounded-full p-0.5 hover:bg-neon-purple/20"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setType(null);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </div>
                ) : (
                  <ChevronDown className="w-3 h-3 opacity-50 ml-1" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-popover border-neon-purple/20 text-popover-foreground rounded-none shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              align="start"
            >
              <DropdownMenuLabel className="text-neon-purple font-mono text-xs uppercase tracking-wider">
                Select Type
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neon-purple/20" />
              <DropdownMenuRadioGroup
                value={type || ""}
                onValueChange={(val) => setType(val || null)}
              >
                <DropdownMenuRadioItem
                  value=""
                  className="focus:bg-neon-purple/10 focus:text-neon-purple cursor-pointer font-mono text-xs"
                >
                  Any Type
                </DropdownMenuRadioItem>
                {filters?.types.map((t) => (
                  <DropdownMenuRadioItem
                    key={t}
                    value={t}
                    className="focus:bg-neon-purple/10 focus:text-neon-purple cursor-pointer font-mono text-xs"
                  >
                    {t}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Salary Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "bg-card/50 border-border text-muted-foreground hover:text-neon-lime hover:border-neon-lime/50 hover:bg-neon-lime/5 rounded-none h-8 md:h-10 text-xs md:text-sm gap-2 transition-all",
                  (salaryMin || 0) > 0 &&
                  "text-neon-lime border-neon-lime bg-neon-lime/10 shadow-[0_0_10px_var(--neon-lime)]"
                )}
              >
                <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                {(salaryMin || 0) > 0
                  ? `> RM ${(salaryMin || 0).toLocaleString()}`
                  : "Salary"}
                {(salaryMin || 0) > 0 ? (
                  <div
                    role="button"
                    className="ml-1 rounded-full p-0.5 hover:bg-neon-lime/20"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSalaryMin(null);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </div>
                ) : (
                  <ChevronDown className="w-3 h-3 opacity-50 ml-1" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-popover border-neon-lime/20 text-popover-foreground rounded-none shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              align="start"
            >
              <DropdownMenuLabel className="text-neon-lime font-mono text-xs uppercase tracking-wider">
                Minimum Salary
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neon-lime/20" />
              <DropdownMenuRadioGroup
                value={(salaryMin || 0).toString()}
                onValueChange={(v) => setSalaryMin(parseInt(v) || null)}
              >
                {SALARY_RANGE_OPTIONS.map((opt) => (
                  <DropdownMenuRadioItem
                    key={opt.value}
                    value={opt.value.toString()}
                    className="focus:bg-neon-lime/10 focus:text-neon-lime cursor-pointer font-mono text-xs"
                  >
                    {opt.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
