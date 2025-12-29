import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Target, Users, GitPullRequest, BadgeCheck } from 'lucide-react';

interface SidebarContentProps {
    className?: string;
    onLinkClick?: () => void;
}

export function AdminSidebarContent({ className, onLinkClick }: SidebarContentProps) {
    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="font-bold mb-6 px-4 text-xl tracking-tight">Admin Panel</div>
            <nav className="space-y-1">
                <Link
                    href="/admin/dashboard"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                </Link>
                <Link
                    href="/admin/bounties"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                    <Target className="w-4 h-4" />
                    Bounties
                </Link>
                <Link
                    href="/admin/submissions"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                    <GitPullRequest className="w-4 h-4" />
                    Submissions
                </Link>
                <Link
                    href="/admin/users"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                    <Users className="w-4 h-4" />
                    Users
                </Link>
                <Link
                    href="/admin/verifications"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                    <BadgeCheck className="w-4 h-4" />
                    Verifications
                </Link>
            </nav>
        </div>
    );
}

export function AdminSidebar() {
    return (
        <aside className="hidden md:flex md:flex-col w-64 min-h-0 border-r bg-background p-4 overflow-y-auto">
            <AdminSidebarContent />
        </aside>
    );
}
