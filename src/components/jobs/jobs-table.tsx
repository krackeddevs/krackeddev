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

interface JobsTableProps {
  search: string;
}

export function JobsTable({ search }: JobsTableProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useJobs({ search });

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
      <div className="hidden md:block w-full border border-white/20">
        <div className="w-full">
          <table className="w-full font-mono text-sm text-left">
            <thead className="text-gray-400 bg-transparent border-b border-white/20">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 font-semibold text-white border-r border-white/20 last:border-r-0"
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
            <tbody>
              {/* TODO: Add empty state */}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No jobs found.
                  </td>
                </tr>
              )}
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 border-r border-white/10 last:border-r-0 align-middle"
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
          <div className="text-center text-gray-500 py-8 border border-white/20">
            No jobs found.
          </div>
        )}
        {flatData.map((job, i) => {
          const formatSalary = () => {
            const min = job.salaryMin;
            const max = job.salaryMax;
            const format = (num: number) => num.toLocaleString();
            if (!min && !max) return "-";
            if (min && max) return `${format(min)} - ${format(max)}`;
            if (min) return `From ${format(min)}`;
            if (max) return `Up to ${format(max)}`;
            return "-";
          };

          return (
            <div
              key={job.id || i}
              className="border border-white/20 p-5 space-y-3 bg-[#0A0A0A]"
            >
              <div>
                <h3 className="text-white font-semibold text-lg leading-tight mb-1">
                  {job.title}
                </h3>
                <p className="text-gray-400 text-sm">{job.company}</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-gray-500">Salary (MYR)</span>
                  <span className="text-white font-mono">{formatSalary()}</span>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-gray-500">Location</span>
                  <span className="text-gray-300">{job.location}</span>
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
