"use client";

import { useJob } from "@/lib/hooks/jobs/use-job";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Building,
  ExternalLink,
  ShieldCheck,
  Globe
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { ApplicationModal } from "@/features/jobs/components/application-modal";
import { cn } from "@/lib/utils";

export default function JobDetailClient({ id }: { id: string }) {
  const { data: job, isLoading, error } = useJob(id);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-background">
        <div className="text-[var(--neon-cyan)] font-mono animate-pulse tracking-widest uppercase">
          Initializing Stream...
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex flex-col items-center justify-center space-y-6 bg-background">
        <div className="text-destructive font-mono uppercase tracking-widest text-sm border border-destructive/30 p-4 bg-destructive/5">
          Error: Signal Lost or Invalid ID
        </div>
        <Link href="/jobs">
          <Button
            variant="outline"
            className="text-foreground border-border/20 hover:border-[var(--neon-cyan)]/50 hover:bg-[var(--neon-cyan)]/5 font-mono text-xs uppercase tracking-widest h-10 px-6 rounded-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Ops
          </Button>
        </Link>
      </div>
    );
  }

  const formatSalary = () => {
    const min = job.salaryMin;
    const max = job.salaryMax;
    const formatValue = (num: number) => num.toLocaleString();

    if (!min && !max) return "Competitive";
    if (min && max) return `RM ${formatValue(min)} - ${formatValue(max)}`;
    if (min) return `From RM ${formatValue(min)}`;
    if (max) return `Up to RM ${formatValue(max)}`;
    return "Competitive";
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Link */}
        <Link
          href="/jobs"
          className="inline-flex items-center text-muted-foreground hover:text-[var(--neon-cyan)] transition-colors font-mono text-[10px] uppercase tracking-[0.2em] mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Contract Ops
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-[10px] px-2 py-0.5 border border-[var(--neon-cyan)]/50 text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/5 font-mono font-bold uppercase tracking-widest">
                    SIGNAL ID: {id.slice(0, 8)}
                  </div>
                  {job.isRemote && (
                    <div className="text-[10px] px-2 py-0.5 border border-[var(--neon-purple)]/50 text-[var(--neon-purple)] bg-[var(--neon-purple)]/5 font-mono font-bold uppercase tracking-widest">
                      REMOTE OK
                    </div>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tighter text-foreground uppercase italic leading-none">
                  {job.title}
                </h1>
              </div>

              <div className="flex items-center gap-4 py-4 border-y border-border/10">
                <div className="w-16 h-16 border border-border/20 bg-muted/20 flex items-center justify-center p-2">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <Building className="w-8 h-8 text-muted-foreground/30" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono text-muted-foreground uppercase">// Dispatched by</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono tracking-tight uppercase text-foreground/90">{job.company}</span>
                    <ShieldCheck className="w-4 h-4 text-[var(--neon-lime)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/10 border border-border/10 p-6">
              <div className="space-y-1">
                <div className="text-[9px] font-mono text-muted-foreground uppercase opacity-50 tracking-widest">Location</div>
                <div className="text-xs font-mono text-foreground font-bold uppercase truncate">{job.location}</div>
              </div>
              <div className="space-y-1 border-l border-border/10 pl-4">
                <div className="text-[9px] font-mono text-muted-foreground uppercase opacity-50 tracking-widest">Protocol</div>
                <div className="text-xs font-mono text-foreground font-bold uppercase">{job.employmentType || "CONTRACT"}</div>
              </div>
              <div className="space-y-1 border-l border-border/10 pl-4">
                <div className="text-[9px] font-mono text-muted-foreground uppercase opacity-50 tracking-widest">Reward</div>
                <div className="text-xs font-mono text-[var(--neon-lime)] font-bold uppercase">{formatSalary()}</div>
              </div>
              <div className="space-y-1 border-l border-border/10 pl-4">
                <div className="text-[9px] font-mono text-muted-foreground uppercase opacity-50 tracking-widest">Dispatched</div>
                <div className="text-xs font-mono text-foreground font-bold uppercase">
                  {job.postedAt ? format(new Date(job.postedAt), "dd/MM/yy") : "--/--/--"}
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-8 py-4">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-mono font-black uppercase tracking-[0.4em] text-foreground">Mission Intel</h2>
                <div className="h-px flex-grow bg-border/10" />
              </div>
              <div
                className="prose prose-invert max-w-none font-mono text-sm text-foreground/70 leading-relaxed whitespace-pre-line selection:bg-[var(--neon-cyan)]/30
                prose-headings:font-mono prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-[var(--neon-cyan)]
                prose-strong:text-foreground prose-strong:font-bold prose-ul:list-square"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>
          </div>

          {/* Sidebar / Action Area */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-muted/5 border border-border/10 p-8 space-y-8 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest text-center px-4">
                     // Initiative Status: Recruiting
                </div>

                {job.applicationMethod === "email" ? (
                  <Button
                    className="w-full bg-[var(--neon-cyan)] text-black hover:bg-[var(--neon-cyan)]/90 h-14 font-mono font-bold uppercase tracking-[0.21em] rounded-none shadow-[0_0_20px_var(--neon-cyan)/20]"
                    onClick={() => (window.location.href = `mailto:${job.applicationUrl}`)}
                  >
                    Dispatch Email
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                ) : job.applicationMethod === "internal_form" ? (
                  <>
                    <Button
                      className="w-full bg-[var(--neon-cyan)] text-black hover:bg-[var(--neon-cyan)]/90 h-14 font-mono font-bold uppercase tracking-[0.21em] rounded-none shadow-[0_0_20px_var(--neon-cyan)/20]"
                      onClick={() => setIsApplyModalOpen(true)}
                    >
                      Initiate Application
                      <Briefcase className="w-4 h-4 ml-2" />
                    </Button>
                    <ApplicationModal
                      isOpen={isApplyModalOpen}
                      onClose={() => setIsApplyModalOpen(false)}
                      jobId={job.id}
                      jobTitle={job.title}
                      companyName={job.company}
                    />
                  </>
                ) : (job.applicationUrl || job.sourceUrl) ? (
                  <Button
                    className="w-full bg-[var(--neon-cyan)] text-black hover:bg-[var(--neon-cyan)]/90 h-14 font-mono font-bold uppercase tracking-[0.21em] rounded-none shadow-[0_0_20px_var(--neon-cyan)/20]"
                    onClick={() => window.open(job.applicationUrl || job.sourceUrl!, "_blank")}
                  >
                    External Redirect
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                ) : null}
              </div>

              <div className="space-y-6 pt-6 border-t border-border/10">
                {job.companySlug && (
                  <Link
                    href={`/companies/${job.companySlug}`}
                    className="flex items-center justify-between text-[11px] font-mono text-muted-foreground hover:text-[var(--neon-cyan)] transition-colors uppercase tracking-widest group"
                  >
                    <span>View Org Profile</span>
                    <Building className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                  </Link>
                )}
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase tracking-widest opacity-50">
                  <span>Signal Grade</span>
                  <span className="text-[var(--neon-lime)] font-bold">A+ VERIFIED</span>
                </div>
              </div>

              <div className="pt-4 p-4 border border-dashed border-border/20 text-center">
                <p className="text-[9px] font-mono text-muted-foreground/50 leading-relaxed uppercase tracking-wider">
                  This signal is monitored by Kracked Devs. Secure communication protocols are in effect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
