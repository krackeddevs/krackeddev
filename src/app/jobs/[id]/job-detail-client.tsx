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
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { ApplicationModal } from "@/features/jobs/components/application-modal";

export default function JobDetailClient({ id }: { id: string }) {
  const { data: job, isLoading, error } = useJob(id);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
        <div className="text-white font-mono animate-pulse">
          Loading job details...
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex flex-col items-center justify-center space-y-4">
        <div className="text-red-500 font-mono">
          Job not found or failed to load.
        </div>
        <Link href="/jobs">
          <Button
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>
    );
  }

  const formatSalary = () => {
    const min = job.salaryMin;
    const max = job.salaryMax;
    const format = (num: number) => num.toLocaleString();

    if (!min && !max) return "Not disclosed";
    if (min && max) return `MYR ${format(min)} - ${format(max)}`;
    if (min) return `From MYR ${format(min)}`;
    if (max) return `Up to MYR ${format(max)}`;
    return "Not disclosed";
  };

  return (
    <main className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/jobs"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors font-mono text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>

          <div className="space-y-6">
            <div className="space-y-6">
              <h1 className="text-2xl md:text-4xl font-bold font-mono text-white tracking-tight">
                {job.title}
              </h1>
              {job.companySlug ? (
                <Link
                  href={`/companies/${job.companySlug}`}
                  className="text-xl text-gray-300 hover:text-white transition-colors font-mono"
                >
                  {job.company} →
                </Link>
              ) : (
                <div className="text-xl text-gray-300 font-mono">
                  {job.company}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-y border-white/10 py-6">
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="font-mono">{job.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <span className="font-mono">
                  {job.employmentType || "Full-time"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <span className="font-mono">{formatSalary()}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="font-mono">
                  Posted{" "}
                  {job.postedAt
                    ? format(new Date(job.postedAt), "MMM d, yyyy")
                    : "Recently"}
                </span>
              </div>
            </div>

            <div className="pt-6">
              {job.applicationMethod === "email" ? (
                <Button
                  className="bg-white text-black hover:bg-gray-200 h-10 px-6 font-mono rounded-none text-sm"
                  onClick={() =>
                    (window.location.href = `mailto:${job.applicationUrl}`)
                  }
                >
                  Apply via Email
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              ) : job.applicationMethod === "internal_form" ? (
                <>
                  <Button
                    className="bg-white text-black hover:bg-gray-200 h-10 px-6 font-mono rounded-none text-sm"
                    onClick={() => setIsApplyModalOpen(true)}
                  >
                    Apply Now
                    <Briefcase className="w-3 h-3 ml-2" />
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
                  className="bg-white text-black hover:bg-gray-200 h-10 px-6 font-mono rounded-none text-sm"
                  onClick={() =>
                    window.open(job.applicationUrl || job.sourceUrl!, "_blank")
                  }
                >
                  Apply Now
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              ) : null}
            </div>

            <div className="space-y-6 py-8">
              <h2 className="text-2xl font-bold font-mono text-white">
                Job Description
              </h2>
              <div
                className="prose prose-invert max-w-none font-sans text-gray-300 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
