"use client";

import { AdminDataTable, Column } from "@/features/admin-dashboard/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Ban, UserCheck } from "lucide-react";
import { banUser, unbanUser } from "@/features/admin-dashboard/actions/user-actions";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

type User = {
    id: string;
    username: string | null;
    email: string | null;
    role: string;
    created_at: string;
    is_banned?: boolean;
};

interface UsersTableClientProps {
    users: User[];
}

export function UsersTableClient({ users }: UsersTableClientProps) {
    const router = useRouter();
    const [processing, setProcessing] = useState<string | null>(null);

    const getRoleBadge = (role: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            admin: "destructive",
            moderator: "default",
            user: "secondary",
        };
        return (
            <Badge variant={variants[role] || "secondary"}>
                {role.toUpperCase()}
            </Badge>
        );
    };

    const handleBanToggle = async (user: User) => {
        setProcessing(user.id);
        const action = user.is_banned ? unbanUser : banUser;
        const actionName = user.is_banned ? "unbanned" : "banned";

        const { success, error } = await action(user.id);

        if (success) {
            toast.success(`User ${actionName} successfully`);
            router.refresh();
        } else {
            toast.error(error || `Failed to ${actionName.slice(0, -2)} user`);
        }

        setProcessing(null);
    };

    const columns: Column<User>[] = [
        {
            key: "username",
            label: "User",
            sortable: true,
            render: (user) => (
                <div>
                    <div className="font-medium">{user.username || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">{user.email || "N/A"}</div>
                </div>
            ),
            mobileRender: (user) => (
                <div className="space-y-2">
                    <div className="font-bold">{user.username || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">{user.email || "N/A"}</div>
                    <div className="flex gap-2">
                        {getRoleBadge(user.role)}
                        {user.is_banned && (
                            <Badge variant="destructive">BANNED</Badge>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: "role",
            label: "Role",
            sortable: true,
            render: (user) => getRoleBadge(user.role),
        },
        {
            key: "created_at",
            label: "Joined",
            sortable: true,
            render: (user) =>
                formatDistanceToNow(new Date(user.created_at), { addSuffix: true }),
        },
        {
            key: "status",
            label: "Status",
            render: (user) =>
                user.is_banned ? (
                    <Badge variant="destructive">Banned</Badge>
                ) : (
                    <Badge variant="outline">Active</Badge>
                ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (user) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant={user.is_banned ? "default" : "destructive"}
                        onClick={() => handleBanToggle(user)}
                        disabled={processing === user.id}
                    >
                        {user.is_banned ? (
                            <>
                                <UserCheck className="w-4 h-4 mr-1" />
                                Unban
                            </>
                        ) : (
                            <>
                                <Ban className="w-4 h-4 mr-1" />
                                Ban
                            </>
                        )}
                    </Button>
                </div>
            ),
            mobileRender: (user) => (
                <div className="flex flex-col gap-2 pt-2 border-t">
                    <Button
                        size="sm"
                        variant={user.is_banned ? "default" : "destructive"}
                        onClick={() => handleBanToggle(user)}
                        disabled={processing === user.id}
                        className="w-full"
                    >
                        {user.is_banned ? (
                            <>
                                <UserCheck className="w-4 h-4 mr-1" />
                                Unban User
                            </>
                        ) : (
                            <>
                                <Ban className="w-4 h-4 mr-1" />
                                Ban User
                            </>
                        )}
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminDataTable
            data={users}
            columns={columns}
            searchPlaceholder="Search users by username or email..."
            emptyMessage="No users found"
        />
    );
}
