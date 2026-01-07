"use client";

import { AdminDataTable, Column } from "@/features/admin-dashboard/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Ban, UserCheck, Pencil } from "lucide-react";
import { banUser, unbanUser, updateUserRole, updateUserLabel } from "@/features/admin-dashboard/actions/user-actions";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type User = {
    id: string;
    username: string | null;
    email: string | null;
    role: string;
    created_at: string;
    is_banned?: boolean;
    leaderboard_label?: string | null;
};

interface UsersTableClientProps {
    users: User[];
}

function EditUserButton({ user }: { user: User }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [role, setRole] = useState(user.role);
    const [label, setLabel] = useState(user.leaderboard_label || user.role === 'admin' ? '[SYSTEM]' : user.role === 'staff' ? '[MOD]' : '[RUNNER]');

    const handleSave = async () => {
        setProcessing(true);
        try {
            // Update Role (which also updates Label default)
            // But we also want to respect the custom label input
            // So we call updateRole then updateLabel if needed, or updateRole handles it?
            // updateRole sets the default. so if we want a custom one, we might need to call updateLabel after,
            // OR we rely on updateRole setting the default, and if the user Typed something different, we overwrite it.

            // Let's call updateRole first
            if (role !== user.role) {
                const res = await updateUserRole(user.id, role);
                if (!res.success) throw new Error(res.error);
            }

            // If label is different from what updateRole would set (or just always update it to be safe)
            // Actually updateUserRole sets a default. If we just want to ensure our specific label is saved:
            // We should call updateLabel.
            // BUT there's a race condition if we do both async maybe? 
            // Let's assume updateUserRole is fast.

            // Actually, better: if role changed, updateUserRole handles the label to default.
            // If the user *also* changed the label manually in the UI, we should override it.

            // Simpler: Just update role. Then Update Label.

            if (role !== user.role) {
                await updateUserRole(user.id, role);
            }

            // Now update label (force it to what is in the input)
            const res = await updateUserLabel(user.id, label);
            if (!res.success) throw new Error(res.error);

            toast.success("User updated successfully");
            setOpen(false);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to update user");
        } finally {
            setProcessing(false);
        }
    };

    // Auto-update label in UI when role changes, if it matches standard patterns?
    // User requested "no 3 will reflect automatically based on the role".
    // So if I select Admin in dropdown, Label input should probably switch to [SYSTEM].
    const handleRoleChange = (newRole: string) => {
        setRole(newRole);
        if (newRole === 'admin') setLabel('[SYSTEM]');
        else if (newRole === 'staff') setLabel('[MOD]');
        else setLabel('[RUNNER]');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Make changes to user role and leaderboard label.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Role
                        </Label>
                        <Select value={role} onValueChange={handleRoleChange}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="label" className="text-right">
                            Label
                        </Label>
                        <Select value={label} onValueChange={setLabel}>
                            <SelectTrigger className="col-span-3 font-mono">
                                <SelectValue placeholder="Select a label" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="[SYSTEM]" className="font-mono">[SYSTEM]</SelectItem>
                                <SelectItem value="[MOD]" className="font-mono">[MOD]</SelectItem>
                                <SelectItem value="[RUNNER]" className="font-mono">[RUNNER]</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave} disabled={processing}>
                        {processing ? "Saving..." : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function UsersTableClient({ users }: UsersTableClientProps) {
    const router = useRouter();
    const [processing, setProcessing] = useState<string | null>(null);

    const getRoleBadge = (role: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            admin: "destructive",
            staff: "default",
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
                        <Badge variant="outline" className="font-mono">{user.leaderboard_label || '[RUNNER]'}</Badge>
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
            key: "leaderboard_label",
            label: "Label",
            sortable: true,
            render: (user) => (
                <Badge variant="outline" className="font-mono text-xs">
                    {user.leaderboard_label || (user.role === 'admin' ? '[SYSTEM]' : user.role === 'staff' ? '[MOD]' : '[RUNNER]')}
                </Badge>
            ),
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
                    <EditUserButton user={user} />
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
                    <EditUserButton user={user} />
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
