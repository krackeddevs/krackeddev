"use server";

import { createClient } from "@/lib/supabase/server";
import { bounties as staticBounties } from "@/lib/bounty/data";

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
        const { count: travelersCount, error: travelersError } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true });

        if (travelersError) {
            console.error("Error fetching travelers count:", travelersError);
        }

        // 2. Calculate Payout Volume from:
        //    a) Static completed bounties (hardcoded data)
        //    b) DB completed bounties (excluding static slugs to prevent double counting)

        // Static bounties total
        const staticCompletedBounties = staticBounties.filter((b) => b.status === "completed");
        const staticCompletedTotal = staticCompletedBounties.reduce((sum, b) => sum + b.reward, 0);
        const staticSlugs = staticBounties.map((b) => b.slug);

        // DB completed bounties - exclude any that match static slugs
        let dbCompletedTotal = 0;
        const { data: completedBounties } = await supabase
            .from("bounties")
            .select("reward_amount, slug")
            .eq("status", "completed");

        if (completedBounties) {
            // Only count DB bounties that aren't duplicates of static data
            dbCompletedTotal = (completedBounties as any[])
                .filter((b) => !staticSlugs.includes(b.slug))
                .reduce((sum, b) => sum + (b.reward_amount || 0), 0);
        }

        // Total payout = static + DB (non-duplicate)
        const totalPayout = staticCompletedTotal + dbCompletedTotal;

        // 3. Active Bounties (from DB only since static ones are completed)
        const { count: dbActiveBounties, error: bountiesError } = await supabase
            .from("bounties")
            .select("*", { count: "exact", head: true })
            .eq("status", "open");

        if (bountiesError) {
            console.error("Error fetching active bounties:", bountiesError);
        }

        // Count static active bounties
        const staticActiveBounties = staticBounties.filter((b) => b.status === "active").length;
        const activeBounties = (dbActiveBounties || 0) + staticActiveBounties;

        const finalTravelers = travelersCount || 0;

        return {
            data: {
                payoutVolume: totalPayout,
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

