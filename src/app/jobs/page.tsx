"use client";

import { useState } from "react";
import { JobsFilter } from "@/components/jobs/jobs-filter";
import { JobsTable } from "@/components/jobs/jobs-table";

export default function JobsPage() {
  const [search, setSearch] = useState("");

  return (
    <main className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-5xl font-mono text-white font-bold tracking-tight">
            Find your next career destination
          </h1>
          <p className="text-gray-400 font-mono max-w-2xl text-sm md:text-lg">
            Explore the largest, most updated collections of tech jobs in
            Malaysia for you.
          </p>
        </div>

        {/* Filter Section */}
        <JobsFilter search={search} setSearch={setSearch} />

        {/* Table Section */}
        <JobsTable search={search} />
      </div>
    </main>
  );
}
