"use server";

import { createClient } from "@/lib/supabase/server";
import { Message } from "@/types/database";

const MESSAGES_PER_PAGE = 50;

export async function getChannelMessages(channelId: string, limit = MESSAGES_PER_PAGE) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("messages")
        .select(`
      *,
      profiles:user_id (
        username,
        avatar_url,
        role,
        level,
        developer_role
      )
    `)
        .eq("channel_id", channelId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching messages:", error);
        return [];
    }

    // Return reversed array (oldest to newest) for chat stream
    return (data || []).reverse();
}

export async function sendMessage(channelId: string, content: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    // Basic rate limit check could go here (using limits on client for now)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("messages") as any)
        .insert({
            channel_id: channelId,
            user_id: user.id,
            content,
        })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
