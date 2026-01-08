"use client";

import { useState, useEffect } from "react";
import { X, Home, Users, Briefcase, Trophy, Code, Info, Shield, LayoutDashboard, User, FileText, Terminal, Building2, Target, GitPullRequest, BarChart3, BadgeCheck, ShieldAlert, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/context/SupabaseContext";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GlobalSidebar({ isOpen, onClose }: SidebarProps) {
    const { profile, user, supabase, signOut } = useSupabase();
    const pathname = usePathname();
    const [hasCompany, setHasCompany] = useState(false);

    // Check if user has a company
    useEffect(() => {
        const checkCompany = async () => {
            if (!user?.id) return;

            // Check if user is a company member (matches getUserCompany logic)
            const { data } = await supabase
                .from('company_members')
                .select('company_id')
                .eq('user_id', user.id)
                .maybeSingle();

            setHasCompany(!!data);
        };

        checkCompany();
    }, [user?.id, supabase]);

    // Check if we're on dashboard routes
    const isDashboardRoute = pathname?.startsWith('/dashboard');
    const isAdminRoute = pathname?.startsWith('/admin');

    // Main navigation items
    const mainMenuItems = [
        { label: "Dashboard", icon: Home, href: "/" },
        { label: "Command Center", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Townhall", icon: Users, href: "/community" },
        { label: "Contract Ops", icon: Briefcase, href: "/jobs" },
        { label: "Leaderboard", icon: Trophy, href: "/leaderboard" },
        { label: "Bounty Board", icon: Code, href: "/code/bounty" },
        { label: "The Manifesto", icon: Info, href: "/about" },
    ];

    // Dashboard-specific menu items (Matches DashboardSidebar)
    const dashboardMenuItems = [
        { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
        { label: "My Profile", icon: User, href: "/dashboard/profile" },
        { label: "Applications", icon: FileText, href: "/dashboard/applications" },
        { label: "Bounty Inquiries", icon: Terminal, href: "/dashboard/personal/inquiries" },
    ];

    // Company dashboard items
    const companyMenuItems = [
        { label: "Overview", icon: Building2, href: "/dashboard/company" },
        { label: "Company Profile", icon: Building2, href: "/dashboard/company/profile" },
        { label: "Manage Contracts", icon: Briefcase, href: "/dashboard/company/jobs" },
        { label: "Applicants", icon: User, href: "/dashboard/company/applicants" },
        { label: "Bounty Inquiries", icon: Terminal, href: "/dashboard/company/inquiries" },
    ];

    // Admin menu items (Matches AdminSidebar exactly)
    const adminMenuItems = [
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

    // Determine which menu to show
    let menuItems = [];
    let menuTitle = "MAIN NAVIGATION";

    if (isAdminRoute && profile?.role === 'admin') {
        menuItems = [...adminMenuItems, { label: "← Back to Main", icon: Home, href: "/" }];
        menuTitle = "ADMIN CONSOLE";
    } else if (isDashboardRoute) {
        menuItems = [...dashboardMenuItems];
        menuItems.push({ label: "← Back to Main", icon: Home, href: "/" });
        menuTitle = "COMMAND CENTER";
    } else {
        menuItems = [...mainMenuItems];
        if (profile?.role === 'admin') {
            menuItems.push({ label: "Admin Console", icon: Shield, href: "/admin/dashboard" });
        }
        menuTitle = "MAIN NAVIGATION";
    }

    const displayName = profile?.full_name || profile?.username || user?.email || "User";
    const avatarText = (profile?.full_name?.[0] || profile?.username?.[0] || user?.email?.[0] || "U").toUpperCase();

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Panel */}
            <div className={cn(
                "fixed top-0 left-0 h-full w-72 bg-sidebar border-r border-sidebar-border z-[101] shadow-[20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out flex flex-col transition-colors",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex-1 overflow-y-auto p-8 pt-6 flex flex-col gap-8 custom-scrollbar">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-sidebar-border/30 sticky top-0 bg-sidebar z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[var(--neon-primary)] animate-pulse shadow-[0_0_8px_var(--neon-primary)]" />
                            <div className="font-mono text-foreground font-bold tracking-widest text-[11px] uppercase">
                                KRACKED_OS
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/10 h-8 w-8 transition-colors">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <nav className="flex flex-col gap-8">
                        {/* Main Section */}
                        <div>
                            <div className="px-3 mb-4 font-mono text-foreground/30 font-bold tracking-[0.25em] text-[9px] uppercase">
                                {menuTitle}
                            </div>
                            <div className="flex flex-col gap-1">
                                {menuItems.map((item, i) => (
                                    <Link
                                        key={i}
                                        href={item.href}
                                        className="group flex items-center gap-4 px-3 py-2.5 hover:bg-[var(--neon-primary)]/5 transition-all duration-300 rounded-sm"
                                        onClick={onClose}
                                    >
                                        <item.icon className="w-4 h-4 text-sidebar-foreground/30 group-hover:text-[var(--neon-primary)] transition-colors" />
                                        <span className="font-mono text-[10px] uppercase font-bold tracking-[0.15em] text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors">
                                            {item.label}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recruitment Hub Section - Only show on dashboard routes if user has company */}
                        {isDashboardRoute && hasCompany && (
                            <div>
                                <div className="px-3 mb-4 font-mono text-foreground/30 font-bold tracking-[0.25em] text-[9px] uppercase border-t border-sidebar-border/20 pt-6">
                                    RECRUITMENT HUB
                                </div>
                                <div className="flex flex-col gap-1">
                                    {companyMenuItems.map((item, i) => (
                                        <Link
                                            key={i}
                                            href={item.href}
                                            className="group flex items-center gap-4 px-3 py-2.5 hover:bg-[var(--neon-secondary)]/5 transition-all duration-300 rounded-sm"
                                            onClick={onClose}
                                        >
                                            <item.icon className="w-4 h-4 text-sidebar-foreground/30 group-hover:text-[var(--neon-secondary)] transition-colors" />
                                            <span className="font-mono text-[10px] uppercase font-bold tracking-[0.15em] text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors">
                                                {item.label}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </nav>
                </div>

                {/* Footer / User Profile Area */}
                <div className="mt-auto p-6 border-t border-sidebar-border/30 bg-background/20 backdrop-blur-sm">
                    {user ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 px-1">
                                <div className="w-10 h-10 rounded-sm bg-background border border-border/50 flex items-center justify-center text-[10px] font-mono text-muted-foreground uppercase shadow-inner">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-sm" />
                                    ) : (
                                        avatarText
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-black text-foreground font-mono uppercase tracking-tight truncate">
                                        {displayName}
                                    </p>
                                    <p className="text-[10px] text-foreground/40 font-mono uppercase tracking-[0.2em] truncate">
                                        LVL {profile?.level || 1} • {profile?.role || "USER"}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-[10px] font-bold font-mono uppercase text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-sm h-10 tracking-widest"
                                onClick={() => {
                                    signOut();
                                    onClose();
                                }}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                DISCONNECT_
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-[var(--neon-primary)]/10 border border-[var(--neon-primary)]/30 flex items-center justify-center">
                                <Code className="w-4 h-4 text-[var(--neon-primary)]" />
                            </div>
                            <div>
                                <div className="text-[9px] font-mono text-sidebar-foreground/40 tracking-wider uppercase">SECURE CONNECTION</div>
                                <div className="text-[10px] font-mono text-[var(--neon-primary)] font-bold tracking-widest">BETA v1.4.0</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
