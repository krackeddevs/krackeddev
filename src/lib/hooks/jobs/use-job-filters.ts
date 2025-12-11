import { useQuery } from "@tanstack/react-query";

interface JobFiltersData {
  locations: string[];
  types: string[];
}

export function useJobFilters() {
  return useQuery({
    queryKey: ["job-filters"],
    queryFn: async () => {
      const res = await fetch("/api/jobs/filters");
      if (!res.ok) {
        throw new Error("Failed to fetch job filters");
      }
      return res.json() as Promise<JobFiltersData>;
    },
    // Cache for a long time since these don't change often
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
