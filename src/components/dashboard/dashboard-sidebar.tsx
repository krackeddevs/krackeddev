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

interface SidebarProps {
    user?: any;
    company?: any;
}

export function DashboardSidebar({ user, company }: SidebarProps) {
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

    return (
        <div className="w-64 h-screen flex-shrink-0 border-r border-white/10 bg-black/40 backdrop-blur-xl fixed left-0 top-0 z-40 hidden md:flex flex-col">
            {/* Header / Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-white/10">
                <Link href="/" className="flex flex-col gap-0.5">
                    <span className="font-bold text-lg tracking-tighter text-white whitespace-nowrap">
                        &lt;Kracked Devs /&gt;
                    </span>
                    <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/30 w-fit">
                        DASHBOARD
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
                {/* User Section */}
                <div>
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
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
                                            ? "text-neon-cyan bg-neon-cyan/5 border border-neon-cyan/20"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "w-4 h-4 transition-colors",
                                            isActive ? "text-neon-cyan" : "text-gray-500 group-hover:text-white"
                                        )}
                                    />
                                    {item.title}
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-neon-cyan shadow-[0_0_10px_#00f0ff]" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Company Section */}
                {company && (
                    <div>
                        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Employer
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
                                                ? "text-neon-purple bg-neon-purple/5 border border-neon-purple/20"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                "w-4 h-4 transition-colors",
                                                isActive ? "text-neon-purple" : "text-gray-500 group-hover:text-white"
                                            )}
                                        />
                                        {item.title}
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-neon-purple shadow-[0_0_10px_#bc13fe]" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / User User */}
            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-mono text-gray-400">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.email}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            Level 1
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={handleSignOut}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
