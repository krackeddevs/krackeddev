export interface GithubContributionDay {
    color: string;
    contributionCount: number;
    date: string;
    weekday: number;
}

export interface GithubContributionWeek {
    contributionDays: GithubContributionDay[];
}

export interface GithubLanguage {
    name: string;
    color: string;
    percentage: number;
}

export interface TopHunter {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    developer_role: string | null;
    location: string | null;
    totalWins: number;
    totalEarnings: number;
}
// Adding the container type for consistency
export interface GithubContributionCalendar {
    totalContributions: number;
    weeks: GithubContributionWeek[];
}

export interface GithubStats {
    totalContributions: number;
    contributionCalendar: GithubContributionWeek[]; // This might be misnamed in GithubStats compared to raw GQL, but we'll stick to valid types.
    topLanguages: GithubLanguage[];
    username: string; // GitHub username
    avatarUrl: string;
}

export interface BountyStats {
    totalWins: number;
    totalEarnings: number;
}

export interface UserSubmission {
    id: string;
    bountySlug: string;
    bountyTitle: string;
    bountyReward: number;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
    paidAt: string | null; // If set, user WON this bounty
}

export type ContributionStats = {
    currentStreak: number;
    longestStreak: number;
    contributionsThisWeek: number;
    lastContributionDate: string | null;
    level?: number;
    xp?: number;
};

export type DevPulseDataPoint = {
    label: string;
    count: number;
    date?: string; // Optional full date for tooltips
};

export type DevPulseData = {
    weekly: DevPulseDataPoint[];
    monthly: DevPulseDataPoint[];
    yearly: DevPulseDataPoint[];
};

export interface XPEvent {
    id: string;
    userId: string;
    eventType: 'daily_login' | 'github_contribution' | 'bounty_submission' | 'bounty_win' | 'streak_milestone' | 'profile_completion' | 'manual_adjustment' | 'ask_question' | 'answer_question' | 'answer_accepted' | 'upvote_received';
    xpAmount: number;
    metadata: Record<string, any>;
    createdAt: string;
}

export interface LeaderboardEntry {
    id: string;
    username: string;
    avatar_url: string | null;
    level: number;
    xp: number;
    rank: number;
    developer_role: string | null;
    stack?: string[] | null;
}

export type LeaderboardTimeframe = 'all-time' | 'week';

export interface ActiveContributor {
    id: string;
    username: string;
    avatar_url: string | null;
    activity_score: number;
    github_commits_30d: number;
    community_score: number;
    streak_days: number;
    level: number;
    rank: number;
    developer_role: string | null;
}
