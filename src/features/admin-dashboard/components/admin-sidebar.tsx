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
            <div className="font-bold mb-6 px-4 text-xl tracking-tight font-mono text-green-500 uppercase border-l-4 border-green-500 pl-4">
                ADMIN PANEL
            </div>
            <nav className="space-y-1">
                <Link
                    href="/admin/dashboard"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono hover:bg-green-500/10 hover:text-green-400 hover:border-l-2 hover:border-green-500 rounded-r-md transition-all duration-200 uppercase"
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                </Link>
                <Link
                    href="/admin/bounties"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono hover:bg-green-500/10 hover:text-green-400 hover:border-l-2 hover:border-green-500 rounded-r-md transition-all duration-200 uppercase"
                >
                    <Target className="w-4 h-4" />
                    Bounties
                </Link>
                <Link
                    href="/admin/submissions"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono hover:bg-green-500/10 hover:text-green-400 hover:border-l-2 hover:border-green-500 rounded-r-md transition-all duration-200 uppercase"
                >
                    <GitPullRequest className="w-4 h-4" />
                    Submissions
                </Link>
                <Link
                    href="/admin/users"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono hover:bg-green-500/10 hover:text-green-400 hover:border-l-2 hover:border-green-500 rounded-r-md transition-all duration-200 uppercase"
                >
                    <Users className="w-4 h-4" />
                    Users
                </Link>
                <Link
                    href="/admin/verifications"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono hover:bg-green-500/10 hover:text-green-400 hover:border-l-2 hover:border-green-500 rounded-r-md transition-all duration-200 uppercase"
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
        <aside className="hidden md:flex md:w-64 md:flex-col border-r border-green-500/30 bg-black/60 backdrop-blur">
            <AdminSidebarContent className="p-6" />
        </aside>
    );
}
