import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    grantXP,
    checkAndGrantDailyLoginXP,
    checkAndGrantStreakBonuses,
    checkAndGrantContributionXP,
    calculateLevelFromXP,
    calculateXPForLevel,
    calculateXPForNextLevel,
    calculateXPProgress,
    XP_CONFIG,
    XP_RATES
} from './xp-system';
import { GithubContributionCalendar } from './types';

describe('XP Calculation Logic', () => {
    describe('calculateLevelFromXP', () => {
        it('should return 1 for 0 XP', () => {
            expect(calculateLevelFromXP(0)).toBe(1);
        });

        it('should return 1 for 99 XP', () => {
            // Level 2 requires 100 XP
            expect(calculateLevelFromXP(99)).toBe(1);
        });

        it('should return 2 for 100 XP', () => {
            expect(calculateLevelFromXP(100)).toBe(2);
        });

        it('should return 3 for 400 XP', () => {
            expect(calculateLevelFromXP(400)).toBe(3);
        });

        it('should handle negative XP safely', () => {
            expect(calculateLevelFromXP(-100)).toBe(1);
        });

        it('should respect max level cap', () => {
            const maxXP = Math.pow(XP_CONFIG.MAX_LEVEL, 2) * XP_CONFIG.BASE_MULTIPLIER;
            expect(calculateLevelFromXP(maxXP + 1000)).toBe(XP_CONFIG.MAX_LEVEL);
        });
    });

    describe('calculateXPForLevel', () => {
        it('should return 0 for level 1', () => {
            expect(calculateXPForLevel(1)).toBe(0);
        });

        it('should return 100 for level 2', () => {
            expect(calculateXPForLevel(2)).toBe(100);
        });

        it('should return 400 for level 3', () => {
            expect(calculateXPForLevel(3)).toBe(400);
        });
    });

    describe('calculateXPForNextLevel', () => {
        it('should return 100 for current level 1', () => {
            expect(calculateXPForNextLevel(1)).toBe(100);
        });

        it('should return 400 for current level 2', () => {
            expect(calculateXPForNextLevel(2)).toBe(400);
        });

        it('should return Infinity for max level', () => {
            expect(calculateXPForNextLevel(XP_CONFIG.MAX_LEVEL)).toBe(Infinity);
        });
    });

    describe('calculateXPProgress', () => {
        it('should calculate 0% progress at start of level', () => {
            const progress = calculateXPProgress(100);
            expect(progress.currentLevel).toBe(2);
            expect(progress.progressPercentage).toBe(0);
            expect(progress.xpInCurrentLevel).toBe(0);
        });

        it('should calculate 50% progress correctly', () => {
            // Level 1: 0-100 XP. 50 XP is 50%
            const progress = calculateXPProgress(50);
            expect(progress.currentLevel).toBe(1);
            expect(progress.progressPercentage).toBe(50);
            expect(progress.xpNeededForNext).toBe(50);
        });

        it('should calculate progress for higher levels', () => {
            // Level 2: 100 XP -> Level 3: 400 XP. Range is 300 XP.
            // 250 XP total = 100 (base) + 150 (in level).
            // 150 / 300 = 50%
            const progress = calculateXPProgress(250);
            expect(progress.currentLevel).toBe(2);
            expect(progress.xpForCurrentLevel).toBe(100);
            expect(progress.xpForNextLevel).toBe(400);
            expect(progress.xpInCurrentLevel).toBe(150);
            expect(progress.progressPercentage).toBe(50);
        });

        it('should handle max level progress', () => {
            const maxXP = Math.pow(XP_CONFIG.MAX_LEVEL, 2) * XP_CONFIG.BASE_MULTIPLIER;
            const progress = calculateXPProgress(maxXP);
            expect(progress.currentLevel).toBe(XP_CONFIG.MAX_LEVEL);
            expect(progress.progressPercentage).toBe(100);
            expect(progress.xpNeededForNext).toBe(0);
        });
    });
});


// Mock Supabase client
const mockInsert = vi.fn();
const mockSingle = vi.fn();
const mockMaybeSingle = vi.fn();
const mockUpdate = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockContains = vi.fn();

// Create a builder object 
const mockBuilder: any = {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    eq: mockEq,
    order: mockOrder,
    limit: mockLimit,
    contains: mockContains,
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
};

// Wiring return values to support chaining
mockSelect.mockReturnValue(mockBuilder);
mockUpdate.mockReturnValue(mockBuilder);
mockEq.mockReturnValue(mockBuilder);
mockOrder.mockReturnValue(mockBuilder);
// mockLimit should return an object that has maybeSingle
mockLimit.mockReturnValue({ maybeSingle: mockMaybeSingle });
mockContains.mockReturnValue(mockBuilder);

// Explicitly set return values again in case they were lost (paranoid check)
mockLimit.mockReturnValue({ maybeSingle: mockMaybeSingle });

const mockFrom = vi.fn().mockReturnValue(mockBuilder);

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(() => ({
        from: mockFrom,
        auth: {
            getUser: vi.fn(),
        }
    })),
}));

describe('grantXP', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Restore chainable return values
        mockSelect.mockReturnValue(mockBuilder);
        mockUpdate.mockReturnValue(mockBuilder);
        mockEq.mockReturnValue(mockBuilder);
        mockOrder.mockReturnValue(mockBuilder);
        mockLimit.mockReturnValue({ maybeSingle: mockMaybeSingle });
        mockContains.mockReturnValue(mockBuilder);

        // Default success responses
        mockSingle.mockResolvedValue({ data: { xp: 100, level: 1 } });
        mockMaybeSingle.mockResolvedValue({ data: { xp: 100, level: 1 } });
        mockInsert.mockResolvedValue({ error: null });
    });

    it('should grant XP and create event record', async () => {
        const result = await grantXP('user-123', 'daily_login', 10);

        expect(result.success).toBe(true);
        expect(result.xpGained).toBe(10);
        expect(result.newXP).toBe(110);
        expect(mockInsert).toHaveBeenCalledWith({
            user_id: 'user-123',
            event_type: 'daily_login',
            xp_amount: 10,
            metadata: {}
        });
        expect(mockUpdate).toHaveBeenCalledWith({ xp: 110, level: 2 });
    });

    it('should handle level up correctly', async () => {
        // Current XP 90, Level 1
        mockSingle.mockResolvedValue({ data: { xp: 90, level: 1 } });

        const result = await grantXP('user-123', 'bounty_submission', 50);

        expect(result.success).toBe(true);
        expect(result.newXP).toBe(140);
        expect(result.xpGained).toBe(50);
    });

    it('should return error if user not found', async () => {
        mockSingle.mockResolvedValue({ data: null, error: { message: 'Not found' } });

        const result = await grantXP('missing-user', 'daily_login', 10);

        expect(result.success).toBe(false);
        expect(result.error).toBe('User not found');
    });
});

describe('checkAndGrantDailyLoginXP', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: User last login was old
        mockSingle.mockResolvedValue({ data: { last_xp_grant_date: '2020-01-01', xp: 100, level: 1 } });
    });

    it('should grant XP on first login of day', async () => {
        const result = await checkAndGrantDailyLoginXP('user-123');

        expect(result).not.toBeNull();
        expect(result?.xpGained).toBe(XP_RATES.DAILY_LOGIN);
        // Updates last_login, then grants XP
        expect(mockUpdate).toHaveBeenCalledTimes(2);
    });

    it('should not grant XP on second login same day', async () => {
        const today = new Date().toISOString().split('T')[0];
        mockSingle.mockResolvedValue({ data: { last_xp_grant_date: today, xp: 110, level: 1 } });

        const result = await checkAndGrantDailyLoginXP('user-123');

        expect(result).toBeNull();
        expect(mockUpdate).not.toHaveBeenCalled();
    });
});

describe('checkAndGrantStreakBonuses', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: Grant XP logic will succeed
        mockSingle.mockResolvedValue({ data: { xp: 100, level: 1 } });
        // Default: No existing milestone bonus found
        mockLimit.mockReturnValue({ data: [] });
    });

    it('should grant bonus for 7 day streak', async () => {
        const result = await checkAndGrantStreakBonuses('user-123', 7);

        expect(result).toHaveLength(1);
        expect(result[0].xpGained).toBe(XP_RATES.STREAK_MILESTONES[7]);
        expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
            event_type: 'streak_milestone',
            metadata: expect.objectContaining({ streak_length: 7 })
        }));
    });

    it('should NOT grant bonus if already awarded', async () => {
        // Simulate existing milestone (must mock return value properly for .limit(1))
        mockLimit.mockResolvedValue({ data: [{ id: 'existing-event-id' }] });

        const result = await checkAndGrantStreakBonuses('user-123', 7);

        expect(result).toHaveLength(0);
        expect(mockInsert).not.toHaveBeenCalled();
    });
});

describe.skip('checkAndGrantContributionXP', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSingle.mockResolvedValue({ data: { xp: 100, level: 1 } });
        mockMaybeSingle.mockResolvedValue({ data: { metadata: { date: '2025-01-01' } } });
    });

    it('should grant XP for new contribution days', async () => {
        // Last grant was 2025-01-01. New contributions on 2025-01-02.
        const stats: GithubContributionCalendar = {
            totalContributions: 5,
            weeks: [
                {
                    contributionDays: [
                        { date: '2025-01-02', contributionCount: 5, color: '', weekday: 1 },
                        { date: '2025-01-01', contributionCount: 5, color: '', weekday: 0 } // Old one
                    ]
                }
            ]
        };

        const result = await checkAndGrantContributionXP('user-123', stats);

        expect(result).toHaveLength(1); // Only 1 new day
        expect(result[0].xpGained).toBe(XP_RATES.GITHUB_CONTRIBUTION_PER_DAY);
        expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
            event_type: 'github_contribution',
            metadata: expect.objectContaining({ date: '2025-01-02' })
        }));
    });

    it('should grant nothing if no new days', async () => {
        // Last grant was 2025-01-02. Contributions only up to 2025-01-02.
        mockMaybeSingle.mockResolvedValue({ data: { metadata: { date: '2025-01-02' } } });

        const stats: GithubContributionCalendar = {
            totalContributions: 5,
            weeks: [
                {
                    contributionDays: [
                        { date: '2025-01-02', contributionCount: 5, color: '', weekday: 1 }
                    ]
                }
            ]
        };

        const result = await checkAndGrantContributionXP('user-123', stats);

        expect(result).toHaveLength(0);
        expect(mockInsert).not.toHaveBeenCalled();
    });
});
