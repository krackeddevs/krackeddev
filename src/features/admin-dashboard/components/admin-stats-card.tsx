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
            <Card className="border-green-500/30 bg-black/40">
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
        <Card className="border-green-500/30 bg-black/40 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-mono text-green-400 uppercase">{title}</CardTitle>
                <Icon className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold font-mono text-green-500">{value}</div>
                {(description || trend) && (
                    <div className="flex items-center gap-2 mt-1">
                        {trend && (
                            <span
                                className={cn(
                                    "flex items-center gap-1 text-xs font-medium font-mono",
                                    trend.isPositive ? "text-green-400" : "text-red-400"
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
                            <p className="text-xs text-muted-foreground font-mono">{description}</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
