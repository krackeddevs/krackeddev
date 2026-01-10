import { XPEvent, ContributionStats, BountyStats } from "../types";

/**
 * Translates a database XP event into "System Speak" for the HUD terminal.
 */
export function mapEventToSystemSpeak(event: XPEvent): string {
    const time = new Date(event.createdAt).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const prefix = `[${time}] > `;

    switch (event.eventType) {
        case 'daily_login':
            return `${prefix}NODE_AUTH_SUCCESS: +${event.xpAmount}XP - Session validated.`;
        case 'github_contribution':
            return `${prefix}COMMS_SYNC: +${event.xpAmount}XP - External repository pulse detected.`;
        case 'bounty_submission':
            return `${prefix}UPLINK_ESTABLISHED: +${event.xpAmount}XP - Project data packet transmitted.`;
        case 'bounty_win':
            return `${prefix}TARGET_NEUTRALIZED: +${event.xpAmount}XP - Bounty objective secured.`;
        case 'streak_milestone':
            return `${prefix}STABILITY_LOCK: +${event.xpAmount}XP - Maintaining continuous operation streak.`;
        case 'profile_completion':
            return `${prefix}IDENTITY_VERIFIED: +${event.xpAmount}XP - User profile parameters optimized.`;
        case 'ask_question':
            return `${prefix}QUERY_BROADCAST: +${event.xpAmount}XP - Seeking system clarification.`;
        case 'answer_question':
            return `${prefix}KNOWLEDGE_TRANSFER: +${event.xpAmount}XP - Providing node heuristics.`;
        case 'answer_accepted':
            return `${prefix}SOLUTION_VERIFIED: +${event.xpAmount}XP - Knowledge contribution validated.`;
        case 'upvote_received':
            return `${prefix}REPUTATION_FLARE: +${event.xpAmount}XP - Node resonance increasing.`;
        case 'manual_adjustment':
            return `${prefix}KERNEL_OVERRIDE: ${event.xpAmount > 0 ? '+' : ''}${event.xpAmount}XP - System administrator adjustment.`;
        default:
            return `${prefix}DATA_PACKET: +${event.xpAmount}XP - Type: ${(event.eventType as string).toUpperCase()}`;
    }
}

/**
 * Calculates dynamic HUD metrics based on user profile and stats.
 */
export function calculateSystemMetrics(
    profile: any,
    contributionStats: ContributionStats | null,
    bountyStats: BountyStats | null
) {
    // Signal Stability: Based on freshest available timestamp (sync or last contribution)
    let signalStability = 0;
    const lastSyncStr = profile?.portfolio_synced_at || contributionStats?.lastContributionDate;

    if (lastSyncStr) {
        const lastSync = new Date(lastSyncStr).getTime();
        const now = Date.now();
        const diffHours = (now - lastSync) / (1000 * 60 * 60);

        if (diffHours < 24) signalStability = 95 + Math.random() * 5;
        else if (diffHours < 72) signalStability = 85 + Math.random() * 10; // 3 days
        else if (diffHours < 24 * 7) signalStability = 70 + Math.random() * 15;
        else signalStability = 40 + Math.random() * 20;
    } else {
        signalStability = 30 + Math.random() * 20;
    }

    // Archive Grade: Based on level, wins, AND consistency (streak)
    let archiveGrade = "D";
    const level = profile?.level || 1;
    const wins = bountyStats?.totalWins || 0;
    const streak = contributionStats?.currentStreak || 0;

    // Highest wins/level or massive streak
    if (level >= 50 || wins >= 10 || streak >= 100) archiveGrade = "S";
    else if (level >= 30 || wins >= 5 || streak >= 50) archiveGrade = "A";
    else if (level >= 15 || wins >= 2 || streak >= 21) archiveGrade = "B";
    else if (level >= 5 || streak >= 7) archiveGrade = "C";

    // Node Uptime: Based on currentStreak
    let nodeUptime = 0;
    if (streak === 0) nodeUptime = 10 + Math.random() * 10; // Even 0 has some baseline heart-beat
    else if (streak <= 3) nodeUptime = 30 + (streak * 10);
    else if (streak <= 7) nodeUptime = 70 + ((streak - 3) * 5);
    else nodeUptime = 92 + Math.min(8, (streak - 7) * 0.5);

    return {
        signalStability: Math.round(signalStability),
        archiveGrade,
        nodeUptime: Math.round(nodeUptime)
    };
}
