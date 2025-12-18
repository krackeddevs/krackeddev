'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { CreditCard, User } from "lucide-react";

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

export function RecentActivity({ recentUsers, recentBounties }: RecentActivityProps) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                    Latest gathered platform data
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="users" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="users">From Users</TabsTrigger>
                        <TabsTrigger value="bounties">From Bounties</TabsTrigger>
                    </TabsList>

                    {/* Recent Users Tab */}
                    <TabsContent value="users">
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-4 pt-4">
                                {recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between space-x-4">
                                        <div className="flex items-center space-x-4">
                                            <Avatar>
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {user.role}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(user.joinedAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {recentUsers.length === 0 && (
                                    <div className="text-center text-muted-foreground py-8">
                                        No recent users found.
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    {/* Recent Bounties Tab */}
                    <TabsContent value="bounties">
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-4 pt-4">
                                {recentBounties.map((bounty) => (
                                    <div key={bounty.id} className="flex items-center justify-between space-x-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-muted rounded-full">
                                                <CreditCard className="w-4 h-4 text-foreground" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none line-clamp-1 max-w-[180px] sm:max-w-[250px]">
                                                    {bounty.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Reward: RM {bounty.reward.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <Badge variant={
                                                bounty.status === 'open' || bounty.status === 'published' ? 'default' :
                                                    bounty.status === 'completed' || bounty.status === 'paid' ? 'secondary' : 'outline'
                                            } className="text-[10px] px-1.5 py-0">
                                                {bounty.status}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground">
                                                {formatDistanceToNow(new Date(bounty.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {recentBounties.length === 0 && (
                                    <div className="text-center text-muted-foreground py-8">
                                        No recent bounties found.
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
