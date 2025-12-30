"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useJobs } from "@/lib/hooks/jobs/use-jobs";
import { columns } from "./columns";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { jobSearchParams } from "@/lib/search-params";
import { differenceInHours } from "date-fns";
import { Pagination } from "./pagination";

const JOBS_PER_PAGE = 20;

export function JobsTable() {
  const router = useRouter();
  const [filters] = useQueryStates(jobSearchParams);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useJobs({
      search: filters.search || "",
      location: filters.location || "",
      type: filters.type || "",
      salaryMin: filters.salaryMin || 0,
    });

  // Auto-load all pages on mount
  useEffect(() => {
    if (!isLoading && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  // Flatten all pages
  const allJobs = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  // Calculate pagination
  const totalPages = Math.ceil(allJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const currentJobs = allJobs.slice(startIndex, endIndex);

  const table = useReactTable({
    data: currentJobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="text-foreground font-mono animate-pulse">Loading jobs...</div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block w-full border border-border rounded-none bg-card/40 backdrop-blur-sm">
        <div className="w-full">
          <table className="w-full font-mono text-sm text-left">
            <thead className="text-muted-foreground bg-muted/50 border-b border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 font-semibold text-neon-cyan/80 text-xs uppercase tracking-wider border-r border-border last:border-r-0"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/50">
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-muted-foreground font-mono"
                  >
                    No signals detected in this sector. Try widening your search parameters.
                  </td>
                </tr>
              )}
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => router.push(`/jobs/${row.original.id}`)}
                  className="group hover:bg-neon-cyan/5 transition-all cursor-pointer border-l-2 border-transparent hover:border-neon-cyan"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 border-r border-border last:border-r-0 align-middle"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {currentJobs.length === 0 && !isLoading && (
          <div className="text-center text-muted-foreground py-12 border border-dashed border-border rounded-sm font-mono text-sm">
            No signals detected.
          </div>
        )}
        {currentJobs.map((job, i) => {
          const formatSalary = () => {
            const min = job.salaryMin;
            const max = job.salaryMax;
            const format = (num: number) => (num / 1000).toFixed(1) + "k";
            if (!min && !max) return "-";
            if (min && max) return `${format(min)} - ${format(max)}`;
            if (min) return `> ${format(min)}`;
            if (max) return `< ${format(max)}`;
            return "-";
          };

          const isNew =
            job.postedAt &&
            differenceInHours(new Date(), new Date(job.postedAt)) < 48;

          return (
            <div
              key={job.id || i}
              onClick={() => router.push(`/jobs/${job.id}`)}
              className="group border border-border p-5 space-y-4 bg-card/40 backdrop-blur-sm cursor-pointer hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all relative overflow-hidden"
            >
              {/* Active Glitch Border (Pseudo-element alternative) */}
              <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-foreground font-semibold text-lg leading-tight mb-1 group-hover:text-neon-cyan transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    {job.companyLogo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={job.companyLogo} alt={job.company} className="w-5 h-5 rounded-sm object-cover bg-muted" />
                    )}
                    <p className="text-muted-foreground text-sm font-mono">{job.company}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {isNew && (
                    <span className="text-[10px] px-1.5 py-0.5 border border-neon-lime text-neon-lime bg-neon-lime/10">NEW</span>
                  )}
                  {job.isRemote && (
                    <span className="text-[10px] px-1.5 py-0.5 border border-neon-purple text-neon-purple bg-neon-purple/10">REMOTE</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="flex flex-col gap-1 text-xs font-mono">
                  <span className="text-muted-foreground">Salary (MYR)</span>
                  <span className="text-neon-lime">{formatSalary()}</span>
                </div>
                <div className="flex flex-col gap-1 text-xs font-mono">
                  <span className="text-muted-foreground">Location</span>
                  <span className="text-foreground/80 truncate">{job.location}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {allJobs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
