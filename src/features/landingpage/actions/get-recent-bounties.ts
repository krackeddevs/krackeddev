"use server";

import { createClient } from "@/lib/supabase/server";
import { Bounty } from "@/types/database";

export interface ActionResult<T> {
    data: T | null;
    error: string | null;
}

export async function getRecentBounties(): Promise<ActionResult<Bounty[]>> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("bounties")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(3);

        if (error) {
            console.error("Error fetching recent bounties:", error);
            return {
                data: null,
                error: "Failed to fetch bounties",
            };
        }

        return {
            data: data as Bounty[],
            error: null,
        };
    } catch (error) {
        console.error("Unexpected error in getRecentBounties:", error);
        return {
            data: null,
            error: "An unexpected error occurred",
        };
    }
}
