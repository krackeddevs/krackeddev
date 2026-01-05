import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { isNotNull, eq, and } from 'drizzle-orm';

export async function GET() {
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
        // 1. Try matching aliases/priority names first
        for (const [alias, fullName] of Object.entries(ALIASES)) {
          if (lowerLoc.includes(alias)) {
            matchedState = fullName;
            break;
          }
        }

        // 2. Try matching standard state names
        if (!matchedState) {
          for (const state of STATES) {
            if (lowerLoc.includes(state.toLowerCase())) {
              matchedState = state;
              break;
            }
          }
        }

        // 3. Special cases for common cities
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

    const locationData = Array.from(locationMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json(locationData, {
      /* headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=3600',
      }, */
    });
  } catch (error) {
    console.error('Unexpected error in community locations API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
