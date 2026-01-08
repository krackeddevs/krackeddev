"use client";

import React from "react";
import { useJobsPaginated } from "@/lib/hooks/jobs/use-jobs-paginated";
import { useRouter } from "next/navigation";
import { useQueryStates, parseAsInteger } from "nuqs";
import { jobSearchParams } from "@/lib/search-params";
import { differenceInHours } from "date-fns";
import { Pagination } from "./pagination";
import { Briefcase, MapPin, DollarSign, Clock, Building2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const JOBS_PER_PAGE = 10; // Reduced for card view

export function JobsTable() {
  const router = useRouter();
  const [filters, setFilters] = useQueryStates({
    ...jobSearchParams,
    page: parseAsInteger.withDefault(1),
  });

  const { data, isLoading } = useJobsPaginated({
    search: filters.search || "",
    location: filters.location || "",
    type: filters.type || "",
    salaryMin: filters.salaryMin || 0,
    page: filters.page,
    limit: JOBS_PER_PAGE,
  });

  const jobs = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / JOBS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setFilters({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-muted/20 animate-pulse border border-border/10" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-border/10 bg-muted/5">
        <div className="flex flex-col items-center gap-4">
          <Briefcase className="w-8 h-8 text-muted-foreground/20" />
          <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
            No active contract signals detected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {jobs.map((job) => {
          const isNew = job.postedAt && differenceInHours(new Date(), new Date(job.postedAt)) < 48;

          const formatSalary = () => {
            const min = job.salaryMin;
            const max = job.salaryMax;
            const format = (num: number) => (num / 1000).toFixed(0) + "k";
            if (!min && !max) return "Competitive";
            if (min && max) return `RM ${format(min)} - ${format(max)}`;
            if (min) return `> RM ${format(min)}`;
            return "Competitive";
          };

          return (
            <div
              key={job.id}
              onClick={() => router.push(`/jobs/${job.id}`)}
              className="group relative bg-card/40 border border-border/20 p-6 hover:border-[var(--neon-cyan)]/50 hover:bg-muted/10 transition-all cursor-pointer overflow-hidden"
            >
              {/* Left Highlight */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--neon-cyan)] opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_var(--neon-cyan)]" />

              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex gap-5 flex-grow">
                  {/* Company Logo */}
                  <div className="shrink-0">
                    <div className="w-14 h-14 border border-border/20 bg-muted/20 flex items-center justify-center rounded-none overflow-hidden group-hover:border-[var(--neon-cyan)]/30 transition-colors">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-6 h-6 text-muted-foreground/40" />
                      )}
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold font-mono tracking-tighter group-hover:text-[var(--neon-cyan)] transition-colors truncate">
                        {job.title}
                      </h3>
                      {isNew && (
                        <span className="text-[9px] px-1.5 py-0.5 border border-neon-lime/50 text-neon-lime bg-neon-lime/5 font-mono font-bold uppercase tracking-wider">NEW</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[var(--neon-cyan)]/50" />
                        <span className="text-foreground/80 font-bold uppercase">{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/50" />
                        <span>{job.location}</span>
                      </div>
                      {job.isRemote && (
                        <div className="flex items-center gap-1.5 text-[var(--neon-purple)]">
                          <span className="w-1 h-1 rounded-full bg-[var(--neon-purple)]" />
                          <span>REMOTE</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side Stats */}
                <div className="flex flex-row md:flex-col justify-between items-end md:shrink-0 gap-2 border-t md:border-t-0 md:border-l border-border/10 pt-4 md:pt-0 md:pl-6">
                  <div className="text-right">
                    <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Estimated Value</div>
                    <div className="text-lg font-bold font-mono text-green-700 dark:text-[var(--neon-lime)] tracking-tighter">
                      {formatSalary()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 group-hover:text-[var(--neon-cyan)] transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
