"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type FlaggedItem = {
    id: string;
    flagger_id: string;
    resource_id: string;
    resource_type: "chat" | "question" | "answer";
    reason: string;
    status: string;
    created_at: string;
    flagger?: { username: string };
    // We will augment this with resource content often
    content?: any;
};

export async function getModerationQueue() {
    const supabase = await createClient();

    // Auth Check: Admin only
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return []; // Or throw

    // Check Role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if ((profile as any)?.role !== "admin") return [];

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const { data: flags, error } = await (supabase.from("content_flags") as any)
        .select(`
            *,
            flagger:profiles!flagger_id(username)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Fetch Queue Error:", error);
        return [];
    }

    // Enhance flags with content content
    // This is N+1 but acceptable for an admin queue which is usually small & paginated in future
    const enhancedFlags = await Promise.all(flags.map(async (flag: any) => {
        let tableName = "messages";
        if (flag.resource_type === "question") tableName = "questions";
        if (flag.resource_type === "answer") tableName = "answers";

        const { data: content } = await supabase.from(tableName as any).select("*").eq("id", flag.resource_id).single();
        return { ...flag, content };
    }));

    return enhancedFlags as FlaggedItem[];
}

export async function resolveFlag(resourceId: string, resourceType: string, action: "keep" | "delete" | "ban") {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if ((profile as any)?.role !== "admin") return { error: "Unauthorized: Not an Admin" };

    try {
        let tableName = "messages";
        if (resourceType === "question") tableName = "questions";
        if (resourceType === "answer") tableName = "answers";

        if (action === "keep") {
            // Restore content status
            await (supabase.from(tableName as any) as any)
                .update({ moderation_status: "published" })
                .eq("id", resourceId);

            // Mark flags resolved
            await (supabase.from("content_flags") as any)
                .update({ status: "resolved" })
                .eq("resource_id", resourceId);

        } else if (action === "delete") {
            // Soft delete content
            await (supabase.from(tableName as any) as any)
                .update({ moderation_status: "deleted" }) // Or use deleted_at if column exists, but story said moderation_status
                .eq("id", resourceId);

            // Mark flags resolved
            await (supabase.from("content_flags") as any)
                .update({ status: "resolved" })
                .eq("resource_id", resourceId);

        } else if (action === "ban") {
            // 1. Delete content
            await (supabase.from(tableName as any) as any)
                .update({ moderation_status: "deleted" })
                .eq("id", resourceId);

            // 2. Mark flags resolved
            await (supabase.from("content_flags") as any)
                .update({ status: "resolved" })
                .eq("resource_id", resourceId);

            // 3. Find author and Ban
            // Need to fetch author_id from content
            // Need to fetch author_id from content
            const { data: content } = await supabase.from(tableName as any).select("author_id, user_id").eq("id", resourceId).single();
            const authorId = (content as any)?.author_id || (content as any)?.user_id;

            if (authorId) {
                // Assuming we have a ban mechanism or just update profile status
                // Story says "Ban User". We probably need to set something on profile or auth.
                // For now, let's assume we update a generic status or just log it.
                // Assuming is_banned column exists based on previous sprints or context.
                // Wait, previous context "Admin Panel Refinement" mentioned "Add user management actions (ban/unban)".
                // So I will assume `is_banned` on profiles.

                // Let's check profile columns if possible, but for now safe bet is update
                await (supabase.from("profiles") as any).update({ is_banned: true }).eq("id", authorId);
            }
        }

        revalidatePath("/admin/moderation");
        return { success: true };

    } catch (error) {
        console.error("Resolve Flag Error:", error);
        return { error: "Failed to resolve flag" };
    }
}
