"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileData = {
    id: string;
    role: string;
    stack: string[];
    bio: string | null;
    location: string | null;
    username: string | null;
};

export async function getProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {
        return { error: error.message };
    }

    return { data };
}

export async function updateProfile(data: Partial<ProfileData>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const { error } = await (supabase.from("profiles") as any)
        .update({
            developer_role: data.role as any, // Cast to any or import DeveloperRole type if needed, or simply string if DB accepts it. DB type is DeveloperRole enum.
            stack: data.stack,
            bio: data.bio,
            location: data.location,
            username: data.username,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/profile/view");
    revalidatePath("/profile");
    return { success: true };
}
