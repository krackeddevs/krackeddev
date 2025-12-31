import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getModerationQueue, resolveFlag } from './actions';

// Mock Supabase
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockUpdate = vi.fn();
const mockOrder = vi.fn();

// Recursive mock structure helper
const createMockQueryBuilder = () => ({
    select: mockSelect,
    eq: mockEq,
    single: mockSingle,
    update: mockUpdate,
    order: mockOrder,
});

const mockSupabase = {
    auth: {
        getUser: vi.fn(),
    },
    from: vi.fn(() => createMockQueryBuilder()),
};

// Chain setup
mockSelect.mockReturnValue(createMockQueryBuilder());
mockEq.mockReturnValue(createMockQueryBuilder());
mockSingle.mockResolvedValue({ data: null });
mockUpdate.mockReturnValue(createMockQueryBuilder());
mockOrder.mockResolvedValue({ data: [] });

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(() => Promise.resolve(mockSupabase)),
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

describe('Admin Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset chain behavior
        mockSelect.mockReturnValue(createMockQueryBuilder());
        mockEq.mockReturnValue(createMockQueryBuilder());
    });

    describe('getModerationQueue', () => {
        it('should return empty list if not logged in', async () => {
            mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
            const result = await getModerationQueue();
            expect(result).toEqual([]);
        });

        it('should return empty list if user is not admin', async () => {
            mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
            // Mock profile check
            mockSingle.mockResolvedValueOnce({ data: { role: 'user' } });

            const result = await getModerationQueue();
            expect(result).toEqual([]);
        });

        it('should fetch pending flags if admin', async () => {
            mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } });
            // 1. Profile check -> admin
            mockSingle.mockResolvedValueOnce({ data: { role: 'admin' } });

            // 2. Fetch flags
            const mockFlags = [
                { id: 'flag-1', resource_id: 'q-1', resource_type: 'question', status: 'pending' }
            ];
            mockOrder.mockResolvedValueOnce({ data: mockFlags, error: null });

            // 3. Fetch content (loop)
            mockSingle.mockResolvedValueOnce({ data: { title: 'Bad Question' } });

            const result = await getModerationQueue();
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveProperty('content');
            expect(result[0].content.title).toBe('Bad Question');
        });
    });

    describe('resolveFlag', () => {
        it('should deny non-admins', async () => {
            mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
            mockSingle.mockResolvedValueOnce({ data: { role: 'user' } });

            const result = await resolveFlag('r-1', 'chat', 'keep');
            expect(result).toHaveProperty('error', 'Unauthorized: Not an Admin');
        });

        it('should resolve flags on keep', async () => {
            mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } });
            mockSingle.mockResolvedValueOnce({ data: { role: 'admin' } });

            await resolveFlag('r-1', 'chat', 'keep');

            // Verify content update
            expect(mockUpdate).toHaveBeenCalledWith({ moderation_status: 'published' });
            // Verify flag status update
            expect(mockUpdate).toHaveBeenCalledWith({ status: 'resolved' });
        });
    });
});
