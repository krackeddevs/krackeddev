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

        // 2. Get Payout Volume
        // Try from paid submissions first, then fallback to completed bounties
        const { data: submissions, error: submissionsError } = await supabase
            .from("bounty_submissions")
            .select("bounty_reward, status")
            .in("status", ["paid", "approved"]); // Include both paid and approved

        let totalPayout = 0;
        if (!submissionsError && submissions) {
            totalPayout = (submissions as any[]).reduce((sum, sub) => sum + (sub.bounty_reward || 0), 0);
        }

        // If no paid submissions, calculate from completed bounties in bounties table
        if (totalPayout === 0) {
            const { data: completedBounties } = await supabase
                .from("bounties")
                .select("reward_amount, status")
                .in("status", ["completed", "paid"]);

            if (completedBounties) {
                totalPayout = (completedBounties as any[]).reduce((sum, b) => sum + (b.reward_amount || 0), 0);
            }
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

        // MOCK FALLBACK for Dev/Empty DB - only if truly no data
        const finalTravelers = travelersCount || 42;
        const finalPayout = totalPayout > 0 ? totalPayout : 400; // Fallback to 400 RM (100+150+150 completed bounties)

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
