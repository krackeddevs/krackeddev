import { createClient } from "@/lib/supabase/server";

export const XP_RATES = {
    DAILY_LOGIN: 10,
    GITHUB_CONTRIBUTION_PER_DAY: 5,
    BOUNTY_SUBMISSION: 20,
    BOUNTY_WIN_BASE: 50,
    PROFILE_COMPLETION: 30,
    STREAK_MILESTONES: {
        7: 50,   // 1 week
        30: 200, // 1 month
        90: 500  // 3 months
    }
} as const;

export type XPEventType =
    | 'daily_login'
    | 'github_contribution'
    | 'bounty_submission'
    | 'bounty_win'
    | 'streak_milestone'
    | 'profile_completion'
    | 'manual_adjustment'
    | 'ask_question'
    | 'answer_question'
    | 'answer_accepted'
    | 'upvote_received';

export interface XPGrantResult {
    success: boolean;
    newXP: number;
    newLevel: number;
    leveledUp: boolean;
    xpGained: number;
    error?: string;
}

// Exponential progression config aligning with existing formula: Level = floor(sqrt(XP / 100)) + 1
// This means: XP_needed = (Level-1)^2 * 100
// Level 1: 0 XP
// Level 2: 100 XP (1^2 * 100)
// Level 3: 400 XP (2^2 * 100)
export const XP_CONFIG = {
    PROGRESSION_TYPE: 'exponential' as const,
    BASE_MULTIPLIER: 100,
    MAX_LEVEL: 100 // Cap to prevent infinity issues
};

export interface XPProgress {
    currentXP: number;
    currentLevel: number;
    xpForCurrentLevel: number;  // XP at start of current level
    xpForNextLevel: number;     // XP needed to reach next level
    xpInCurrentLevel: number;   // XP earned in current level
    xpNeededForNext: number;    // XP remaining to next level
    progressPercentage: number; // 0-100%
}

/**
 * Calculate level based on total XP.
 * Formula: Level = floor(sqrt(XP / 100)) + 1
 */
export function calculateLevelFromXP(xp: number): number {
    if (xp < 0) return 1;

    // Inverse of (Level-1)^2 * 100 
    const level = Math.floor(Math.sqrt(xp / XP_CONFIG.BASE_MULTIPLIER)) + 1;

    if (level > XP_CONFIG.MAX_LEVEL) {
        return XP_CONFIG.MAX_LEVEL;
    }

    return level;
}

/**
 * Calculate total XP required to reach the start of a specific level.
 * Formula: (Level-1)^2 * 100
 */
export function calculateXPForLevel(level: number): number {
    if (level <= 1) return 0;
    if (level > XP_CONFIG.MAX_LEVEL) return Infinity;

    // XP to reach Level N is determined by completing Level N-1
    // The existing formula implies we reach Level 2 at 100 XP.
    // Level 2 -> (2-1)^2 * 100 = 100 XP
    // Level 3 -> (3-1)^2 * 100 = 400 XP
    return Math.pow(level - 1, 2) * XP_CONFIG.BASE_MULTIPLIER;
}

/**
 * Calculate XP needed for the NEXT level based on current level.
 * Returns total accumulated XP required.
 */
export function calculateXPForNextLevel(currentLevel: number): number {
    if (currentLevel >= XP_CONFIG.MAX_LEVEL) {
        return Infinity;
    }
    return calculateXPForLevel(currentLevel + 1);
}

/**
 * Calculate detailed XP progress for UI display.
 */
export function calculateXPProgress(totalXP: number): XPProgress {
    const currentLevel = calculateLevelFromXP(totalXP);
    const xpForCurrentLevel = calculateXPForLevel(currentLevel);

    let xpForNextLevel: number;
    let progressPercentage: number;

    if (currentLevel >= XP_CONFIG.MAX_LEVEL) {
        xpForNextLevel = xpForCurrentLevel; // Capped
        progressPercentage = 100;
    } else {
        xpForNextLevel = calculateXPForNextLevel(currentLevel);
        // Progress within the level
        const xpInCurrentLevel = totalXP - xpForCurrentLevel;
        const totalXPNeededForLevel = xpForNextLevel - xpForCurrentLevel;

        if (totalXPNeededForLevel <= 0) {
            progressPercentage = 100;
        } else {
            progressPercentage = (xpInCurrentLevel / totalXPNeededForLevel) * 100;
        }
    }

    // Clamp percentage
    progressPercentage = Math.min(100, Math.max(0, progressPercentage));

    return {
        currentXP: totalXP,
        currentLevel,
        xpForCurrentLevel,
        xpForNextLevel,
        xpInCurrentLevel: Math.max(0, totalXP - xpForCurrentLevel),
        xpNeededForNext: Math.max(0, xpForNextLevel - totalXP),
        progressPercentage
    };
}

/**
 * Grant XP to a user and create an xp_event record.
 * Updates user's xp and level in profiles table.
 */
export async function grantXP(
    userId: string,
    eventType: XPEventType,
    amount: number,
    metadata: Record<string, any> = {}
): Promise<XPGrantResult> {
    const supabase = await createClient();

    // 1. Fetch current user stats
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', userId)
        .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userProfile = profile as any;

    if (profileError || !profile) {
        return {
            success: false,
            newXP: 0,
            newLevel: 1,
            leveledUp: false,
            xpGained: 0,
            error: 'User not found'
        };
    }

    // 2. Calculate new XP and level
    const currentXP = userProfile.xp || 0;
    const currentLevel = userProfile.level || 1;
    const newXP = currentXP + amount;
    const newLevel = calculateLevelFromXP(newXP);
    const leveledUp = newLevel > currentLevel;

    // 3. Create xp_event record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: eventError } = await (supabase.from('xp_events') as any)
        .insert({
            user_id: userId,
            event_type: eventType,
            xp_amount: amount,
            metadata
        });

    if (eventError) {
        // Handle duplicate key error (unique constraint violation)
        // This happens if multiple requests try to grant the same daily XP at once
        // or if the user already received XP for this unique constraint.
        if ((eventError as any).code === '23505') {
            return {
                success: true, // The goal was already achieved previously
                newXP: currentXP,
                newLevel: currentLevel,
                leveledUp: false,
                xpGained: 0
            };
        }

        console.error('Failed to create xp_event:', JSON.stringify(eventError, null, 2));
        console.error('Event details:', { userId, eventType, amount, metadata });
        // CRITICAL: Do NOT update user profile if event logging failed (likely unique constraint violation)
        return {
            success: false,
            newXP: currentXP,
            newLevel: currentLevel,
            leveledUp: false,
            xpGained: 0,
            error: `Failed to record XP event: ${eventError.message}`
        };
    }

    // 4. Update user's xp and level
    const { error: updateError } = await (supabase.from('profiles') as any)
        .update({ xp: newXP, level: newLevel })
        .eq('id', userId);

    if (updateError) {
        console.error('Failed to update profile XP:', updateError);
        return {
            success: false,
            newXP: currentXP,
            newLevel: currentLevel,
            leveledUp: false,
            xpGained: 0,
            error: 'Failed to update profile'
        };
    }

    return {
        success: true,
        newXP,
        newLevel,
        leveledUp,
        xpGained: amount
    };
}

/**
 * Check if user qualifies for daily login XP and grant if eligible.
 */
export async function checkAndGrantDailyLoginXP(
    userId: string
): Promise<XPGrantResult | null> {
    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0];

    // Atomic update: only update if last_xp_grant_date is not today (or is null)
    // We use .neq to catch both cases (NULL or different date)
    const { data: updateResult, error: updateError } = await (supabase.from('profiles') as any)
        .update({
            last_login_at: new Date().toISOString(),
            last_xp_grant_date: today
        })
        .match({ id: userId })
        .not('last_xp_grant_date', 'eq', today)
        .select();

    if (updateError) {
        console.error("Failed to update last_xp_grant_date:", updateError);
        return null;
    }

    // If no rows were updated, it means the user already got XP today
    if (!updateResult || updateResult.length === 0) {
        return null;
    }

    // Grant daily login XP
    return await grantXP(userId, 'daily_login', XP_RATES.DAILY_LOGIN, { date: today });
}

/**
 * Check if user reached new streak milestones and grant bonuses.
 */
export async function checkAndGrantStreakBonuses(
    userId: string,
    currentStreak: number
): Promise<XPGrantResult[]> {
    const supabase = await createClient();
    const results: XPGrantResult[] = [];

    // Define milestones
    const milestones = [
        { days: 7, xp: 50, tier: 'bronze' },
        { days: 30, xp: 200, tier: 'silver' },
        { days: 90, xp: 500, tier: 'gold' }
    ];

    for (const milestone of milestones) {
        if (currentStreak >= milestone.days) {
            // Check if already awarded this milestone
            const { data: existing } = await supabase
                .from('xp_events')
                .select('id')
                .eq('user_id', userId)
                .eq('event_type', 'streak_milestone')
                .contains('metadata', { streak_length: milestone.days })
                .limit(1);

            if (!existing || existing.length === 0) {
                // Grant milestone bonus
                const result = await grantXP(
                    userId,
                    'streak_milestone',
                    milestone.xp,
                    {
                        streak_length: milestone.days,
                        milestone_tier: milestone.tier
                    }
                );
                results.push(result);
            }
        }
    }

    return results;
}

import { GithubContributionCalendar } from "./types";

/**
 * Check for new GitHub contribution days and grant XP.
 * Leverages existing GitHub sync mechanism from Epic 7.
 */
export async function checkAndGrantContributionXP(
    userId: string,
    contributionStats: GithubContributionCalendar | null
): Promise<XPGrantResult[]> {
    if (!contributionStats || !contributionStats.weeks) {
        return [];
    }

    const supabase = await createClient();
    const results: XPGrantResult[] = [];

    // 1. Get last XP grant date for contributions
    // We'll use a specific query for the last github_contribution event to be more precise than profile.last_xp_grant_date
    // effectively "last time we granted github XP"
    const { data: lastEventData } = await supabase
        .from('xp_events')
        .select('metadata')
        .eq('user_id', userId)
        .eq('event_type', 'github_contribution')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lastEvent = lastEventData as any;

    let lastGrantDate: Date | null = null;
    if (lastEvent?.metadata?.date) {
        lastGrantDate = new Date(lastEvent.metadata.date);
    } else {
        // Fallback or first time:
        // Limit retroactive grants to last 30 days if no history, to avoid massive initial XP bomb for really old accounts linking now.
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        lastGrantDate = thirtyDaysAgo;
    }


    // 2. Flatten all contribution days from GitHub calendar
    const allDays = contributionStats.weeks
        .flatMap(week => week.contributionDays)
        .filter(day => day.contributionCount > 0); // Only days with contributions

    // 3. Filter for days AFTER last grant (to avoid duplicates)
    const newContributionDays = allDays.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate > lastGrantDate!;
    });

    // 4. Grant XP for each new contribution day (5 XP per day)
    for (const day of newContributionDays) {
        const result = await grantXP(
            userId,
            'github_contribution',
            XP_RATES.GITHUB_CONTRIBUTION_PER_DAY,
            {
                date: day.date,
                contribution_count: day.contributionCount
            }
        );
        results.push(result);
    }

    return results;
}

/**
 * Calculate bonus XP for bounty wins based on value.
 * Formula: base 50 XP + (bounty_value / 10) bonus
 */
export function calculateBountyWinXP(bountyValue: number): number {
    const base = XP_RATES.BOUNTY_WIN_BASE;
    const bonus = Math.floor(bountyValue / 10);
    return base + bonus;
}
