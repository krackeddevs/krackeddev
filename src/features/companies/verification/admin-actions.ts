"use server";

import { db } from "@/lib/db";
import { companyVerificationRequests, companies } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
    approveVerificationSchema,
    rejectVerificationSchema,
    requestMoreInfoSchema,
} from "./schemas";

// ============================================
// HELPER: Check if user is admin
// ============================================
async function isAdmin(): Promise<boolean> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const profile = await db.query.profiles.findFirst({
        where: (profiles, { eq }) => eq(profiles.id, user.id),
        columns: { role: true },
    });

    return profile?.role === "admin";
}

// ============================================
// ACTION: Approve Verification Request
// ============================================
export async function approveVerificationRequest(
    requestId: string,
    adminNotes?: string
): Promise<{ success: boolean; message: string }> {
    try {
        if (!(await isAdmin())) {
            return { success: false, message: "Unauthorized" };
        }

        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, message: "Unauthorized" };
        }

        // Validate input
        const validation = approveVerificationSchema.safeParse({
            requestId,
            adminNotes,
        });
        if (!validation.success) {
            return { success: false, message: "Invalid input" };
        }

        // Get request
        const request = await db.query.companyVerificationRequests.findFirst({
            where: eq(companyVerificationRequests.id, requestId),
        });

        if (!request) {
            return { success: false, message: "Verification request not found" };
        }

        // Update request status
        await db
            .update(companyVerificationRequests)
            .set({
                status: "approved",
                reviewedBy: user.id,
                reviewedAt: new Date(),
                adminNotes,
                updatedAt: new Date(),
            })
            .where(eq(companyVerificationRequests.id, requestId));

        // Update company verification status
        await db
            .update(companies)
            .set({
                isVerified: true,
                updatedAt: new Date(),
            })
            .where(eq(companies.id, request.companyId));

        // TODO: Send approval email notification to company

        revalidatePath("/admin/verifications");
        revalidatePath("/dashboard/company");
        revalidatePath(`/companies/${request.companyId}`);

        return {
            success: true,
            message: "Verification request approved successfully",
        };
    } catch (error) {
        console.error("Error approving verification request:", error);
        return {
            success: false,
            message: "Failed to approve verification request",
        };
    }
}

// ============================================
// ACTION: Reject Verification Request
// ============================================
export async function rejectVerificationRequest(
    requestId: string,
    rejectionReason: string,
    adminNotes?: string
): Promise<{ success: boolean; message: string }> {
    try {
        if (!(await isAdmin())) {
            return { success: false, message: "Unauthorized" };
        }

        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, message: "Unauthorized" };
        }

        // Validate input
        const validation = rejectVerificationSchema.safeParse({
            requestId,
            rejectionReason,
            adminNotes,
        });
        if (!validation.success) {
            return {
                success: false,
                message: validation.error.issues[0]?.message || "Invalid input",
            };
        }

        // Get request
        const request = await db.query.companyVerificationRequests.findFirst({
            where: eq(companyVerificationRequests.id, requestId),
        });

        if (!request) {
            return { success: false, message: "Verification request not found" };
        }

        // Update request status
        await db
            .update(companyVerificationRequests)
            .set({
                status: "rejected",
                reviewedBy: user.id,
                reviewedAt: new Date(),
                rejectionReason,
                adminNotes,
                updatedAt: new Date(),
            })
            .where(eq(companyVerificationRequests.id, requestId));

        // TODO: Send rejection email notification to company with reason

        revalidatePath("/admin/verifications");
        revalidatePath("/dashboard/company");

        return {
            success: true,
            message: "Verification request rejected",
        };
    } catch (error) {
        console.error("Error rejecting verification request:", error);
        return {
            success: false,
            message: "Failed to reject verification request",
        };
    }
}

// ============================================
// ACTION: Request More Info
// ============================================
export async function requestMoreInfoAction(
    requestId: string,
    message: string
): Promise<{ success: boolean; message: string }> {
    try {
        if (!(await isAdmin())) {
            return { success: false, message: "Unauthorized" };
        }

        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, message: "Unauthorized" };
        }

        // Validate input
        const validation = requestMoreInfoSchema.safeParse({
            requestId,
            message,
        });
        if (!validation.success) {
            return {
                success: false,
                message: validation.error.issues[0]?.message || "Invalid input",
            };
        }

        // Get request
        const request = await db.query.companyVerificationRequests.findFirst({
            where: eq(companyVerificationRequests.id, requestId),
        });

        if (!request) {
            return { success: false, message: "Verification request not found" };
        }

        // Update request status
        await db
            .update(companyVerificationRequests)
            .set({
                status: "needs_info",
                reviewedBy: user.id,
                reviewedAt: new Date(),
                adminNotes: message,
                updatedAt: new Date(),
            })
            .where(eq(companyVerificationRequests.id, requestId));

        // TODO: Send "needs info" email notification to company with message

        revalidatePath("/admin/verifications");
        revalidatePath("/dashboard/company");

        return {
            success: true,
            message: "Request for more information sent successfully",
        };
    } catch (error) {
        console.error("Error requesting more info:", error);
        return {
            success: false,
            message: "Failed to request more information",
        };
    }
}

// ============================================
// ACTION: Get All Verification Requests (Admin)
// ============================================
export async function getAllVerificationRequests(status?: string) {
    try {
        if (!(await isAdmin())) {
            return [];
        }

        const requests = await db.query.companyVerificationRequests.findMany({
            where: status
                ? eq(companyVerificationRequests.status, status)
                : undefined,
            with: {
                company: {
                    columns: {
                        id: true,
                        name: true,
                        logoUrl: true,
                        websiteUrl: true,
                    },
                },
                requester: {
                    columns: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
            orderBy: (requests, { desc }) => [desc(requests.createdAt)],
        });

        return requests;
    } catch (error) {
        console.error("Error fetching verification requests:", error);
        return [];
    }
}

// ============================================
// ACTION: Get Verification Request Detail (Admin)
// ============================================
export async function getVerificationRequestDetail(requestId: string) {
    try {
        if (!(await isAdmin())) {
            return null;
        }

        const request = await db.query.companyVerificationRequests.findFirst({
            where: eq(companyVerificationRequests.id, requestId),
            with: {
                company: {
                    columns: {
                        id: true,
                        name: true,
                        logoUrl: true,
                        websiteUrl: true,
                    },
                },
                requester: {
                    columns: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
                reviewer: {
                    columns: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        return request;
    } catch (error) {
        console.error("Error fetching verification request detail:", error);
        return null;
    }
}
