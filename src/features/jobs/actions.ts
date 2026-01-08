"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { companies, jobApplications, jobs, profiles } from "@/lib/db/schema";
import { eq, and, count, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { JobStats } from "./types";

export type ApplicationInput = {
    jobId: string;
    resumeUrl: string;
    coverLetter?: string;
};

export async function fetchJobStats(): Promise<{ data: JobStats | null; error?: string }> {
    try {
        const [totalCount] = await db.select({ value: count() }).from(jobs).where(eq(jobs.isActive, true));
        const [remoteCount] = await db.select({ value: count() }).from(jobs).where(and(eq(jobs.isActive, true), eq(jobs.isRemote, true)));
        const [verifiedCompaniesCount] = await db.select({ value: count() }).from(companies).where(eq(companies.isVerified, true));

        // Count jobs from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const [newJobsCount] = await db.select({ value: count() }).from(jobs).where(and(eq(jobs.isActive, true), gte(jobs.postedAt, sevenDaysAgo)));

        return {
            data: {
                totalJobs: totalCount.value,
                remoteJobs: remoteCount.value,
                verifiedCompanies: verifiedCompaniesCount.value,
                newJobs: newJobsCount.value,
            }
        };
    } catch (error) {
        console.error("Error fetching job stats:", error);
        return { data: null, error: "Failed to fetch job stats" };
    }
}

export async function submitApplication(data: ApplicationInput) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to apply." };
    }

    try {
        // Check if already applied
        const existing = await db.query.jobApplications.findFirst({
            where: and(
                eq(jobApplications.jobId, data.jobId),
                eq(jobApplications.userId, user.id)
            )
        });

        if (existing) {
            return { error: "You have already applied to this job." };
        }

        // Insert application
        await db.insert(jobApplications).values({
            jobId: data.jobId,
            userId: user.id,
            resumeUrl: data.resumeUrl,
            coverLetter: data.coverLetter,
            status: "new",
        });

        revalidatePath("/dashboard/applications");
        revalidatePath(`/dashboard/company/applicants`); // Revalidate employer view too (approximated path)

        return { success: true };
    } catch (error) {
        console.error("Error submitting application:", error);
        return { error: "Failed to submit application. Please try again." };
    }
}

export async function getUserApplications() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    // Fetch applications with Job details
    const apps = await db.select({
        id: jobApplications.id,
        status: jobApplications.status,
        createdAt: jobApplications.createdAt,
        job: {
            id: jobs.id,
            title: jobs.title,
            company: jobs.company,
            companyLogo: jobs.companyLogo,
        }
    })
        .from(jobApplications)
        .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
        .where(eq(jobApplications.userId, user.id))
        .orderBy(jobApplications.createdAt);

    return { data: apps.reverse() };
}

export async function getCompanyApplications(companyId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const apps = await db.select({
        id: jobApplications.id,
        status: jobApplications.status,
        createdAt: jobApplications.createdAt,
        resumeUrl: jobApplications.resumeUrl,
        coverLetter: jobApplications.coverLetter,
        job: {
            id: jobs.id,
            title: jobs.title,
        },
        candidate: {
            id: profiles.id,
            fullName: profiles.fullName,
            username: profiles.username,
            avatarUrl: profiles.avatarUrl,
            email: profiles.email,
        }
    })
        .from(jobApplications)
        .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
        .innerJoin(profiles, eq(jobApplications.userId, profiles.id))
        .where(eq(jobs.companyId, companyId))
        .orderBy(jobApplications.createdAt);

    return { data: apps.reverse() };
}

export async function updateApplicationStatus(applicationId: string, status: string) {
    await db.update(jobApplications).set({ status }).where(eq(jobApplications.id, applicationId));
    revalidatePath("/dashboard/company/applicants");
    revalidatePath("/dashboard/applications");
}
