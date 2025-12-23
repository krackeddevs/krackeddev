import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bounties } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db
      .select()
      .from(bounties)
      .orderBy(desc(bounties.createdAt))
      .limit(3);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in recent bounties API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
