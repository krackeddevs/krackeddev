"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Building2, Users, Share2, ScrollText } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { DiscordIcon } from "@/components/icons/discord-icon";
import { TwitterIcon } from "@/components/icons/twitter-icon";
import { TikTokIcon } from "@/components/icons/tiktok-icon";
//import { ThreadsIcon } from "@/components/icons/threads-icon";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const SOCIAL_LINKS = [
    { name: "Discord", href: "https://discord.gg/9p24zggp", icon: DiscordIcon },
    { name: "Instagram", href: "https://www.instagram.com/kddevs000/", icon: InstagramIcon },
    { name: "Twitter", href: "https://twitter.com/krackeddevs", icon: TwitterIcon },
    { name: "TikTok", href: "https://www.tiktok.com/@krackeddevs", icon: TikTokIcon },
    //{ name: "Threads", href: "https://threads.net/@kddevs", icon: ThreadsIcon },
];

interface BottomSocialNavProps {
    onOpenManifesto?: () => void;
}

export function BottomSocialNav({ onOpenManifesto }: BottomSocialNavProps) {
    const [showSocialSheet, setShowSocialSheet] = useState(false);

    const NAV_ITEMS = [
        { name: "Companies", href: "/companies", icon: Building2 },
        { name: "Community", href: "/community", icon: Users },
    ];

    return (
        <nav
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe"
            aria-label="Bottom navigation"
        >
            {/* Frosted glass container with enhanced effects */}
            <div
                className={cn(
                    "relative border-t-2 border-neon-primary/40",
                    // Much more transparent background to let blur show through
                    "bg-background/40 dark:bg-background/20 backdrop-blur-xl backdrop-saturate-150",
                    // Strong green neon glow from top
                    "shadow-[0_-8px_40px_rgba(0,255,170,0.25)]",
                    "dark:shadow-[0_-10px_50px_rgba(0,255,170,0.35)]"
                )}
            >
                {/* Top border glow line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-primary to-transparent opacity-90" />

                {/* Subtle background glow for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-neon-primary/5 to-transparent pointer-events-none" />

                {/* Navigation items */}
                <div className="relative flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
                    {/* Companies, Community */}
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex flex-col items-center gap-1 transition-all duration-300",
                                    "rounded-xl px-4 py-2 min-w-[70px]",
                                    "hover:bg-neon-primary/5"
                                )}
                                aria-label={item.name}
                            >
                                {/* Icon */}
                                <Icon
                                    className={cn(
                                        "h-5 w-5 transition-all duration-300",
                                        "text-muted-foreground",
                                        "group-hover:text-neon-primary",
                                        "group-hover:drop-shadow-[0_0_8px_rgba(0,255,170,0.6)]"
                                    )}
                                />

                                {/* Label */}
                                <span className={cn(
                                    "text-[10px] font-medium transition-all duration-300",
                                    "text-muted-foreground",
                                    "group-hover:text-neon-primary"
                                )}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Social Media - Opens Sheet */}
                    <Sheet open={showSocialSheet} onOpenChange={setShowSocialSheet}>
                        <SheetTrigger asChild>
                            <button
                                className={cn(
                                    "group flex flex-col items-center gap-1 transition-all duration-300",
                                    "rounded-xl px-4 py-2 min-w-[70px]",
                                    "hover:bg-neon-primary/5"
                                )}
                                aria-label="Social Media"
                            >
                                <Share2
                                    className={cn(
                                        "h-5 w-5 transition-all duration-300",
                                        "text-muted-foreground",
                                        "group-hover:text-neon-primary",
                                        "group-hover:drop-shadow-[0_0_8px_rgba(0,255,170,0.6)]"
                                    )}
                                />
                                <span className={cn(
                                    "text-[10px] font-medium transition-all duration-300",
                                    "text-muted-foreground",
                                    "group-hover:text-neon-primary"
                                )}>
                                    Social
                                </span>
                            </button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="border-neon-primary/30 bg-background/95 backdrop-blur-xl">
                            <SheetHeader>
                                <SheetTitle className="text-neon-primary font-mono">Social Media</SheetTitle>
                                <SheetDescription>
                                    Follow us on our social channels
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid grid-cols-2 gap-3 mt-6">
                                {SOCIAL_LINKS.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <Link
                                            key={social.name}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setShowSocialSheet(false)}
                                            className={cn(
                                                "group flex items-center gap-3 p-4",
                                                "rounded-lg border border-border",
                                                "bg-card/50 hover:bg-card",
                                                "hover:border-neon-primary/50",
                                                "transition-all duration-300"
                                            )}
                                        >
                                            <Icon className="h-5 w-5 text-neon-primary" />
                                            <span className="text-sm font-medium text-foreground group-hover:text-neon-primary transition-colors">
                                                {social.name}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Manifesto */}
                    <button
                        onClick={onOpenManifesto}
                        className={cn(
                            "group flex flex-col items-center gap-1 transition-all duration-300",
                            "rounded-xl px-4 py-2 min-w-[70px]",
                            "hover:bg-neon-primary/5"
                        )}
                        aria-label="Manifesto"
                    >
                        <ScrollText
                            className={cn(
                                "h-5 w-5 transition-all duration-300",
                                "text-muted-foreground",
                                "group-hover:text-neon-primary",
                                "group-hover:drop-shadow-[0_0_8px_rgba(0,255,170,0.6)]"
                            )}
                        />
                        <span className={cn(
                            "text-[10px] font-medium transition-all duration-300",
                            "text-muted-foreground",
                            "group-hover:text-neon-primary"
                        )}>
                            Manifesto
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
