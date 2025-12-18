import { getAnalyticsData } from '@/features/admin-dashboard/actions';
import { AnalyticsMap } from '@/features/admin-dashboard/components/analytics/analytics-map';
import { TechStackChart } from '@/features/admin-dashboard/components/analytics/tech-stack-chart';
import { RoleDistributionChart } from '@/features/admin-dashboard/components/analytics/role-distribution-chart';
import { UserGrowthChart } from '@/features/admin-dashboard/components/analytics/user-growth-chart';
import { StatsCard } from '@/features/admin-dashboard/components/stats-card';
import { RecentActivity } from '@/features/admin-dashboard/components/recent-activity';
import {
    Users,
    Code,
    Crown,
    Target,
    Clock,
    DollarSign,
    TrendingUp
} from 'lucide-react';

export default async function AdminDashboardPage() {
    const { data, error } = await getAnalyticsData();

    if (error || !data) {
        return (
            <div className="p-8 text-center text-destructive">
                Failed to load analytics data: {error}
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            </div>

            {/* Metrics Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Users"
                    value={data.totalUsers}
                    icon={Users}
                    trend={data.userGrowthRate}
                    trendLabel="from last month"
                    description="Registered developers"
                />
                <StatsCard
                    title="Active Bounties"
                    value={data.activeBounties}
                    icon={Target}
                    trendLabel="Currently open"
                    description="Opportunities available"
                />
                <StatsCard
                    title="Total Rewards"
                    value={`RM ${data.totalRewards.toLocaleString()}`}
                    icon={DollarSign}
                    description="Total bounty value"
                />
                <StatsCard
                    title="Bounty Growth"
                    value={`${data.bountyGrowthRate}%`}
                    icon={TrendingUp}
                    trend={data.bountyGrowthRate}
                    trendLabel="from last month"
                    description="Platform scaling"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* User Growth - Wide (4 cols) */}
                <div className="col-span-full lg:col-span-4">
                    <UserGrowthChart data={data.userGrowth} />
                </div>

                {/* Role Distribution - Side (3 cols) */}
                <div className="col-span-full md:col-span-1 lg:col-span-3">
                    <RoleDistributionChart data={data.roleDistribution} />
                </div>

                {/* Second Row */}

                {/* Recent Activity - Side (3 cols) */}
                <div className="col-span-full md:col-span-1 lg:col-span-3 h-full">
                    <RecentActivity
                        recentUsers={data.recentUsers}
                        recentBounties={data.recentBounties}
                    />
                </div>

                {/* Tech Stack - Wide (4 cols) */}
                <div className="col-span-full lg:col-span-4">
                    <TechStackChart data={data.stackDistribution} />
                </div>
            </div>

            {/* Bottom Row - Map */}
            <div className="grid gap-4 grid-cols-1">
                <div className="col-span-1">
                    <AnalyticsMap data={data.locationDistribution} />
                </div>
            </div>
        </div>
    );
}
