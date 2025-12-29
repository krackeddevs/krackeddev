import { createClient } from "@/lib/supabase/server";

export async function banUser(userId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
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
        .update({ role })
        .eq("id", userId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
