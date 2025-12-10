"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Job } from "@/lib/hooks/jobs/use-jobs";
import { formatDistanceToNow } from "date-fns";

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="font-medium text-white">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <div className="text-white">{row.getValue("company")}</div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="text-white">{row.getValue("location")}</div>
    ),
  },
  {
    accessorKey: "employmentType",
    header: "Employment Type",
    cell: ({ row }) => (
      <div className="text-white">{row.getValue("employmentType")}</div>
    ),
  },
  {
    id: "salary",
    header: "Salary (MYR)",
    cell: ({ row }) => {
      const min = row.original.salaryMin;
      const max = row.original.salaryMax;

      if (!min && !max)
        return <div className="text-white min-w-[200px]">-</div>;

      const format = (num: number) => num.toLocaleString();

      if (min && max)
        return (
          <div className="text-white font-mono min-w-[200px]">
            {format(min)} - {format(max)}
          </div>
        );
      if (min)
        return (
          <div className="text-white font-mono min-w-[200px]">
            From {format(min)}
          </div>
        );
      if (max)
        return (
          <div className="text-white font-mono min-w-[200px]">
            Up to {format(max)}
          </div>
        );
    },
  },

  {
    accessorKey: "postedAt",
    header: "Posted At",
    cell: ({ row }) => {
      const date = row.getValue("postedAt") as string | null;
      if (!date) return <span className="text-gray-500">-</span>;
      return (
        <span className="text-white whitespace-nowrap">
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </span>
      );
    },
  },
];
