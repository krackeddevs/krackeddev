import { InferSelectModel } from "drizzle-orm";
import { companyVerificationRequests } from "@/lib/db/schema";

// ============================================
// DATABASE TYPES
// ============================================

export type CompanyVerificationRequest = InferSelectModel<
    typeof companyVerificationRequests
>;

export type VerificationRequestWithCompany = CompanyVerificationRequest & {
    company: {
        id: string;
        name: string;
        logoUrl: string | null;
        websiteUrl: string | null;
    };
    requester: {
        id: string;
        username: string | null;
        email: string | null;
    };
};

export type VerificationRequestWithReviewer =
    VerificationRequestWithCompany & {
        reviewer: {
            id: string;
            username: string | null;
        } | null;
    };

// ============================================
// FORM DATA TYPES (for wizard state management)
// ============================================

export interface VerificationWizardData {
    // Step 1
    businessRegistrationNumber: string;
    registrationDocument: File | null;
    registrationDocumentUrl?: string;
    taxId?: string;

    // Step 2
    verificationEmail: string;
    emailVerified: boolean;
    verificationCode?: string;

    // Step 3
    requesterName: string;
    requesterTitle: string;
    requesterPhone: string;

    // Step 4
    reason: string;
    expectedJobCount: "1-5" | "5-10" | "10+";

    // Step 5
    confirmAccuracy: boolean;

    // Metadata
    currentStep: 1 | 2 | 3 | 4 | 5;
    companyId?: string;
    requestedBy?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface SendVerificationCodeResponse {
    success: boolean;
    message: string;
    code?: string; // DEV MODE: Only populated in development
    expiresAt?: string;
}

export interface VerifyCodeResponse {
    success: boolean;
    message: string;
    verified: boolean;
}

export interface SubmitVerificationResponse {
    success: boolean;
    message: string;
    requestId?: string;
}

export interface VerificationRequestListItem {
    id: string;
    companyName: string;
    companyLogo: string | null;
    requesterName: string;
    requesterEmail: string | null;
    status: "pending" | "approved" | "rejected" | "needs_info";
    createdAt: string;
    reviewedAt: string | null;
}
