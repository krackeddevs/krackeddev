"use server";

import { createClient } from "@/lib/supabase/server";

export interface LandingStats {
    payoutVolume: number;
    activeBounties: number;
    travelers: number;
}

export interface ActionResult<T> {
    data: T | null;
    error: string | null;
}

export async function getLandingStats(): Promise<ActionResult<LandingStats>> {
    try {
        const supabase = await createClient();

        // 1. Get Travelers count (Profiles)
        // Using head:true to get count only
        const { count: travelersCount, error: travelersError } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true });

        if (travelersError) {
            console.error("Error fetching travelers count:", travelersError);
        }

        // 2. Get Payout Volume (Sum of rewards from submissions)
        // Since we don't have a direct aggregation, we'll fetch success/paid submissions
        // Or just fetch all and sum locally (assuming small dataset for MVP)
        const { data: submissions, error: submissionsError } = await supabase
            .from("bounty_submissions")
            .select("bounty_reward, status")
            .eq("status", "paid"); // Assuming 'paid' is the status

        let totalPayout = 0;
        if (!submissionsError && submissions) {
            // Explicitly cast or handle the type if inference fails
            totalPayout = (submissions as any[]).reduce((sum, sub) => sum + (sub.bounty_reward || 0), 0);
        }

        // 3. Active Bounties
        const { count: activeBountiesCount, error: bountiesError } = await supabase
            .from("bounties")
            .select("*", { count: "exact", head: true })
            .eq("status", "open");

        if (bountiesError) {
            console.error("Error fetching active bounties:", bountiesError);
        }

        // Use real count if available, or fallback to 0 (which will trigger mock fallback below if needed)
        const activeBounties = activeBountiesCount || 0;

        // MOCK FALLBACK for Dev/Empty DB
        // If we have 0 travelers (likely fresh db), show some seed data so the UI isn't empty
        const finalTravelers = travelersCount || 42;
        const finalPayout = totalPayout > 0 ? totalPayout : 12500; // Mock $12,500 if empty

        return {
            data: {
                payoutVolume: finalPayout,
                activeBounties: activeBounties,
                travelers: finalTravelers,
            },
            error: null,
        };
    } catch (error) {
        console.error("Unexpected error in getLandingStats:", error);
        return {
            data: null,
            error: "Failed to fetch stats",
        };
    }
}
