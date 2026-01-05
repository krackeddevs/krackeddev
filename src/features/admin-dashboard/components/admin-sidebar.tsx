"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Target, Users, GitPullRequest, BadgeCheck, ShieldAlert, Terminal, BarChart3 } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

interface SidebarContentProps {
    className?: string;
    onLinkClick?: () => void;
}

export function AdminSidebarContent({ className, onLinkClick }: SidebarContentProps) {
    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="font-bold mb-6 px-4 text-xl tracking-tight font-mono text-neon-primary uppercase border-l-4 border-neon-primary pl-4">
                ADMIN PANEL
            </div>
            <nav className="space-y-1 flex-1">
                <Link
                    href="/admin/dashboard"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono hover:bg-neon-primary/10 hover:text-neon-primary hover:border-l-2 hover:border-neon-primary rounded-r-md transition-all duration-200 uppercase"
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                </Link>
                <Link
                    href="/admin/bounties"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono hover:bg-neon-primary/10 hover:text-neon-primary hover:border-l-2 hover:border-neon-primary rounded-r-md transition-all duration-200 uppercase"
                >
                    <Target className="w-4 h-4" />
                    Bounties
                </Link>
                <Link
                    href="/admin/inquiries"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono hover:bg-neon-primary/10 hover:text-neon-primary hover:border-l-2 hover:border-neon-primary rounded-r-md transition-all duration-200 uppercase"
                >
                    <Terminal className="w-4 h-4" />
                    Inquiries
                </Link>
                <Link
                    href="/admin/submissions"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono hover:bg-neon-primary/10 hover:text-neon-primary hover:border-l-2 hover:border-neon-primary rounded-r-md transition-all duration-200 uppercase"
                >
                    <GitPullRequest className="w-4 h-4" />
                    Submissions
                </Link>
                <Link
                    href="/admin/polls"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono hover:bg-neon-primary/10 hover:text-neon-primary hover:border-l-2 hover:border-neon-primary rounded-r-md transition-all duration-200 uppercase"
                >
                    <BarChart3 className="w-4 h-4" />
                    Polls
                </Link>
                <Link
                    href="/admin/users"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono hover:bg-neon-primary/10 hover:text-neon-primary hover:border-l-2 hover:border-neon-primary rounded-r-md transition-all duration-200 uppercase"
                >
                    <Users className="w-4 h-4" />
                    Users
                </Link>
                <Link
                    href="/admin/verifications"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono hover:bg-neon-primary/10 hover:text-neon-primary hover:border-l-2 hover:border-neon-primary rounded-r-md transition-all duration-200 uppercase"
                >
                    <BadgeCheck className="w-4 h-4" />
                    Verifications
                </Link>
                <Link
                    href="/admin/moderation"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono hover:bg-neon-primary/10 hover:text-neon-primary hover:border-l-2 hover:border-neon-primary rounded-r-md transition-all duration-200 uppercase"
                >
                    <ShieldAlert className="w-4 h-4" />
                    Moderation
                </Link>
            </nav>

            <div className="mt-auto px-4 py-4 border-t border-border">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono">Theme</span>
                    <ModeToggle />
                </div>
            </div>
        </div>
    );
}

export function AdminSidebar() {
    return (
        <aside className="hidden md:flex md:w-64 md:flex-col border-r border-border bg-card/60 backdrop-blur">
            <AdminSidebarContent className="p-6" />
        </aside>
    );
}
