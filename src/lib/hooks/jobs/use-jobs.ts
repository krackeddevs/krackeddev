import { useInfiniteQuery } from "@tanstack/react-query";
import { InferSelectModel } from "drizzle-orm";
import { jobs } from "@/lib/db/schema";

export type Job = InferSelectModel<typeof jobs>;

interface UseJobsOptions {
  search?: string;
  location?: string;
  type?: string;
  salaryMin?: number;
}

export function useJobs(options: UseJobsOptions = {}) {
  return useInfiniteQuery({
    queryKey: ["jobs", options],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({
        limit: "10",
        cursor: pageParam.toString(),
      });

      if (options.search) params.append("search", options.search);
      if (options.location) params.append("location", options.location);
      if (options.type) params.append("type", options.type);
      if (options.salaryMin)
        params.append("salary_min", options.salaryMin.toString());

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }
      return res.json() as Promise<{
        data: Job[];
        nextCursor: number | null;
      }>;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });
}
