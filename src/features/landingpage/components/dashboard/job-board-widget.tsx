"use client";

import { useJobsPaginated } from "@/lib/hooks/jobs/use-jobs-paginated";
import { Briefcase, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export function JobBoardWidget() {
    const [search, setSearch] = useState("");
    const { data, isLoading } = useJobsPaginated({
        search: search,
        page: 1,
        limit: 3,
    });

    const featuredJobs = data?.data?.slice(0, 2) ?? [];

    return (
        <div className="bg-card/40 border border-border/30 rounded-sm p-6 flex flex-col h-full backdrop-blur-sm">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2 text-[var(--neon-primary)]">
                    <Briefcase className="w-5 h-5" />
                    <h2 className="text-xl font-mono font-bold uppercase tracking-tighter">JOB BOARD</h2>
                </div>
                <p className="text-[10px] font-mono text-foreground/70 leading-relaxed">
                    Find your next role in the Malaysian tech ecosystem. Curated opportunities for developers, by developers.
                </p>
            </div>

            <div className="relative mb-8 group">
                <Input
                    placeholder="Frontend Engineer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-background border-border/30 h-10 font-mono text-xs text-foreground placeholder:text-foreground/50 focus-visible:ring-[var(--neon-primary)] focus-visible:border-[var(--neon-primary)] rounded-sm pr-10"
                />
                <div className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center bg-[var(--neon-primary)]/10 border-l border-border/30 group-hover:bg-[var(--neon-primary)] transition-colors">
                    <Search className="w-4 h-4 text-[var(--neon-primary)] group-hover:text-background" />
                </div>
            </div>

            <div className="flex-grow space-y-4">
                {isLoading ? (
                    [...Array(2)].map((_, i) => (
                        <div key={i} className="h-16 w-full bg-[var(--neon-primary)]/5 animate-pulse rounded-sm" />
                    ))
                ) : featuredJobs.length > 0 ? (
                    featuredJobs.map((job) => (
                        <Link
                            key={job.id}
                            href={`/jobs/${job.id}`}
                            className="block p-3 border border-border/10 rounded-sm bg-background/50 hover:border-[var(--neon-primary)]/30 hover:bg-background transition-all shadow-sm"
                        >
                            <h4 className="text-xs font-mono font-bold text-foreground line-clamp-1">{job.title}</h4>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-[9px] font-mono text-foreground/60 uppercase">{job.company}</span>
                                <span className="text-[9px] font-mono text-[var(--neon-primary)] font-bold">{job.location}</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-[10px] font-mono text-center text-foreground/50 italic py-8 uppercase tracking-widest">
                        [ SCANNING FOR NEW OPPORTUNITIES... ]
                    </p>
                )}
            </div>

            <div className="mt-auto pt-6">
                <Button
                    asChild
                    className="w-full bg-[var(--neon-primary)] text-background hover:bg-[var(--neon-secondary)] text-xs font-mono font-bold uppercase tracking-widest h-12 rounded-sm border-none shadow-sm"
                >
                    <Link href="/jobs">
                        VIEW JOB BOARD <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
