import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, bounties } from '@/lib/db/schema';
import { count, eq } from 'drizzle-orm';
import { bounties as staticBounties } from '@/lib/bounty/data';

export async function GET() {
  try {
    const travelersCountResult = await db
      .select({ value: count() })
      .from(profiles)
      .where(eq(profiles.status, 'active'));
    const travelersCount = travelersCountResult[0]?.value || 0;

    // 2. Calculate Payout Volume
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

    // 3. Active Bounties
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

    return NextResponse.json({
      payoutVolume: totalPayout,
      activeBounties: activeBounties,
      travelers: travelersCount,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Unexpected error in landing stats API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
