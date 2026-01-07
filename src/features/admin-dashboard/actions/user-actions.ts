"use server";

import { createClient } from "@/lib/supabase/server";

export async function banUser(userId: string) {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
        .update({ is_banned: true })
        .eq("id", userId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function unbanUser(userId: string) {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
        .update({ is_banned: false })
        .eq("id", userId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function updateUserRole(userId: string, role: string) {
    const supabase = await createClient();

    let label = '[RUNNER]';
    if (role === 'admin') label = '[SYSTEM]';
    else if (role === 'staff') label = '[MOD]';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
        .update({
            role,
            leaderboard_label: label
        })
        .eq("id", userId);
    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function updateUserLabel(userId: string, label: string) {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
        .update({ leaderboard_label: label })
        .eq("id", userId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
