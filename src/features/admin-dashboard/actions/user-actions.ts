"use server";

import { createClient } from "@/lib/supabase/server";

export async function banUser(userId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        // @ts-expect-error - is_banned column not yet in generated types (pending migration)
        .update({ is_banned: true })
        .eq("id", userId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function unbanUser(userId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        // @ts-expect-error - is_banned column not yet in generated types (pending migration)
        .update({ is_banned: false })
        .eq("id", userId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function updateUserRole(userId: string, role: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        // @ts-expect-error - Supabase types restrictive for updates
        .update({ role })
        .eq("id", userId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
