"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    User,
    Briefcase,
    Building2,
    FileText,
    Menu,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { ProfileData } from "@/features/profiles/actions";
import { ModeToggle } from "@/components/mode-toggle";

interface MobileSidebarProps {
    user?: any;
    company?: any;
    profile?: ProfileData;
}

export function MobileSidebar({ user, company, profile }: MobileSidebarProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
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
            icon: User,
        },
    ];

    // Determine display name and avatar text
    const displayName = profile?.full_name || profile?.username || user?.email || "User";
    const avatarText = (profile?.full_name?.[0] || profile?.username?.[0] || user?.email?.[0] || "U").toUpperCase();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] border-r border-border bg-background/95 backdrop-blur-xl p-0">
                <SheetHeader className="h-16 flex flex-row items-center justify-between pl-4 pr-16 border-b border-border space-y-0">
                    <SheetTitle className="flex-1 min-w-0">
                        <Link href="/" className="flex flex-col gap-0.5" onClick={() => setOpen(false)}>
                            <span className="font-bold text-base tracking-tighter text-foreground whitespace-nowrap text-left">
                                &lt;Kracked Devs /&gt;
                            </span>
                            <span className="text-[9px] bg-neon-secondary/20 text-neon-secondary px-1.5 py-0.5 rounded border border-neon-secondary/30 w-fit">
                                DASHBOARD
                            </span>
                        </Link>
                    </SheetTitle>
                    <div className="flex items-center">
                        <ModeToggle />
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 h-[calc(100vh-8rem)]">
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
                                        onClick={() => setOpen(false)}
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
                                            onClick={() => setOpen(false)}
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
                <div className="p-4 border-t border-border bg-card/20 absolute bottom-0 w-full left-0">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-card to-muted border border-border flex items-center justify-center text-xs font-mono text-muted-foreground overflow-hidden">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
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
                        className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10"
                        onClick={handleSignOut}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
