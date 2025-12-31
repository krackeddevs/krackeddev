import { NextRequest, NextResponse } from 'next/server';
import { fetchTopHunters } from '@/features/profiles/actions';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '30');

        const { data, error } = await fetchTopHunters(limit);

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch top hunters data' },
            { status: 500 }
        );
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
