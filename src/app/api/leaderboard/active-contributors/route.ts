import { NextRequest, NextResponse } from 'next/server';
import { fetchActiveContributors } from '@/features/profiles/actions';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '30');

        const { data, error } = await fetchActiveContributors(limit);

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch active contributors data' },
            { status: 500 }
        );
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
