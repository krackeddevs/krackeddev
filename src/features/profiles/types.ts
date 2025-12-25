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
