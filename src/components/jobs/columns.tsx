"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Job } from "@/lib/hooks/jobs/use-jobs";
import { formatDistanceToNow, differenceInHours } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const job = row.original;
      const isNew =
        job.postedAt &&
        differenceInHours(new Date(), new Date(job.postedAt)) < 48;

      return (
        <div className="flex flex-col gap-1">
          <div className="font-medium text-white group-hover:text-neon-cyan transition-colors">
            {job.title}
          </div>
          <div className="flex gap-2">
            {isNew && (
              <Badge
                variant="outline"
                className="text-[10px] h-4 px-1 border-neon-lime text-neon-lime"
              >
                NEW
              </Badge>
            )}
            {job.isRemote && (
              <Badge
                variant="outline"
                className="text-[10px] h-4 px-1 border-neon-purple text-neon-purple"
              >
                REMOTE
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 rounded-sm bg-white/10 border border-white/20">
            <AvatarImage
              src={job.companyLogo || undefined}
              alt={job.company}
              className="object-cover"
            />
            <AvatarFallback className="rounded-sm bg-black text-xs font-mono">
              {job.company.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-white font-mono text-xs">{job.company}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="text-gray-400 text-xs font-mono max-w-[150px] truncate" title={row.getValue("location")}>
        {row.getValue("location")}
      </div>
    ),
  },
  {
    accessorKey: "employmentType",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 rounded-sm font-mono text-[10px]">
        {row.getValue("employmentType")}
      </Badge>
    ),
  },
  {
    id: "salary",
    header: "Salary (MYR)",
    cell: ({ row }) => {
      const min = row.original.salaryMin;
      const max = row.original.salaryMax;

      if (!min && !max)
        return <div className="text-gray-600 font-mono text-xs">-</div>;

      const format = (num: number) => (num / 1000).toFixed(1) + "k";

      if (min && max)
        return (
          <div className="text-neon-lime font-mono text-xs">
            {format(min)} - {format(max)}
          </div>
        );
      if (min)
        return (
          <div className="text-neon-lime font-mono text-xs">
            &gt; {format(min)}
          </div>
        );
      if (max)
        return (
          <div className="text-neon-lime font-mono text-xs">
            &lt; {format(max)}
          </div>
        );
    },
  },

  {
    accessorKey: "postedAt",
    header: "Posted",
    cell: ({ row }) => {
      const date = row.getValue("postedAt") as string | null;
      if (!date) return <span className="text-gray-600">-</span>;
      return (
        <span className="text-gray-500 text-xs font-mono whitespace-nowrap">
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </span>
      );
    },
  },
];
