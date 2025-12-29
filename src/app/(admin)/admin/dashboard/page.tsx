export const runtime = 'edge';

import { getAnalyticsData } from '@/features/admin-dashboard/actions';
import { AnalyticsMap } from '@/features/admin-dashboard/components/analytics/analytics-map';
import { TechStackChart } from '@/features/admin-dashboard/components/analytics/tech-stack-chart';
import { RoleDistributionChart } from '@/features/admin-dashboard/components/analytics/role-distribution-chart';
import { UserGrowthChart } from '@/features/admin-dashboard/components/analytics/user-growth-chart';
import { RecentActivity } from '@/features/admin-dashboard/components/recent-activity';
import { AdminPageHeader } from '@/features/admin-dashboard/components/admin-page-header';
import { AdminStatsCard } from '@/features/admin-dashboard/components/admin-stats-card';
import {
    Users,
    Target,
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
            <AdminPageHeader
                title="Dashboard Overview"
                description="Monitor platform metrics and user activity"
            />

            {/* Metrics Row */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <AdminStatsCard
                    title="Total Users"
                    value={data.totalUsers}
                    icon={Users}
                    trend={{
                        value: data.userGrowthRate,
                        isPositive: data.userGrowthRate > 0
                    }}
                    description="Registered developers"
                />
                <AdminStatsCard
                    title="Active Bounties"
                    value={data.activeBounties}
                    icon={Target}
                    description="Currently open"
                />
                <AdminStatsCard
                    title="Total Rewards"
                    value={`RM ${data.totalRewards.toLocaleString()}`}
                    icon={DollarSign}
                    description="Total bounty value"
                />
                <AdminStatsCard
                    title="Bounty Growth"
                    value={`${data.bountyGrowthRate}%`}
                    icon={TrendingUp}
                    trend={{
                        value: data.bountyGrowthRate,
                        isPositive: data.bountyGrowthRate > 0
                    }}
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
                    <TechStackChart data={data.stackDistribution} totalUsers={data.totalUsers} />
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
