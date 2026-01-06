"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, CheckCircle2, Eye, Clock, Calendar, Archive, Loader2, Flag } from "lucide-react";
import { useRouter } from "next/navigation";

interface GovernmentInquiryActionsProps {
    inquiryId: string;
    currentStatus: string;
    currentPriority: string;
}

export function GovernmentInquiryActions({ inquiryId, currentStatus, currentPriority }: GovernmentInquiryActionsProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    const updateStatus = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/government-inquiries/${inquiryId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            router.refresh();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    const updatePriority = async (newPriority: string) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/government-inquiries/${inquiryId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priority: newPriority }),
            });

            if (!response.ok) {
                throw new Error('Failed to update priority');
            }

            router.refresh();
        } catch (error) {
            console.error('Error updating priority:', error);
            alert('Failed to update priority');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isUpdating}>
                    {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <MoreVertical className="h-4 w-4" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs font-mono uppercase text-muted-foreground">
                    Update Status
                </DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => updateStatus('new')}
                    disabled={currentStatus === 'new'}
                    className="cursor-pointer"
                >
                    <Eye className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Mark as New</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateStatus('reviewing')}
                    disabled={currentStatus === 'reviewing'}
                    className="cursor-pointer"
                >
                    <Clock className="mr-2 h-4 w-4 text-yellow-400" />
                    <span>Mark as Reviewing</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateStatus('contacted')}
                    disabled={currentStatus === 'contacted'}
                    className="cursor-pointer"
                >
                    <CheckCircle2 className="mr-2 h-4 w-4 text-purple-400" />
                    <span>Mark as Contacted</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateStatus('scheduled')}
                    disabled={currentStatus === 'scheduled'}
                    className="cursor-pointer"
                >
                    <Calendar className="mr-2 h-4 w-4 text-neon-cyan" />
                    <span>Mark as Scheduled</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateStatus('completed')}
                    disabled={currentStatus === 'completed'}
                    className="cursor-pointer"
                >
                    <CheckCircle2 className="mr-2 h-4 w-4 text-neon-primary" />
                    <span>Mark as Completed</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateStatus('archived')}
                    disabled={currentStatus === 'archived'}
                    className="cursor-pointer"
                >
                    <Archive className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Archive</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs font-mono uppercase text-muted-foreground">
                    Update Priority
                </DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => updatePriority('low')}
                    disabled={currentPriority === 'low'}
                    className="cursor-pointer"
                >
                    <Flag className="mr-2 h-4 w-4 text-gray-400" />
                    <span>Low Priority</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updatePriority('medium')}
                    disabled={currentPriority === 'medium'}
                    className="cursor-pointer"
                >
                    <Flag className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Medium Priority</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updatePriority('high')}
                    disabled={currentPriority === 'high'}
                    className="cursor-pointer"
                >
                    <Flag className="mr-2 h-4 w-4 text-orange-400" />
                    <span>High Priority</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updatePriority('urgent')}
                    disabled={currentPriority === 'urgent'}
                    className="cursor-pointer"
                >
                    <Flag className="mr-2 h-4 w-4 text-red-400" />
                    <span>Urgent</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
