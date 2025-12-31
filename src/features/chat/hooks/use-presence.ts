import { useEffect, useState } from "react";
import { useSupabase } from "@/context/SupabaseContext";

export interface OnlineUser {
    user_id: string;
    username: string;
    avatar_url: string | null;
}

export function usePresence(channelId: string, options: { paused?: boolean } = {}) {
    const { supabase, user, profile } = useSupabase();
    const [onlineCount, setOnlineCount] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

    useEffect(() => {
        if (!user || options.paused) return;

        const channel = supabase.channel(`presence:${channelId}`, {
            config: {
                presence: {
                    key: user.id,
                },
            },
        });

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState<OnlineUser>();
                const users: OnlineUser[] = [];

                for (const key in state) {
                    // Each key (user_id) has an array of presences (devices)
                    // We just take the first one or merge logic if needed
                    const presence = state[key][0];
                    if (presence) {
                        users.push(presence);
                    }
                }

                setOnlineUsers(users);
                setOnlineCount(users.length);
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({
                        user_id: user.id,
                        username: profile?.username || "Anonymous",
                        avatar_url: profile?.avatar_url || null,
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, [supabase, user, profile, channelId, options.paused]);

    return { onlineCount, onlineUsers };
}
