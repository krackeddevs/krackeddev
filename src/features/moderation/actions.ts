"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const flagContentSchema = z.object({
    resourceId: z.string().uuid(),
    resourceType: z.enum(["chat", "question", "answer"]),
    reason: z.string().min(1, "Reason is required"),
});

// Auto-Mod Threshold
const AUTO_HIDE_THRESHOLD = 3;
const TRUSTED_USER_LEVEL_THRESHOLD = 20;

export async function flagContent(formData: FormData) {
    const supabase = await createClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "You must be logged in to flag content." };
    }

    // 2. Validate Input
    const rawData = {
        resourceId: formData.get("resourceId"),
        resourceType: formData.get("resourceType"),
        reason: formData.get("reason"),
    };

    const validatedFields = flagContentSchema.safeParse(rawData);
    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { resourceId, resourceType, reason } = validatedFields.data;

    try {
        // 3. Prevent Duplicate Flags
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const { data: existingFlag } = await (supabase.from("content_flags") as any)
            .select("id")
            .eq("flagger_id", user.id)
            .eq("resource_id", resourceId)
            .single();

        if (existingFlag) {
            return { error: "You have already flagged this content." };
        }

        // 4. Insert Flag
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const { error: insertError } = await (supabase.from("content_flags") as any)
            .insert({
                flagger_id: user.id,
                resource_id: resourceId,
                resource_type: resourceType,
                reason: reason,
                status: "pending"
            });

        if (insertError) {
            throw new Error(`Failed to flag content: ${insertError.message}`);
        }

        // 5. Auto-Mod Logic
        // Check Flagger Level
        const { data: flaggerProfile } = await supabase
            .from("profiles")
            .select("level")
            .eq("id", user.id)
            .single();

        const isTrustedUser = ((flaggerProfile as any)?.level || 0) >= TRUSTED_USER_LEVEL_THRESHOLD;

        // Count existing flags
        // Note: This count *includes* the one we just inserted because we query the table
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const { count, error: countError } = await (supabase.from("content_flags") as any)
            .select("*", { count: "exact", head: true })
            .eq("resource_id", resourceId);

        if (countError) {
            console.error("Failed to count flags:", countError);
        }

        const totalFlags = count || 1;

        // Trigger Hide if Threshold Met
        if (isTrustedUser || totalFlags >= AUTO_HIDE_THRESHOLD) {
            // Determine table name
            let tableName = "";
            switch (resourceType) {
                case "chat": tableName = "messages"; break; // chat messages table name is 'messages'
                case "question": tableName = "questions"; break;
                case "answer": tableName = "answers"; break;
            }

            // Using any here because tables are dynamic but confirmed columns exist
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const { error: updateError } = await (supabase.from(tableName) as any)
                .update({ moderation_status: "under_review" })
                .eq("id", resourceId);

            if (updateError) {
                console.error(`Auto-Mod failed to hide content: ${updateError.message}`);
            }
        }

        revalidatePath("/"); // Revalidate everything just to be safe, or targeted paths
        return { success: true, message: "Content flagged successfully." };

    } catch (error) {
        console.error("Flag Content Error:", error);
        return { error: "An unexpected error occurred." };
    }
}
