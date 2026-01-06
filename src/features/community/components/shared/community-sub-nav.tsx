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
        <div className="border-b border-border/10 bg-background/40 backdrop-blur-sm w-full transition-colors duration-300">
            <div className="container mx-auto px-4">
                <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1" aria-label="Community Navigation">
                    {NAV_ITEMS.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname?.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap",
                                    isActive
                                        ? "border-[var(--neon-primary)] text-[var(--neon-primary)]"
                                        : "border-transparent text-foreground/60 hover:text-foreground hover:border-[var(--neon-primary)]/50"
                                )}
                            >
                                <item.icon className="w-3 h-3" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
