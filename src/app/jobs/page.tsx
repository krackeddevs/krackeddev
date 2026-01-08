"use client";

import React, { useState, useEffect } from "react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { jobSearchParams } from "@/lib/search-params";
import { JobStatsBar } from "@/features/jobs/components/job-stats-bar";
import { JobSidebar } from "@/features/jobs/components/job-sidebar";
import { JobsTable } from "@/components/jobs/jobs-table";
import { fetchJobStats } from "@/features/jobs/actions";
import { useJobFilters } from "@/lib/hooks/jobs/use-job-filters";
import type { JobStats, JobFilters } from "@/features/jobs/types";
import { Target, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Suspense } from "react";

function JobsContent() {
  const [stats, setStats] = useState<JobStats | null>(null);
  const { data: filterData } = useJobFilters();

  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    location: parseAsString.withDefault(""),
    type: parseAsString.withDefault(""),
    salaryMin: parseAsInteger.withDefault(0),
    page: parseAsInteger.withDefault(1),
  });

  useEffect(() => {
    fetchJobStats().then(res => {
      if (res?.data) setStats(res.data);
    });
  }, []);

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters({
      ...newFilters,
      page: 1, // Reset to page 1 on filter change
    });
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center text-[10px] font-mono text-muted-foreground hover:text-[var(--neon-cyan)] transition-colors uppercase tracking-[0.2em] group">
            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
            Return to Terminal
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-12 w-1.5 bg-[var(--neon-cyan)] shadow-[0_0_15px_var(--neon-cyan)]" />
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-mono tracking-tighter text-foreground uppercase italic">
                Contract <span className="text-transparent border-text border-cyan-700 dark:border-[var(--neon-cyan)]" style={{ WebkitTextStroke: '1px currentColor' }}>Ops</span>
              </h1>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.3em] mt-1 pl-1">
                  // Sector: Malaysian Tech Ecosystem
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button
            asChild
            className="bg-transparent border border-[var(--neon-cyan)]/50 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)] hover:text-black font-mono text-[10px] uppercase tracking-widest h-10 px-6 rounded-none shadow-[0_0_15px_var(--neon-cyan)/10] transition-all"
          >
            <Link href="/hire/register">Broadcast Contract Signal</Link>
          </Button>
          <div className="text-[9px] font-mono text-muted-foreground/30 uppercase tracking-widest">Authorized Access Only</div>
        </div>
      </div>

      {/* Stats Bar */}
      {stats && <JobStatsBar stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content (9 Columns) */}
        <div className="lg:col-span-9 space-y-6">
          <JobsTable />
        </div>

        {/* Sidebar (3 Columns) */}
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-24">
            <JobSidebar
              filters={{
                search: filters.search,
                location: filters.location,
                type: filters.type,
                salaryMin: filters.salaryMin
              }}
              onFiltersChange={handleFiltersChange}
              availableTypes={filterData?.types || []}
            />

            {/* Additional Sidebar Info */}
            <div className="mt-8 p-4 border border-border/10 bg-muted/5 font-mono">
              <div className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] mb-4">// Verification Status</div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold font-mono text-green-700 dark:text-[var(--neon-lime)] tracking-tighter">
                    <div className="w-2 h-2 rounded-full bg-[var(--neon-lime)] animate-pulse" />
                  </div>
                  <span className="text-[10px] text-foreground/80 uppercase">System Online</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  All contracts are periodically verified for active recruitment status. Report invalid signals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function JobsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-background selection:bg-[var(--neon-cyan)]/30">
      <div className="container mx-auto px-4">
        <Suspense fallback={<div className="font-mono text-xs uppercase tracking-widest animate-pulse">Establishing Connection...</div>}>
          <JobsContent />
        </Suspense>
      </div>
    </main>
  );
}
