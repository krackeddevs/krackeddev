'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { CreditCard, UserPlus } from "lucide-react";

interface RecentActivityProps {
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

type ActivityItem =
    | { type: 'user', data: RecentActivityProps['recentUsers'][0] }
    | { type: 'bounty', data: RecentActivityProps['recentBounties'][0] };

export function RecentActivity({ recentUsers, recentBounties }: RecentActivityProps) {
    // Merge and sort activities
    const activities: ActivityItem[] = [
        ...recentUsers.map(user => ({ type: 'user' as const, data: user })),
        ...recentBounties.map(bounty => ({ type: 'bounty' as const, data: bounty }))
    ].sort((a, b) => {
        const dateA = new Date(a.type === 'user' ? a.data.joinedAt : a.data.createdAt);
        const dateB = new Date(b.type === 'user' ? b.data.joinedAt : b.data.createdAt);
        return dateB.getTime() - dateA.getTime();
    });

    return (
        <Card className="h-full flex flex-col border-2 border-white/10 bg-black/40 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                    Latest platform events
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
                <ScrollArea className="h-[calc(100%-20px)] pr-4">
                    <div className="space-y-6 pt-2">
                        {activities.map((item, index) => (
                            <div key={`${item.type}-${item.data.id}`} className="flex items-start justify-between space-x-4">
                                <div className="flex items-start space-x-3">
                                    <div className="mt-1">
                                        {item.type === 'user' ? (
                                            <div className="p-2 bg-blue-500/10 rounded-full">
                                                <UserPlus className="w-4 h-4 text-blue-500" />
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-purple-500/10 rounded-full">
                                                <CreditCard className="w-4 h-4 text-purple-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        {item.type === 'user' ? (
                                            <>
                                                <p className="text-sm font-medium leading-none">
                                                    New User Registration
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-5 h-5">
                                                        <AvatarImage src={item.data.avatar} alt={item.data.name} />
                                                        <AvatarFallback className="text-[10px]">{item.data.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <p className="text-xs text-muted-foreground">
                                                        <span className="font-medium text-foreground">{item.data.name}</span> joined as {item.data.role}
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm font-medium leading-none">
                                                    New Bounty Posted
                                                </p>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-foreground line-clamp-1">
                                                        {item.data.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Reward: <span className="text-green-500 font-medium">RM {item.data.reward.toLocaleString()}</span>
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 min-w-[60px]">
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(new Date(item.type === 'user' ? item.data.joinedAt : item.data.createdAt), { addSuffix: true })}
                                    </span>
                                    {item.type === 'bounty' && (
                                        <Badge variant={
                                            item.data.status === 'open' || item.data.status === 'published' ? 'default' :
                                                item.data.status === 'completed' || item.data.status === 'paid' ? 'secondary' : 'outline'
                                        } className="text-[10px] px-1.5 py-0">
                                            {item.data.status}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                        {activities.length === 0 && (
                            <div className="text-center text-muted-foreground py-8">
                                No recent activity found.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
