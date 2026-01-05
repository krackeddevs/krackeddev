import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PollWidgetSkeleton() {
    return (
        <div className="mb-12 bg-card/30 border border-neon-cyan/20 p-6 rounded-lg relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl -z-10"></div>

            <div className="space-y-6">
                {/* Header Skeleton */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-2 h-2 rounded-full" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                </div>

                {/* Bounty Options Skeleton */}
                <div className="grid gap-4">
                    {[1, 2].map((i) => (
                        <Card key={i} className="border-border/50 bg-card/40">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-6 w-48" />
                                            <Skeleton className="h-5 w-20" />
                                        </div>
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                {/* Vote Button Skeleton */}
                <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    );
}
