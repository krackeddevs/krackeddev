import { describe, it, expect, vi, beforeEach } from 'vitest';
import { acceptAnswer, vote } from './actions';

// Mock Supabase client
const mockRpc = vi.fn();
const mockGetUser = vi.fn();

// Create a builder-like mock structure if needed, but actions mainly use RPC
// and auth.
vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(() => ({
        rpc: mockRpc,
        auth: {
            getUser: mockGetUser,
        }
    })),
}));

// Mock revalidatePath
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

describe('Community Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default success for RPC
        mockRpc.mockResolvedValue({ data: null, error: null });
        // Default authenticated user
        mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    });

    describe('acceptAnswer', () => {
        it('should call toggle_accepted_answer RPC with correct params', async () => {
            await acceptAnswer('q-1', 'a-1');
            expect(mockRpc).toHaveBeenCalledWith('toggle_accepted_answer', {
                p_question_id: 'q-1',
                p_answer_id: 'a-1'
            });
        });

        it('should return error if unauthorized (no user)', async () => {
            mockGetUser.mockResolvedValue({ data: { user: null } });
            const result = await acceptAnswer('q-1', 'a-1');
            expect(result.error).toBe('Unauthorized');
            expect(mockRpc).not.toHaveBeenCalled();
        });

        it('should return error if RPC fails', async () => {
            mockRpc.mockResolvedValue({ data: null, error: { message: 'RPC Error' } });
            const result = await acceptAnswer('q-1', 'a-1');
            expect(result.error).toBe('RPC Error');
        });
    });

    describe('vote', () => {
        it('should call handle_vote RPC with correct params for UP vote', async () => {
            await vote('question', 'q-1', 'up');
            expect(mockRpc).toHaveBeenCalledWith('handle_vote', {
                p_user_id: 'user-123',
                p_resource_id: 'q-1',
                p_resource_type: 'question',
                p_direction: 'up'
            });
        });

        it('should call handle_vote RPC with correct params for DOWN vote', async () => {
            await vote('answer', 'a-1', 'down');
            expect(mockRpc).toHaveBeenCalledWith('handle_vote', {
                p_user_id: 'user-123',
                p_resource_id: 'a-1',
                p_resource_type: 'answer',
                p_direction: 'down'
            });
        });

        it('should return error if unauthorized', async () => {
            mockGetUser.mockResolvedValue({ data: { user: null } });
            const result = await vote('question', 'q-1', 'up');
            expect(result.error).toBe('Unauthorized');
        });
    });
});
