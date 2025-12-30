import { useQuery } from "@tanstack/react-query";

// Basic type definition if not available
type JobType = typeof import("@/lib/db/schema").jobs.$inferSelect & {
  companySlug?: string | null;
};

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/${id}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch job");
      }
      return res.json() as Promise<JobType>;
    },
    enabled: !!id,
  });
}
