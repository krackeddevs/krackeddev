import { NextRequest, NextResponse } from 'next/server';
import { fetchLeaderboard, fetchTopHunters, fetchActiveContributors } from '@/features/profiles/actions';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const timeframe = searchParams.get('timeframe') as 'week' | 'all-time' || 'all-time';
        const skill = searchParams.get('skill') || undefined;
        const limit = parseInt(searchParams.get('limit') || '30');

        const { data, error } = await fetchLeaderboard(timeframe, skill, limit);

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ data }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            }
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leaderboard data' },
            { status: 500 }
        );
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
