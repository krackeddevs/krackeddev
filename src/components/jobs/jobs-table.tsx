"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useJobs } from "@/lib/hooks/jobs/use-jobs";
import { columns } from "./columns";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { jobSearchParams } from "@/lib/search-params";
import { differenceInHours } from "date-fns";

export function JobsTable() {
  const router = useRouter();
  const [filters] = useQueryStates(jobSearchParams);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useJobs({
      search: filters.search || "",
      location: filters.location || "",
      type: filters.type || "",
      salaryMin: filters.salaryMin || 0,
    });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Flatten the pages into a single array of jobs
  const flatData = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="text-white font-mono animate-pulse">Loading jobs...</div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block w-full border border-white/10 rounded-none bg-black/40 backdrop-blur-sm">
        <div className="w-full">
          <table className="w-full font-mono text-sm text-left">
            <thead className="text-gray-400 bg-white/5 border-b border-white/10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 font-semibold text-neon-cyan/80 text-xs uppercase tracking-wider border-r border-white/5 last:border-r-0"
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
            <tbody className="divide-y divide-white/5">
              {/* TODO: Add empty state */}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-gray-500 font-mono"
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
                      className="px-6 py-4 border-r border-white/5 last:border-r-0 align-middle"
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
        {flatData.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 py-12 border border-dashed border-white/10 rounded-sm font-mono text-sm">
            No signals detected.
          </div>
        )}
        {flatData.map((job, i) => {
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
              className="group border border-white/10 p-5 space-y-4 bg-black/60 cursor-pointer hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all relative overflow-hidden"
            >
              {/* Active Glitch Border (Pseudo-element alternative) */}
              <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-white font-semibold text-lg leading-tight mb-1 group-hover:text-neon-cyan transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    {job.companyLogo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={job.companyLogo} alt={job.company} className="w-5 h-5 rounded-sm object-cover bg-white/10" />
                    )}
                    <p className="text-gray-400 text-sm font-mono">{job.company}</p>
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

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div className="flex flex-col gap-1 text-xs font-mono">
                  <span className="text-gray-500">Salary (MYR)</span>
                  <span className="text-neon-lime">{formatSalary()}</span>
                </div>
                <div className="flex flex-col gap-1 text-xs font-mono">
                  <span className="text-gray-500">Location</span>
                  <span className="text-gray-300 truncate">{job.location}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Infinite Scroll Trigger */}
      <div
        ref={ref}
        className="py-4 text-center text-gray-500 font-mono text-xs uppercase tracking-widest"
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
            ? "Scroll for more"
            : "End of results"}
      </div>
    </div>
  );
}
