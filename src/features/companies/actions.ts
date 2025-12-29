"use server";

import { createClient } from "@/lib/supabase/server";
import { companyRegistrationSchema, companyUpdateSchema, CompanyRegistrationInput, CompanyUpdateInput, CreateJobInput } from "./schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export async function registerCompany(data: CompanyRegistrationInput) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const result = companyRegistrationSchema.safeParse(data);
    if (!result.success) {
        return { error: "Invalid data" };
    }

    // Generate unique slug
    let slug = slugify(data.name);
    const randomSuffix = Math.random().toString(36).substring(2, 7);

    // Check if slug exists
    const { data: existingSlug } = await supabase
        .from("companies")
        .select("slug")
        .eq("slug", slug)
        .single();

    if (existingSlug) {
        slug = `${slug}-${randomSuffix}`;
    }

    // Use RPC for atomic creation to bypass RLS complexity
    const { data: companyId, error: rpcError } = await supabase.rpc('register_new_company', {
        p_name: data.name,
        p_slug: slug,
        p_size: data.size,
        p_website_url: data.website_url || null,
    });

    if (rpcError) {
        console.error("Error registering company:", rpcError);
        return { error: rpcError.message || "Failed to create company" };
    }

    if (!companyId) {
        return { error: "Failed to create company (No ID returned)" };
    }

    revalidatePath("/dashboard");
    return { success: true, companyId };
}

export async function updateCompany(companyId: string, data: CompanyUpdateInput) {
    const supabase = await createClient();

    // Auth check is handled by RLS, but we can double check here or just let RLS fail
    const result = companyUpdateSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid data" };
    }

    const { error } = await supabase
        .from("companies")
        .update({
            name: data.name,
            description: data.description,
            website_url: data.website_url || null,
            linkedin_url: data.linkedin_url || null,
            twitter_url: data.twitter_url || null,
            logo_url: data.logo_url,
            industry: data.industry,
            location: data.location,
            updated_at: new Date().toISOString(),
        })
        .eq("id", companyId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/company");
    return { success: true };
}

export async function getUserCompany() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
        .from("company_members")
        .select("company:companies(*)")
        .eq("user_id", user.id)
        .eq("role", "owner") // Or admin/member if we want to support that later
        .limit(1);

    if (error) {
        console.error("getUserCompany error:", JSON.stringify(error, null, 2));
    }

    if (data && data.length > 0) {
        return data[0].company;
    }

    return null;
}

export async function createJob(data: CreateJobInput) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    // Get user's company
    const company = await getUserCompany();
    if (!company) {
        return { error: "You do not have a company profile" };
    }

    const { error } = await supabase
        .from("jobs")
        .insert({
            id: crypto.randomUUID(),
            title: data.title,
            description: data.description,
            company_id: company.id,
            company: company.name, // Legacy field
            company_logo: company.logo_url, // Legacy field
            location: data.location,
            is_remote: data.is_remote,
            employment_type: data.employment_type,
            salary_min: data.salary_min,
            salary_max: data.salary_max,
            application_method: data.application_method,
            application_url: data.application_url,
            job_type: data.job_type,
            source_site: "KrackedDevs", // Native
            is_active: true,
            posted_at: new Date().toISOString(),
        });

    if (error) {
        console.error("createJob error:", error);
        return { error: "Failed to create job" };
    }

    revalidatePath("/dashboard/company/jobs");
    return { success: true };
}

export async function getCompanyJobs() {
    const supabase = await createClient();
    const company = await getUserCompany();

    if (!company) return { data: [] };

    const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("company_id", company.id)
        .order("posted_at", { ascending: false });

    if (error) {
        console.error("getCompanyJobs error:", error);
        return { data: [] };
    }

    return { data };
}


export async function getCompanyStats() {
    const supabase = await createClient();
    const company = await getUserCompany();

    if (!company) return { activeJobs: 0, totalViews: 0 };

    const { count: activeJobs } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("company_id", company.id)
        .eq("is_active", true);

    return {
        activeJobs: activeJobs || 0,
        totalViews: 0 // Not implemented yet
    };
}
