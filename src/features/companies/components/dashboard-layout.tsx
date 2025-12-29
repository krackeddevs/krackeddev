"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Building2, LayoutDashboard, Settings, UserCircle } from "lucide-react";

interface CompanyDashboardLayoutProps {
    children: React.ReactNode;
}

const sidebarItems = [
    {
        title: "Overview",
        href: "/dashboard/company",
        icon: LayoutDashboard,
    },
    {
        title: "Edit Profile",
        href: "/dashboard/company/profile",
        icon: UserCircle,
    },
    {
        title: "Jobs",
        href: "/dashboard/company/jobs",
        icon: Building2,
    },
    {
        title: "Settings", // Maybe just link to profile for now?
        href: "/dashboard/company/settings",
        icon: Settings,
    }
]

export function CompanyDashboardLayout({ children }: CompanyDashboardLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="container py-8 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
            <aside className="hidden md:block space-y-2">
                <div className="mb-6 px-4">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        Employer Area
                    </h2>
                </div>
                <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn("w-full justify-start gap-2", isActive && "bg-secondary/50 font-medium")}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>
            </aside>
            <main className="min-h-[500px]">
                {children}
            </main>
        </div>
    );
}
