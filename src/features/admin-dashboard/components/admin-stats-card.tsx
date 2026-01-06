import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    isLoading?: boolean;
}

export function AdminStatsCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    isLoading,
}: AdminStatsCardProps) {
    if (isLoading) {
        return (
            <Card className="border-border bg-card/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-mono">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </CardTitle>
                    <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                    <div className="h-8 w-20 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-2 border-border/50 bg-card/40 backdrop-blur-sm hover:border-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/5 hover:shadow-[0_0_30px_rgba(var(--neon-primary-rgb),0.1)] hover:-translate-y-1 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold font-mono text-[var(--neon-primary)] uppercase tracking-wider">{title}</CardTitle>
                <Icon className="h-4 w-4 text-[var(--neon-primary)] group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-black font-mono text-foreground tracking-tight">{value}</div>
                {(description || trend) && (
                    <div className="flex items-center gap-2 mt-1">
                        {trend && (
                            <span
                                className={cn(
                                    "flex items-center gap-1 text-[10px] font-bold font-mono uppercase",
                                    trend.isPositive ? "text-[var(--neon-primary)]" : "text-red-500/80"
                                )}
                            >
                                {trend.isPositive ? (
                                    <TrendingUp className="h-3 w-3" />
                                ) : (
                                    <TrendingDown className="h-3 w-3" />
                                )}
                                {Math.abs(trend.value)}%
                            </span>
                        )}
                        {description && (
                            <p className="text-[10px] text-foreground/40 font-mono uppercase tracking-tight">{description}</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
