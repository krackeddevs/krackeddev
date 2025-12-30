"use client";

import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface RoleDistributionChartProps {
    data: { name: string; value: number }[];
}

const COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    'var(--chart-1)', // Repeat safely
];

export function RoleDistributionChart({ data }: RoleDistributionChartProps) {
    return (
        <div className="w-full h-[250px] md:h-[400px] border-2 border-border rounded-lg bg-card/40 backdrop-blur-sm p-4 hover:border-border/80 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Developer Roles</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="50%"
                        outerRadius="75%"
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', color: 'var(--popover-foreground)' }}
                    />
                    <Legend verticalAlign="top" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
