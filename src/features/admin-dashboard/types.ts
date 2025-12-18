import { BountyInput } from './schemas';

export interface ActionResult<T> {
    data: T | null;
    error: string | null;
}

export type BountyInputData = BountyInput;

export interface AnalyticsData {
    // Metrics
    totalUsers: number;
    userGrowthRate: number; // Percentage
    totalBounties: number;
    activeBounties: number;
    completedBounties: number;
    bountyGrowthRate: number; // Percentage
    totalRewards: number;

    // Charts
    locationDistribution: { name: string; value: number }[];
    stackDistribution: { name: string; value: number }[];
    roleDistribution: { name: string; value: number }[];
    userGrowth: { date: string; count: number }[];

    // Recent Activity
    recentUsers: {
        id: string;
        name: string;
        email: string;
        role: string;
        joinedAt: string;
        avatar?: string;
    }[];
    recentBounties: {
        id: string;
        title: string;
        status: string;
        reward: number;
        createdAt: string;
    }[];
}
