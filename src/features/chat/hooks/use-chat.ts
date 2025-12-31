import { useState, useEffect, useCallback, useRef } from "react";
import { useSupabase } from "@/context/SupabaseContext";
import { getChannelMessages, sendMessage as sendMessageAction } from "../actions";
import { toast } from "sonner";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";

// Extended message type to include profile which is joined on fetch but not on realtime insert
export interface ChatMessage {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    profiles?: {
        username: string | null;
        avatar_url: string | null;
        role: string;
        level: number;
        developer_role: string | null;
    } | null;
}

export function useChat(channelId: string, options: { paused?: boolean } = {}) {
    const { supabase, profile } = useSupabase();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const latestMessagesRef = useRef<ChatMessage[]>([]);

    // Keep ref in sync for subscription
    useEffect(() => {
        latestMessagesRef.current = messages;
    }, [messages]);

    // Initial Fetch - only if not paused (or maybe we still fetch initially? Let's fetch initially regardless, or only if not paused)
    // Actually, if we are idle when we mount (unlikely), we might skip.
    // But usually we mount active.
    useEffect(() => {
        if (options.paused) return;

        let isMounted = true;
        const fetchMessages = async () => {
            setIsLoading(true);
            const initialMessages = await getChannelMessages(channelId);
            if (isMounted) {
                setMessages(initialMessages as any);
                setIsLoading(false);
            }
        };

        fetchMessages();

        return () => {
            isMounted = false;
        };
    }, [channelId, options.paused]);

    // Subscription
    useEffect(() => {
        if (options.paused) return;

        const channel = supabase
            .channel(`chat:${channelId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `channel_id=eq.${channelId}`,
                },
                async (payload: RealtimePostgresInsertPayload<any>) => {
                    const newMessage = payload.new;

                    // If we sent this message, we already have it optimistically (check by ID if possible, but IDs generated on DB)
                    // Actually, our optimistic message won't have the real ID yet.
                    // For MVP, simplistic append is okay, but duplicating "my own" message is a risk unless handled.
                    // Strategy: Fetch the user profile for the new message if it's not us (or even if it is, for completeness)
                    // Since we don't fetch relations in realtime payload, we simulate it or fetch it.

                    // For now, let's just fetch the sender profile quickly or handle basic display
                    // To avoid complexity, we'll append it. If it's our own, the Optimistic UI might need replacement or filtering.

                    // Simplified: append with partial profile data if missing
                    const messageWithProfile: ChatMessage = {
                        ...newMessage,
                        profiles: null // will be null for others until refreshed or we fetch it. 
                        // Wait, if it is NULL, UI looks bad. 
                        // Ideally we fetch the profile for this user.
                    };

                    // To fix the "Unknown user" issue in realtime:
                    const { data: senderParams } = await supabase.from('profiles').select('username, avatar_url, role, level, developer_role').eq('id', newMessage.user_id).single();

                    if (senderParams) {
                        messageWithProfile.profiles = senderParams;
                    }

                    setMessages((prev) => {
                        // Deduplicate just in case
                        if (prev.find(m => m.id === newMessage.id)) return prev;
                        return [...prev, messageWithProfile];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, channelId, options.paused]);

    const sendMessage = async (content: string) => {
        if (!content.trim() || isSending) return;

        setIsSending(true);
        const tempId = crypto.randomUUID();

        // Optimistic Update
        const optimisticMessage: ChatMessage = {
            id: tempId,
            content,
            user_id: profile!.id,
            created_at: new Date().toISOString(),
            profiles: {
                username: profile?.username || "Me",
                avatar_url: profile?.avatar_url || null,
                role: profile?.role || "user",
                level: profile?.level || 1,
                developer_role: profile?.developer_role || "developer"
            },
        };

        setMessages((prev) => [...prev, optimisticMessage]);

        try {
            const realMessage = await sendMessageAction(channelId, content);

            // Replace optimistic message with real one
            setMessages((prev) =>
                prev.map(m => m.id === tempId ? { ...realMessage, profiles: optimisticMessage.profiles } : m)
            );
        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error("Failed to send message");
            // Remove optimistic message
            setMessages((prev) => prev.filter(m => m.id !== tempId));
        } finally {
            setIsSending(false);
        }
    };

    return {
        messages,
        isLoading,
        sendMessage,
        isSending
    };
}
