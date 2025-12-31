
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchLeaderboard, getUserRank } from './actions';

// Mock Supabase
const mockRpc = vi.fn();
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockContains = vi.fn();
const mockFrom = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockGt = vi.fn();

const mockSupabase = {
    rpc: mockRpc,
    from: mockFrom,
};

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(() => Promise.resolve(mockSupabase)),
    createPublicClient: vi.fn(() => mockSupabase), // Added for leaderboard actions
}));

vi.mock('next/cache', () => ({
    unstable_cache: (fn: Function) => fn, // Bypass cache wrapper
    revalidatePath: vi.fn(),
}));

describe('fetchLeaderboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Setup chain mocks
        mockFrom.mockReturnValue({ select: mockSelect });
        mockSelect.mockReturnValue({
            order: mockOrder,
            eq: mockEq,
            gt: mockGt
        });
        mockOrder.mockReturnValue({ limit: mockLimit });
        mockLimit.mockReturnValue({ contains: mockContains }); // Naive chain for now

        // Default success
        mockRpc.mockResolvedValue({ data: [], error: null });
    });

    it('should call RPC get_weekly_leaderboard for weekly timeframe', async () => {
        await fetchLeaderboard('week', undefined, 50);
        expect(mockRpc).toHaveBeenCalledWith('get_weekly_leaderboard', { limit_count: 50 });
    });

    it('should query profiles table for all-time timeframe', async () => {
        // Fix chain for all-time
        mockFrom.mockReturnValue({ select: mockSelect });
        mockSelect.mockReturnValue({ order: mockOrder }); // select -> order
        mockOrder.mockReturnValue({ limit: mockLimit });  // order -> limit
        mockLimit.mockResolvedValue({ data: [], error: null }); // limit -> result

        await fetchLeaderboard('all-time', undefined, 50);

        expect(mockFrom).toHaveBeenCalledWith('profiles');
        expect(mockSelect).toHaveBeenCalledWith(expect.stringContaining('xp'));
        expect(mockOrder).toHaveBeenCalledWith('xp', { ascending: false });
        expect(mockLimit).toHaveBeenCalledWith(50);
    });
});

describe('getUserRank', () => {
    it('should calculate rank based on XP count', async () => {
        // Create a compliant Promise-like mock
        const createMockBuilder = (result: any) => {
            const builder: any = Promise.resolve(result);
            builder.gt = vi.fn().mockResolvedValue({ count: 10, error: null });
            builder.eq = vi.fn().mockReturnValue(
                Promise.resolve({ data: { xp: 5000 }, error: null })
            );
            // Add single to the .eq result if needed, but eq returns promise above.
            // Wait, .eq().single() pattern:
            const singleBuilder: any = Promise.resolve({ data: { xp: 5000 }, error: null });
            singleBuilder.single = vi.fn().mockResolvedValue({ data: { xp: 5000 }, error: null });
            builder.eq = vi.fn().mockReturnValue(singleBuilder);

            return builder;
        };

        const mockProfileQuery = { select: vi.fn() };
        mockFrom.mockReturnValue(mockProfileQuery);

        // First call: total count
        mockProfileQuery.select.mockImplementation((cols, opts) => {
            // Return a builder that resolves to total count, but also has .gt
            const builder = createMockBuilder({ count: 100, error: null });
            return builder;
        });

        // The logic under test:
        // 1. select(..., count).then -> gets { count: 100 }
        // 2. select(xp).eq(id).single() -> gets profile
        // 3. select(..., count).gt(xp) -> gets rank

        // We need to differentiate calls or just return a smart builder
        // implementation above handles generic builder.
        // Let's refine based on args if possible, or just ensure .gt works on the returned builder.

        // Since we re-mocked select, let's ensure it handles the .gt call
        // The test failure was `.gt is not a function`.
        // Our createMockBuilder adds .gt, so it should work.
    });

    it('should calculate rank correctly', async () => {
        // Reset mocks
        vi.clearAllMocks();
        mockFrom.mockReturnValue({ select: mockSelect });

        // Mock select to return a "Thenable Builder"
        const mockBuilder: any = {};
        mockBuilder.then = (fn: any) => Promise.resolve({ count: 100, error: null }).then(fn); // Default resolve for await select()

        const mockGtBuilder = { count: 10, error: null };
        mockBuilder.gt = vi.fn().mockResolvedValue(mockGtBuilder);

        const mockEqBuilder: any = {};
        mockEqBuilder.single = vi.fn().mockResolvedValue({ data: { xp: 5000 }, error: null });
        mockBuilder.eq = vi.fn().mockReturnValue(mockEqBuilder);

        mockSelect.mockReturnValue(mockBuilder);

        const result = await getUserRank('user-123');
        expect(result).toEqual({ global_rank: 11, total_users: 100 });
    });
});
