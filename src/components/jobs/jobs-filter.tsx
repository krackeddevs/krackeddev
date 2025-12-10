"use client";

import { Search, MapPin, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JobsFilterProps {
  search: string;
  setSearch: (value: string) => void;
  // We can expand these to open filter modals/popovers later
  // For now, let's keep them as visual placeholders or simple toggles if complexity allows
  // Given the screenshot, they look like dropdown triggers.
}

export function JobsFilter({ search, setSearch }: JobsFilterProps) {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Frontend Engineer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black border-white/20 text-white placeholder:text-gray-600 pl-4 h-12 rounded-none focus-visible:ring-0 focus-visible:border-white transition-colors"
          />
        </div>
        <Button
          className="bg-white text-black hover:bg-gray-200 h-12 rounded-none px-6 font-mono"
          variant="default"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 text-sm font-mono">
        <span className="text-gray-500">Filter by</span>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="bg-transparent border-white/20 text-gray-300 hover:text-white hover:border-white hover:bg-transparent rounded-none h-8 md:h-10 text-xs md:text-sm gap-2"
          >
            <MapPin className="w-3 h-3 md:w-4 md:h-4" />
            Locations
          </Button>

          <Button
            variant="outline"
            className="bg-transparent border-white/20 text-gray-300 hover:text-white hover:border-white hover:bg-transparent rounded-none h-8 md:h-10 text-xs md:text-sm gap-2"
          >
            <Briefcase className="w-3 h-3 md:w-4 md:h-4" />
            Employment Type
          </Button>

          <Button
            variant="outline"
            className="bg-transparent border-white/20 text-gray-300 hover:text-white hover:border-white hover:bg-transparent rounded-none h-8 md:h-10 text-xs md:text-sm gap-2"
          >
            <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
            Salary Range
          </Button>
        </div>
      </div>
    </div>
  );
}
