import { z } from "zod";

// ============================================
// VERIFICATION REQUEST SCHEMAS (5-Step Wizard)
// ============================================

// Step 1: Business Documents
export const verificationStep1Schema = z.object({
    businessRegistrationNumber: z
        .string()
        .min(1, "Business registration number is required")
        .max(100, "Registration number too long"),
    taxId: z.string().max(100, "Tax ID too long").optional(),
});

export type VerificationStep1Input = z.infer<typeof verificationStep1Schema>;

// Step 2: Email Verification
export const verificationStep2EmailSchema = z.object({
    verificationEmail: z
        .string()
        .email("Invalid email address")
        .refine(
            (email) => {
                // Reject common free email providers
                const freeProviders = [
                    "gmail.com",
                    "yahoo.com",
                    "hotmail.com",
                    "outlook.com",
                    "live.com",
                ];
                const domain = email.split("@")[1]?.toLowerCase();
                return !freeProviders.includes(domain);
            },
            {
                message:
                    "Please use your company email address, not a personal email",
            }
        ),
});

export const verificationStep2CodeSchema = z.object({
    verificationCode: z
        .string()
        .length(6, "Verification code must be 6 digits")
        .regex(/^\d{6}$/, "Verification code must contain only numbers"),
});

export type VerificationStep2EmailInput = z.infer<
    typeof verificationStep2EmailSchema
>;
export type VerificationStep2CodeInput = z.infer<
    typeof verificationStep2CodeSchema
>;

// Step 3: Contact Details
export const verificationStep3Schema = z.object({
    requesterName: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name too long"),
    requesterTitle: z
        .string()
        .min(2, "Job title must be at least 2 characters")
        .max(100, "Job title too long"),
    requesterPhone: z
        .string()
        .min(8, "Phone number must be at least 8 digits")
        .max(20, "Phone number too long")
        .regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number format"),
});

export type VerificationStep3Input = z.infer<typeof verificationStep3Schema>;

// Step 4: Additional Context
export const verificationStep4Schema = z.object({
    reason: z
        .string()
        .min(50, "Please provide at least 50 characters explaining why you want verification")
        .max(1000, "Reason too long (max 1000 characters)"),
    expectedJobCount: z.enum(["1-5", "5-10", "10+"], {
        message: "Please select expected number of job postings",
    }),
});

export type VerificationStep4Input = z.infer<typeof verificationStep4Schema>;

// Step 5: Review & Submit (confirmation only)
export const verificationStep5Schema = z.object({
    confirmAccuracy: z.boolean().refine((val) => val === true, {
        message: "You must confirm that all information is accurate",
    }),
});

export type VerificationStep5Input = z.infer<typeof verificationStep5Schema>;

// Combined schema for full verification request
export const fullVerificationRequestSchema = verificationStep1Schema
    .merge(verificationStep2EmailSchema)
    .merge(verificationStep2CodeSchema)
    .merge(verificationStep3Schema)
    .merge(verificationStep4Schema)
    .extend({
        companyId: z.string().uuid(),
        requestedBy: z.string().uuid(),
        registrationDocumentUrl: z.string().optional(), // Set after upload
    });

export type FullVerificationRequestInput = z.infer<
    typeof fullVerificationRequestSchema
>;

// ============================================
// ADMIN REVIEW SCHEMAS
// ============================================

export const approveVerificationSchema = z.object({
    requestId: z.string().uuid(),
    adminNotes: z.string().max(1000, "Admin notes too long").optional(),
});

export type ApproveVerificationInput = z.infer<
    typeof approveVerificationSchema
>;

export const rejectVerificationSchema = z.object({
    requestId: z.string().uuid(),
    rejectionReason: z
        .string()
        .min(10, "Please provide a reason for rejection (min 10 characters)")
        .max(1000, "Rejection reason too long"),
    adminNotes: z.string().max(1000, "Admin notes too long").optional(),
});

export type RejectVerificationInput = z.infer<
    typeof rejectVerificationSchema
>;

export const requestMoreInfoSchema = z.object({
    requestId: z.string().uuid(),
    message: z
        .string()
        .min(10, "Please provide details about what information is needed")
        .max(1000, "Message too long"),
});

export type RequestMoreInfoInput = z.infer<typeof requestMoreInfoSchema>;

// ============================================
// VERIFICATION REQUEST STATUS TYPE
// ============================================

export type VerificationRequestStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "needs_info";
