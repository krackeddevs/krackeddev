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
    ];

    // Determine display name and avatar text
    const displayName = profile?.full_name || profile?.username || user?.email || "User";
    const avatarText = (profile?.full_name?.[0] || profile?.username?.[0] || user?.email?.[0] || "U").toUpperCase();

    return (
        <div className="w-64 h-screen flex-shrink-0 border-r border-border bg-card/40 backdrop-blur-xl fixed left-0 top-0 z-40 hidden md:flex flex-col">
            {/* Header / Logo Area */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                <Link href="/" className="flex flex-col gap-0.5">
                    <span className="font-bold text-lg tracking-tighter text-foreground whitespace-nowrap">
                        &lt;Kracked Devs /&gt;
                    </span>
                    <span className="text-[10px] bg-neon-secondary/20 text-neon-secondary px-1.5 py-0.5 rounded border border-neon-secondary/30 w-fit">
                        DASHBOARD
                    </span>
                </Link>
                <div className="flex items-center">
                    <ModeToggle />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
                {/* User Section */}
                <div>
                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Personal
                    </h3>
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "text-neon-primary bg-neon-primary/5 border border-neon-primary/20"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/5"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "w-4 h-4 transition-colors",
                                            isActive ? "text-neon-primary" : "text-muted-foreground group-hover:text-foreground"
                                        )}
                                    />
                                    {item.title}
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-neon-primary shadow-[0_0_10px_var(--neon-primary)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Company Section */}
                {company && (
                    <div>
                        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Company
                        </h3>
                        <div className="space-y-1">
                            {companyItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 group relative overflow-hidden",
                                            isActive
                                                ? "text-neon-secondary bg-neon-secondary/5 border border-neon-secondary/20"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/5"
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                "w-4 h-4 transition-colors",
                                                isActive ? "text-neon-secondary" : "text-muted-foreground group-hover:text-foreground"
                                            )}
                                        />
                                        {item.title}
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-neon-secondary shadow-[0_0_10px_var(--neon-secondary)]" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / User User */}
            <div className="p-4 border-t border-border bg-card/20">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-card to-muted border border-border flex items-center justify-center text-xs font-mono text-muted-foreground">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded" />
                        ) : (
                            avatarText
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            Level {profile?.level || 1}
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={handleSignOut}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
