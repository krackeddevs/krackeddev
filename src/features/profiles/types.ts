export interface GithubContributionDay {
    color: string;
    contributionCount: number;
    date: string;
}

export interface GithubContributionWeek {
    contributionDays: GithubContributionDay[];
}

export interface GithubLanguage {
    name: string;
    color: string;
    percentage: number;
}

export interface GithubStats {
    totalContributions: number;
    contributionCalendar: GithubContributionWeek[];
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
