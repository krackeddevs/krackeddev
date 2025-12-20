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
        //    a) DB completed bounties (takes precedence)
        //    b) Static completed bounties (only if not in DB)

        // Fetch all completed bounties from DB
        const { data: dbCompletedBounties } = await supabase
            .from("bounties")
            .select("reward_amount, slug")
            .eq("status", "completed");

        // Get slugs of DB completed bounties
        const dbCompletedSlugs = new Set(
            (dbCompletedBounties || []).map((b: any) => b.slug)
        );

        // DB completed bounties total
        const dbCompletedTotal = (dbCompletedBounties || [])
            .reduce((sum: number, b: any) => sum + (b.reward_amount || 0), 0);

        // Static completed bounties - only count those NOT in DB (DB takes precedence)
        const staticCompletedBounties = staticBounties.filter(
            (b) => b.status === "completed" && !dbCompletedSlugs.has(b.slug)
        );
        const staticCompletedTotal = staticCompletedBounties.reduce((sum, b) => sum + b.reward, 0);

        // Total payout = DB + static (non-duplicate)
        const totalPayout = dbCompletedTotal + staticCompletedTotal;

        // 3. Active Bounties
        // Get DB active bounties
        const { count: dbActiveBounties, error: bountiesError } = await supabase
            .from("bounties")
            .select("*", { count: "exact", head: true })
            .eq("status", "open");

        if (bountiesError) {
            console.error("Error fetching active bounties:", bountiesError);
        }

        // Get all DB bounty slugs to avoid double counting
        const { data: allDbBounties } = await supabase
            .from("bounties")
            .select("slug");
        const dbSlugs = new Set((allDbBounties || []).map((b: any) => b.slug));

        // Count static active bounties not in DB
        const staticActiveBounties = staticBounties.filter(
            (b) => b.status === "active" && !dbSlugs.has(b.slug)
        ).length;
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

