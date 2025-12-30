"use client";

import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface TechStackChartProps {
    data: { name: string; value: number }[];
    totalUsers?: number;
}

const CustomTooltip = ({ active, payload, label, totalUsers }: any) => {
    if (active && payload && payload.length) {
        const count = payload[0].value;
        const percentage = totalUsers ? ((count / totalUsers) * 100).toFixed(1) : 0;

        return (
            <div className="bg-popover border border-border p-3 rounded-lg shadow-xl">
                <p className="font-semibold text-popover-foreground mb-1">{label}</p>
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Users:</span>
                    <span className="font-mono font-medium text-foreground">{count}</span>
                </div>
                {totalUsers && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>Penetration:</span>
                        <span className="text-primary font-medium">{percentage}%</span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export function TechStackChart({ data, totalUsers }: TechStackChartProps) {
    return (
        <div className="w-full h-[400px] border-2 border-border rounded-lg bg-card/40 backdrop-blur-sm p-6 flex flex-col hover:border-border/80 transition-all duration-300">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">Top Tech Stacks</h3>
                <p className="text-sm text-muted-foreground">Most popular technologies among developers</p>
            </div>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                        <defs>
                            <linearGradient id="techBarGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="var(--neon-primary)" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="var(--neon-secondary)" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.3} />
                        <XAxis
                            type="number"
                            stroke="var(--muted-foreground)"
                            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="var(--muted-foreground)"
                            width={100}
                            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip totalUsers={totalUsers} />} cursor={{ fill: 'var(--muted)' }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="url(#techBarGradient)" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
