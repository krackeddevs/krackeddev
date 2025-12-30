"use client";

import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface UserGrowthChartProps {
    data: { date: string; count: number }[];
}

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserGrowth } from '../../actions';

interface UserGrowthChartProps {
    data: { date: string; count: number }[];
}

export function UserGrowthChart({ data: initialData }: UserGrowthChartProps) {
    const [period, setPeriod] = React.useState<'daily' | 'weekly' | 'monthly'>('monthly');
    const [data, setData] = React.useState(initialData);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        async function fetchData() {
            // Optimization: If switching back to monthly and we have initialData (assuming initial is monthly),
            // we could revert to it. But for simplicity and freshness, let's fetch.
            // Actually, getAnalyticsData defaults to monthly.

            setIsLoading(true);
            const result = await getUserGrowth(period);
            if (result.data) {
                setData(result.data);
            }
            setIsLoading(false);
        }

        fetchData();
    }, [period]);

    return (
        <div className="w-full h-[300px] md:h-[400px] border-2 border-border rounded-lg bg-card/40 backdrop-blur-sm p-4 flex flex-col hover:border-border/80 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">User Growth</h3>
                <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="w-auto">
                    <TabsList className="h-8">
                        <TabsTrigger value="daily" className="text-xs px-2 h-6">Daily</TabsTrigger>
                        <TabsTrigger value="weekly" className="text-xs px-2 h-6">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly" className="text-xs px-2 h-6">Monthly</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="flex-1 min-h-0 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-sm">
                        <div className="text-sm text-muted-foreground animate-pulse">Loading...</div>
                    </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--neon-primary)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--neon-primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            stroke="var(--muted-foreground)"
                            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                            tickFormatter={(value) => {
                                if (period === 'monthly') return value.substring(0, 7); // YYYY-MM
                                return value.substring(5); // MM-DD
                            }}
                        />
                        <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', color: 'var(--popover-foreground)' }}
                            labelStyle={{ color: 'var(--muted-foreground)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="var(--neon-primary)"
                            fillOpacity={1}
                            fill="url(#colorCount)"
                            animationDuration={500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
