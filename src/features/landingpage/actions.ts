"use server";

import { db } from '@/lib/db';
import { profiles, bounties } from '@/lib/db/schema';
import { count, eq, isNotNull } from 'drizzle-orm';
import { bounties as staticBounties } from '@/lib/bounty/data';

export async function getLandingStats() {
    try {
        const travelersCountResult = await db
            .select({ value: count() })
            .from(profiles)
            .where(eq(profiles.status, 'active'));

        const travelersCount = travelersCountResult[0]?.value || 0;

        const dbCompletedBounties = await db
            .select({ rewardAmount: bounties.rewardAmount, slug: bounties.slug })
            .from(bounties)
            .where(eq(bounties.status, 'completed'));

        const dbCompletedSlugs = new Set((dbCompletedBounties || []).map((b) => b.slug));
        const dbCompletedTotal = (dbCompletedBounties || []).reduce(
            (sum, b) => sum + Number(b.rewardAmount || 0),
            0
        );

        const staticCompletedBounties = staticBounties.filter(
            (b) => b.status === 'completed' && !dbCompletedSlugs.has(b.slug)
        );
        const staticCompletedTotal = staticCompletedBounties.reduce((sum, b) => sum + b.reward, 0);

        const totalPayout = dbCompletedTotal + staticCompletedTotal;

        const dbActiveBountiesResult = await db
            .select({ value: count() })
            .from(bounties)
            .where(eq(bounties.status, 'open'));

        const dbActiveBounties = dbActiveBountiesResult[0]?.value || 0;

        const allDbBounties = await db.select({ slug: bounties.slug }).from(bounties);
        const dbSlugs = new Set((allDbBounties || []).map((b) => b.slug));

        const staticActiveBounties = staticBounties.filter(
            (b) => (b.status === 'active' || (b.status as string) === 'open') && !dbSlugs.has(b.slug)
        ).length;

        const activeBounties = Number(dbActiveBounties) + staticActiveBounties;

        return {
            payoutVolume: totalPayout,
            activeBounties: activeBounties,
            travelers: travelersCount,
        };
    } catch (error) {
        console.error('Error in getLandingStats:', error);
        return null;
    }
}

export async function getCommunityLocations() {
    try {
        const data = await db
            .select({ location: profiles.location })
            .from(profiles)
            .where(eq(profiles.status, 'active'));

        const locationMap = new Map<string, number>();

        const STATES = [
            "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang", "Perak", "Perlis",
            "Pulau Pinang", "Sabah", "Sarawak", "Selangor", "Terengganu",
            "Wilayah Persekutuan Kuala Lumpur", "Wilayah Persekutuan Labuan", "Wilayah Persekutuan Putrajaya"
        ];

        const ALIASES: Record<string, string> = {
            "kuala lumpur": "Wilayah Persekutuan Kuala Lumpur",
            "kl": "Wilayah Persekutuan Kuala Lumpur",
            "putrajaya": "Wilayah Persekutuan Putrajaya",
            "labuan": "Wilayah Persekutuan Labuan",
            "penang": "Pulau Pinang",
            "pinang": "Pulau Pinang",
            "melaka": "Melaka",
            "malacca": "Melaka"
        };

        data.forEach((profile) => {
            const lowerLoc = profile.location?.toLowerCase() || '';
            let matchedState: string | null = null;

            if (profile.location) {
                for (const [alias, fullName] of Object.entries(ALIASES)) {
                    if (lowerLoc.includes(alias)) {
                        matchedState = fullName;
                        break;
                    }
                }
                if (!matchedState) {
                    for (const state of STATES) {
                        if (lowerLoc.includes(state.toLowerCase())) {
                            matchedState = state;
                            break;
                        }
                    }
                }
                if (!matchedState) {
                    if (lowerLoc.includes("bangi") || lowerLoc.includes("shah alam") || lowerLoc.includes("subang")) {
                        matchedState = "Selangor";
                    } else if (lowerLoc.includes("george town") || lowerLoc.includes("butterworth")) {
                        matchedState = "Pulau Pinang";
                    } else if (lowerLoc.includes("kuching")) {
                        matchedState = "Sarawak";
                    } else if (lowerLoc.includes("kota kinabalu")) {
                        matchedState = "Sabah";
                    } else if (lowerLoc.includes("kuantan")) {
                        matchedState = "Pahang";
                    } else if (lowerLoc.includes("ipoh")) {
                        matchedState = "Perak";
                    } else if (lowerLoc.includes("seremban")) {
                        matchedState = "Negeri Sembilan";
                    }
                }
            }

            const stateName = matchedState || (profile.location?.trim()) || "Unknown";
            locationMap.set(stateName, (locationMap.get(stateName) || 0) + 1);
        });

        return Array.from(locationMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    } catch (error) {
        console.error('Error in getCommunityLocations:', error);
        return [];
    }
}
