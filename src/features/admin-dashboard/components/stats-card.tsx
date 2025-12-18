import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: number; // Percentage
    trendLabel?: string;
    className?: string;
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    trendLabel,
    className
}: StatsCardProps) {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend !== undefined) && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        {trend !== undefined && (
                            <span className={cn(
                                "flex items-center font-medium",
                                trend > 0 ? "text-emerald-500" : trend < 0 ? "text-rose-500" : "text-muted-foreground"
                            )}>
                                {trend > 0 ? '+' : ''}{trend}%
                            </span>
                        )}
                        <span className="truncate">
                            {trendLabel || description}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
