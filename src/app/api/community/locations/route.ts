import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { isNotNull } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db
      .select({ location: profiles.location })
      .from(profiles)
      .where(isNotNull(profiles.location));

    const locationMap = new Map<string, number>();

    data.forEach((profile) => {
      if (profile.location) {
        // Try to extract state from location (e.g., "Kuala Lumpur, Malaysia")
        const parts = profile.location.split(',').map((s) => s.trim());
        const state = parts[0] || profile.location;
        locationMap.set(state, (locationMap.get(state) || 0) + 1);
      }
    });

    const locationData = Array.from(locationMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json(locationData);
  } catch (error) {
    console.error('Unexpected error in community locations API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
