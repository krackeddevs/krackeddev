"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { XPEvent, ContributionStats, BountyStats } from "../types";
import { calculateSystemMetrics } from "../utils/hud-utils";

/**
 * Hook to manage HUD data: fetches initial logs and listens for real-time XP events.
 */
export function useHUDData(
    userId: string,
    contributionStats: ContributionStats | null,
    bountyStats: BountyStats | null,
    initialProfile: any
) {
    const [logs, setLogs] = useState<XPEvent[]>([]);
    const [metrics, setMetrics] = useState({
        signalStability: 0,
        archiveGrade: "D",
        nodeUptime: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        if (!userId) return;

        // Fetch initial logs
        async function fetchInitialLogs() {
            const { data, error } = await supabase
                .from("xp_events")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
                .limit(10);

            if (!error && data) {
                const mappedLogs: XPEvent[] = data.map((event: any) => ({
                    id: event.id,
                    userId: event.user_id,
                    eventType: event.event_type,
                    xpAmount: event.xp_amount,
                    metadata: event.metadata,
                    createdAt: event.created_at
                }));
                setLogs(mappedLogs);
            }
            setIsLoading(false);
        }

        fetchInitialLogs();

        // Subscribe to real-time updates for THIS user only
        const channel = supabase
            .channel(`xp_events_${userId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "xp_events",
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    const newEvent = payload.new;
                    const mappedEvent: XPEvent = {
                        id: newEvent.id,
                        userId: newEvent.user_id,
                        eventType: newEvent.event_type as any,
                        xpAmount: newEvent.xp_amount,
                        metadata: newEvent.metadata,
                        createdAt: newEvent.created_at
                    };

                    // Add to front of list and maintain max 10
                    setLogs((prev) => [mappedEvent, ...prev].slice(0, 10));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, supabase]);

    // Update metrics when stats or profile changes
    useEffect(() => {
        const newMetrics = calculateSystemMetrics(initialProfile, contributionStats, bountyStats);
        setMetrics(newMetrics);
    }, [initialProfile, contributionStats, bountyStats]);

    return { logs, metrics, isLoading };
}
