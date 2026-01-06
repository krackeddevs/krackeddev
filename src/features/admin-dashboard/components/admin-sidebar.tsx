"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Target, Users, GitPullRequest, BadgeCheck, ShieldAlert, Terminal, BarChart3, Building2, Code } from 'lucide-react';

interface SidebarContentProps {
    className?: string;
    onLinkClick?: () => void;
}

export function AdminSidebarContent({ className, onLinkClick }: SidebarContentProps) {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/bounties", label: "Bounties", icon: Target },
        { href: "/admin/inquiries", label: "Inquiries", icon: Terminal },
        { href: "/admin/government-inquiries", label: "Gov Inquiries", icon: Building2 },
        { href: "/admin/submissions", label: "Submissions", icon: GitPullRequest },
        { href: "/admin/polls", label: "Polls", icon: BarChart3 },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/verifications", label: "Verifications", icon: BadgeCheck },
        { href: "/admin/moderation", label: "Moderation", icon: ShieldAlert },
    ];

    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="px-3 mb-8">
                <div className="font-mono text-[var(--neon-primary)] font-bold tracking-[0.2em] text-[10px] uppercase">
                    MANAGEMENT CONSOLE
                </div>
            </div>

            <nav className="space-y-1.5 flex-1 font-mono">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onLinkClick}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "text-[var(--neon-primary)] bg-[var(--neon-primary)]/5 border border-[var(--neon-primary)]/20 shadow-[0_0_20px_rgba(var(--neon-primary-rgb),0.05)]"
                                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-4 h-4 transition-colors",
                                    isActive ? "text-[var(--neon-primary)]" : "text-muted-foreground/50 group-hover:text-[var(--neon-primary)]"
                                )}
                            />
                            {item.label}
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--neon-primary)] shadow-[0_0_10px_var(--neon-primary)]" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto pt-8 border-t border-border/30">
                <div className="flex items-center gap-3 mb-6 px-3">
                    <div className="w-10 h-10 bg-[var(--neon-primary)]/10 border border-[var(--neon-primary)]/30 flex items-center justify-center">
                        <ShieldAlert className="w-5 h-5 text-[var(--neon-primary)]" />
                    </div>
                    <div>
                        <div className="text-[10px] font-mono text-foreground/40 tracking-wider">SECURE LINK</div>
                        <div className="text-xs font-mono text-[var(--neon-primary)] font-bold tracking-widest">ADMIN PRIVILEGE</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AdminSidebar() {
    return (
        <aside className="hidden md:flex md:w-64 md:flex-col border-r border-border/50 bg-background/60 backdrop-blur-xl h-[calc(100vh-84px)] sticky top-[84px] transition-colors duration-300 z-20">
            <AdminSidebarContent className="p-6" />
        </aside>
    );
}
