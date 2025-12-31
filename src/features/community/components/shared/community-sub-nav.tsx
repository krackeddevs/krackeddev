"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Trophy, MessageSquare, MessagesSquare } from "lucide-react";

const NAV_ITEMS = [
    {
        label: "Townhall",
        href: "/community",
        icon: MessageSquare,
        exact: true,
    },
    // Q&A Removed as it is merged with Townhall or redundant
    /*
    {
        label: "Q&A",
        href: "/community/questions",
        icon: MessagesSquare,
    },
    */
    {
        label: "Members",
        href: "/members",
        icon: Users,
    },
    {
        label: "Leaderboard",
        href: "/leaderboard",
        icon: Trophy,
    },
];

export function CommunitySubNav() {
    const pathname = usePathname();

    return (
        <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40 w-full">
            <div className="container mx-auto px-4">
                <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar" aria-label="Community Navigation">
                    {NAV_ITEMS.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname?.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
                                    isActive
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-primary/50"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
