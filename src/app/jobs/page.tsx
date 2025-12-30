"use client";

import { Suspense } from "react";
import { JobsTable } from "@/components/jobs/jobs-table";
import { JobsFilter } from "@/components/jobs/jobs-filter";

function JobsFilterSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="h-10 w-full max-w-sm bg-muted animate-pulse" />
        <div className="h-10 w-24 bg-muted animate-pulse" />
      </div>
      <div className="flex gap-4">
        <div className="h-10 w-32 bg-muted animate-pulse" />
        <div className="h-10 w-32 bg-muted animate-pulse" />
        <div className="h-10 w-32 bg-muted animate-pulse" />
      </div>
    </div>
  );
}

function JobsTableSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-muted animate-pulse border border-border" />
      ))}
    </div>
  );
}

export default function JobsPage() {
  return (
    <main className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-foreground tracking-tight">
            Job Board
          </h1>
          <p className="text-muted-foreground font-mono text-lg max-w-2xl">
            Find your next role in the Malaysian tech ecosystem.
            <br className="hidden md:block" />
            Curated opportunities for developers, by developers.
          </p>
        </div>

        <Suspense fallback={<JobsFilterSkeleton />}>
          <JobsFilter />
        </Suspense>

        <Suspense fallback={<JobsTableSkeleton />}>
          <JobsTable />
        </Suspense>
      </div>
    </main>
  );
}
