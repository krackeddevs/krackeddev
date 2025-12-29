"use client";

import { AdminDataTable, Column } from "@/features/admin-dashboard/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

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
