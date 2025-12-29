import { z } from "zod";

export const companyRegistrationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    website_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    size: z.string().min(1, "Please select a company size"),
});

export type CompanyRegistrationInput = z.infer<typeof companyRegistrationSchema>;

export const companyUpdateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().max(1000, "Description too long").optional(),
    website_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    linkedin_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    twitter_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    logo_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    industry: z.string().optional(),
    location: z.string().optional(),
});

export type CompanyUpdateInput = z.infer<typeof companyUpdateSchema>;


export const createJobSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    location: z.string().min(2, "Location is required"),
    job_type: z.enum(["internal", "external"]).default("external"), // For now defaulting to external as per schema, or maybe we want to support both?
    // Actually, Native posting implies it's managed by us, but the APPLICATION method might vary.
    // The schema in 022_companies_schema.sql has job_type check (internal, external).
    // Let's assume Native Posting = Internal for now? Or maybe 'external' just means "External Company posted it"?
    // Let's check the schema logic. migration says: check (job_type in ('internal', 'external')) default 'external'
    // Let's stick to the form fields.
    employment_type: z.string().min(1, "Employment type is required"), // Full-time, etc.
    salary_min: z.coerce.number().optional(),
    salary_max: z.coerce.number().optional(),
    application_method: z.enum(["url", "email", "internal_form"]).default("url"),
    application_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    is_remote: z.boolean().default(false),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
