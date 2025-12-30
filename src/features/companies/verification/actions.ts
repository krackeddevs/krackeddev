"use server";

import { db } from "@/lib/db";
import { companyVerificationRequests, companies, profiles } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, and, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
    verificationStep2EmailSchema,
    verificationStep2CodeSchema,
    fullVerificationRequestSchema,
} from "./schemas";
import type {
    SendVerificationCodeResponse,
    VerifyCodeResponse,
    SubmitVerificationResponse,
    CompanyVerificationRequest,
} from "./types";

// ============================================
// HELPER: Generate 6-digit verification code
// ============================================
function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ============================================
// HELPER: Validate email domain matches company website
// ============================================
async function validateEmailDomain(
    email: string,
    companyId: string
): Promise<{ valid: boolean; message?: string }> {
    const company = await db.query.companies.findFirst({
        where: eq(companies.id, companyId),
        columns: { websiteUrl: true },
    });

    if (!company?.websiteUrl) {
        return {
            valid: false,
            message: "Company website URL not found. Please update your company profile first.",
        };
    }

    try {
        const emailDomain = email.split("@")[1]?.toLowerCase();
        const websiteDomain = new URL(company.websiteUrl).hostname
            .replace("www.", "")
            .toLowerCase();

        if (emailDomain !== websiteDomain) {
            return {
                valid: false,
                message: `Email domain (${emailDomain}) does not match company website (${websiteDomain}). Please use your company email.`,
            };
        }

        return { valid: true };
    } catch (error) {
        return {
            valid: false,
            message: "Invalid company website URL format.",
        };
    }
}

// ============================================
// ACTION: Send Verification Code
// ============================================
export async function sendVerificationCode(
    email: string,
    companyId: string
): Promise<SendVerificationCodeResponse> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, message: "Unauthorized" };
        }

        // Validate input
        const validation = verificationStep2EmailSchema.safeParse({
            verificationEmail: email,
        });
        if (!validation.success) {
            return {
                success: false,
                message: validation.error.issues[0]?.message || "Invalid email",
            };
        }

        // Validate email domain matches company website
        const domainCheck = await validateEmailDomain(email, companyId);
        if (!domainCheck.valid) {
            return { success: false, message: domainCheck.message! };
        }

        // Generate code and expiry (15 minutes)
        const code = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Check for existing pending request
        const existingRequest = await db.query.companyVerificationRequests.findFirst({
            where: and(
                eq(companyVerificationRequests.companyId, companyId),
                or(
                    eq(companyVerificationRequests.status, "pending"),
                    eq(companyVerificationRequests.status, "needs_info")
                )
            ),
        });

        if (existingRequest) {
            // Update existing request with new code
            await db
                .update(companyVerificationRequests)
                .set({
                    verificationEmail: email,
                    verificationCode: code,
                    codeExpiresAt: expiresAt,
                    emailVerified: false,
                    updatedAt: new Date(),
                })
                .where(eq(companyVerificationRequests.id, existingRequest.id));
        } else {
            // Create temporary request to store verification code
            await db.insert(companyVerificationRequests).values({
                companyId,
                requestedBy: user.id,
                verificationEmail: email,
                verificationCode: code,
                codeExpiresAt: expiresAt,
                emailVerified: false,
                // Temporary placeholders (will be filled in final submission)
                businessRegistrationNumber: "PENDING",
                requesterName: "PENDING",
                requesterTitle: "PENDING",
                requesterPhone: "PENDING",
                reason: "PENDING",
                expectedJobCount: "1-5",
                status: "pending",
            });
        }

        // TODO: Send email with verification code
        // For now, just log it to console
        console.log(`Verification code for ${email}: ${code}`);

        return {
            success: true,
            message: "Verification code sent to your email",
            // DEV MODE: Return code in response (remove in production)
            code: process.env.NODE_ENV === 'development' ? code : undefined,
            expiresAt: expiresAt.toISOString(),
        };
    } catch (error) {
        console.error("Error sending verification code:", error);
        return {
            success: false,
            message: "Failed to send verification code. Please try again.",
        };
    }
}

// ============================================
// ACTION: Verify Email Code
// ============================================
export async function verifyEmailCode(
    email: string,
    code: string,
    companyId: string
): Promise<VerifyCodeResponse> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, message: "Unauthorized", verified: false };
        }

        // Validate code format
        const validation = verificationStep2CodeSchema.safeParse({
            verificationCode: code,
        });
        if (!validation.success) {
            return {
                success: false,
                message: "Invalid code format",
                verified: false,
            };
        }

        // Find request with matching email and code
        const request = await db.query.companyVerificationRequests.findFirst({
            where: and(
                eq(companyVerificationRequests.companyId, companyId),
                eq(companyVerificationRequests.verificationEmail, email),
                eq(companyVerificationRequests.verificationCode, code)
            ),
        });

        if (!request) {
            return {
                success: false,
                message: "Invalid verification code",
                verified: false,
            };
        }

        // Check if code has expired
        if (request.codeExpiresAt && new Date() > new Date(request.codeExpiresAt)) {
            return {
                success: false,
                message: "Verification code has expired. Please request a new code.",
                verified: false,
            };
        }

        // Mark email as verified
        await db
            .update(companyVerificationRequests)
            .set({
                emailVerified: true,
                updatedAt: new Date(),
            })
            .where(eq(companyVerificationRequests.id, request.id));

        return {
            success: true,
            message: "Email verified successfully",
            verified: true,
        };
    } catch (error) {
        console.error("Error verifying code:", error);
        return {
            success: false,
            message: "Failed to verify code. Please try again.",
            verified: false,
        };
    }
}

// ============================================
// ACTION: Get Verification Request
// ============================================
export async function getVerificationRequest(
    companyId: string
): Promise<CompanyVerificationRequest | null> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        const request = await db.query.companyVerificationRequests.findFirst({
            where: and(
                eq(companyVerificationRequests.companyId, companyId),
                or(
                    eq(companyVerificationRequests.status, "pending"),
                    eq(companyVerificationRequests.status, "needs_info")
                )
            ),
            orderBy: (requests, { desc }) => [desc(requests.createdAt)],
        });

        return request || null;
    } catch (error) {
        console.error("Error fetching verification request:", error);
        return null;
    }
}

// ============================================
// ACTION: Submit Verification Request
// ============================================
export async function submitVerificationRequest(
    data: {
        companyId: string;
        businessRegistrationNumber: string;
        registrationDocumentUrl: string;
        taxId?: string;
        verificationEmail: string;
        requesterName: string;
        requesterTitle: string;
        requesterPhone: string;
        reason: string;
        expectedJobCount: "1-5" | "5-10" | "10+";
    }
): Promise<SubmitVerificationResponse> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, message: "Unauthorized" };
        }

        // Check for existing pending request
        const existingRequest = await db.query.companyVerificationRequests.findFirst({
            where: and(
                eq(companyVerificationRequests.companyId, data.companyId),
                or(
                    eq(companyVerificationRequests.status, "pending"),
                    eq(companyVerificationRequests.status, "needs_info")
                )
            ),
        });

        if (existingRequest && !existingRequest.emailVerified) {
            return {
                success: false,
                message: "Please verify your email before submitting the request.",
            };
        }

        if (existingRequest) {
            // Update existing request
            await db
                .update(companyVerificationRequests)
                .set({
                    businessRegistrationNumber: data.businessRegistrationNumber,
                    registrationDocumentUrl: data.registrationDocumentUrl,
                    taxId: data.taxId,
                    requesterName: data.requesterName,
                    requesterTitle: data.requesterTitle,
                    requesterPhone: data.requesterPhone,
                    reason: data.reason,
                    expectedJobCount: data.expectedJobCount,
                    status: "pending",
                    updatedAt: new Date(),
                })
                .where(eq(companyVerificationRequests.id, existingRequest.id));

            revalidatePath("/dashboard/company");
            return {
                success: true,
                message: "Verification request submitted successfully",
                requestId: existingRequest.id,
            };
        } else {
            // Create new request
            const [newRequest] = await db
                .insert(companyVerificationRequests)
                .values({
                    companyId: data.companyId,
                    requestedBy: user.id,
                    businessRegistrationNumber: data.businessRegistrationNumber,
                    registrationDocumentUrl: data.registrationDocumentUrl,
                    taxId: data.taxId,
                    verificationEmail: data.verificationEmail,
                    emailVerified: false, // Should have been verified in Step 2
                    requesterName: data.requesterName,
                    requesterTitle: data.requesterTitle,
                    requesterPhone: data.requesterPhone,
                    reason: data.reason,
                    expectedJobCount: data.expectedJobCount,
                    status: "pending",
                })
                .returning();

            revalidatePath("/dashboard/company");
            return {
                success: true,
                message: "Verification request submitted successfully",
                requestId: newRequest.id,
            };
        }
    } catch (error) {
        console.error("Error submitting verification request:", error);
        return {
            success: false,
            message: "Failed to submit verification request. Please try again.",
        };
    }
}
