"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    User,
    Briefcase,
    Building2,
    Settings,
    FileText,
    LogOut,
    Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { ProfileData } from "@/features/profiles/actions";
import { ModeToggle } from "@/components/mode-toggle";

interface SidebarProps {
    user?: any;
    company?: any;
    profile?: ProfileData;
}

export function DashboardSidebar({ user, company, profile }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const navItems = [
        {
            title: "Overview",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "My Profile",
            href: "/dashboard/profile",
            icon: User,
        },
        {
            title: "Applications",
            href: "/dashboard/applications",
            icon: FileText,
        },
        {
            title: "Bounty Inquiries",
            href: "/dashboard/personal/inquiries",
            icon: Terminal,
        },
    ];

    const companyItems = [
        {
            title: "Overview",
            href: "/dashboard/company",
            icon: Building2,
        },
        {
            title: "Company Profile",
            href: "/dashboard/company/profile",
            icon: Building2,
        },
        {
            title: "Manage Jobs",
            href: "/dashboard/company/jobs",
            icon: Briefcase,
        },
        {
            title: "Applicants",
            href: "/dashboard/company/applicants",
            icon: User, // Or a different icon
        },
        {
            title: "Bounty Inquiries",
            href: "/dashboard/company/inquiries",
            icon: Terminal,
        },
    ];

    // Determine display name and avatar text
    const displayName = profile?.full_name || profile?.username || user?.email || "User";
    const avatarText = (profile?.full_name?.[0] || profile?.username?.[0] || user?.email?.[0] || "U").toUpperCase();

    return (
        <div className="w-64 h-[calc(100vh-84px)] sticky top-[84px] flex-shrink-0 border-r border-border/50 bg-background/60 backdrop-blur-xl hidden md:flex flex-col transition-colors duration-300 z-20">
            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-10 px-5 space-y-10">
                {/* User Section */}
                <div>
                    <h3 className="px-3 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.25em] mb-6">
                        COMMAND CENTER
                    </h3>
                    <div className="space-y-1.5 font-mono">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
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
                                    {item.title}
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--neon-primary)] shadow-[0_0_10px_var(--neon-primary)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Company Section */}
                {company && (
                    <div>
                        <h3 className="px-3 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.25em] mb-6">
                            RECRUITMENT HUB
                        </h3>
                        <div className="space-y-1.5 font-mono">
                            {companyItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all duration-200 group relative overflow-hidden",
                                            isActive
                                                ? "text-[var(--neon-secondary)] bg-[var(--neon-secondary)]/5 border border-[var(--neon-secondary)]/20 shadow-[0_0_20px_rgba(var(--neon-secondary-rgb),0.05)]"
                                                : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                "w-4 h-4 transition-colors",
                                                isActive ? "text-[var(--neon-secondary)]" : "text-muted-foreground/50 group-hover:text-[var(--neon-secondary)]"
                                            )}
                                        />
                                        {item.title}
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--neon-secondary)] shadow-[0_0_10px_var(--neon-secondary)]" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / User */}
            <div className="p-6 border-t border-border/30 bg-background/40">
                <div className="flex items-center gap-3 mb-6 px-1">
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
                    onClick={handleSignOut}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    DISCONNECT_
                </Button>
            </div>
        </div>
    );
}
