import { useQuery } from "@tanstack/react-query";
import { InferSelectModel } from "drizzle-orm";
import { jobs } from "@/lib/db/schema";

export type Job = InferSelectModel<typeof jobs>;

interface UseJobsPaginatedOptions {
    search?: string;
    location?: string;
    type?: string;
    salaryMin?: number;
    page?: number;
    limit?: number;
}

export function useJobsPaginated(options: UseJobsPaginatedOptions = {}) {
    const { page = 1, limit = 20, ...filters } = options;

    return useQuery({
        queryKey: ["jobs-paginated", options],
        queryFn: async () => {
            const params = new URLSearchParams({
                limit: limit.toString(),
                cursor: ((page - 1) * limit).toString(),
            });

            if (filters.search) params.append("search", filters.search);
            if (filters.location) params.append("location", filters.location);
            if (filters.type) params.append("type", filters.type);
            if (filters.salaryMin)
                params.append("salary_min", filters.salaryMin.toString());

            const res = await fetch(`/api/jobs?${params.toString()}`);
            if (!res.ok) {
                throw new Error("Failed to fetch jobs");
            }
            return res.json() as Promise<{
                data: Job[];
                nextCursor: number | null;
                total: number;
            }>;
        },
    });
}
