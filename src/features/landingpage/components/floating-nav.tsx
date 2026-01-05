"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, Scroll, ChevronLeft, Menu, Share2 } from "lucide-react";
import { DiscordIcon } from "@/components/icons/discord-icon";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { TwitterIcon } from "@/components/icons/twitter-icon";
import { TikTokIcon } from "@/components/icons/tiktok-icon";
import { ThreadsIcon } from "@/components/icons/threads-icon";

interface FloatingNavProps {
    onOpenManifesto: () => void;
}

const SOCIAL_LINKS = [
    { name: "Discord", href: "https://discord.gg/9p24zggp", icon: DiscordIcon },
    { name: "Instagram", href: "https://www.instagram.com/kddevs000/", icon: InstagramIcon },
    { name: "X (Twitter)", href: "https://twitter.com/krackeddevs", icon: TwitterIcon },
    { name: "TikTok", href: "https://www.tiktok.com/@krackeddevs", icon: TikTokIcon },
    { name: "Threads", href: "https://threads.net/@kddevs", icon: ThreadsIcon },
];

export function FloatingNav({ onOpenManifesto }: FloatingNavProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showSocialDropdown, setShowSocialDropdown] = useState(false);

    const smoothTransition = {
        layout: {
            duration: 0.4,
            ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number]
        }
    };

    const itemVariants = {
        expanded: { opacity: 1, x: 0 },
        collapsed: { opacity: 0, x: -20 },
    };

    return (
        <div className="hidden lg:flex fixed bottom-6 left-6 z-40 flex-col gap-3 items-start">
            <AnimatePresence mode="popLayout">
                {isExpanded && (
                    <motion.div
                        className="flex flex-col gap-3"
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        layout // Key for smooth layout transitions
                        transition={smoothTransition.layout}
                    >
                        {/* Companies Button */}
                        <motion.div variants={itemVariants} layout transition={smoothTransition.layout}>
                            <Link
                                href="/companies"
                                className="flex items-center gap-2 p-2.5 sm:px-4 sm:py-3 bg-background/90 hover:bg-muted border-2 border-neon-primary/50 hover:border-neon-primary rounded-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_var(--neon-primary)] font-mono text-sm w-full"
                            >
                                <Building2 className="w-5 h-5 text-neon-primary shrink-0" />
                                <span className="text-neon-primary whitespace-nowrap">Companies</span>
                            </Link>
                        </motion.div>

                        {/* Community Button */}
                        <motion.div variants={itemVariants} layout transition={smoothTransition.layout}>
                            <Link
                                href="/community"
                                className="flex items-center gap-2 p-2.5 sm:px-4 sm:py-3 bg-background/90 hover:bg-muted border-2 border-neon-primary/50 hover:border-neon-primary rounded-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_var(--neon-primary)] font-mono text-sm w-full"
                            >
                                <Users className="w-5 h-5 text-neon-primary shrink-0" />
                                <span className="text-neon-primary whitespace-nowrap">Community</span>
                            </Link>
                        </motion.div>

                        {/* Social Media Group */}
                        <motion.div
                            variants={itemVariants}
                            layout
                            transition={smoothTransition.layout}
                            className="relative"
                        >
                            <button
                                onClick={() => setShowSocialDropdown(!showSocialDropdown)}
                                className="flex items-center gap-2 p-2.5 sm:px-4 sm:py-3 bg-background/90 hover:bg-muted border-2 border-neon-primary/50 hover:border-neon-primary rounded-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_var(--neon-primary)] font-mono text-sm relative z-10 text-left min-w-[140px]"
                            >
                                <Share2 className="w-5 h-5 text-neon-primary shrink-0" />
                                <span className="text-neon-primary whitespace-nowrap">Social Media</span>
                            </button>

                            {/* Dropdown Content */}
                            <AnimatePresence>
                                {showSocialDropdown && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: "auto", opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        className="absolute left-[100%] top-1/2 -translate-y-1/2 flex flex-col gap-3 pl-10 ml-6 z-20"
                                    >
                                        {/* Bridge to Button */}
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            exit={{ scaleX: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute left-[-25px] top-1/2 h-0.5 w-[25px] bg-neon-primary group-hover/branch:bg-neon-primary transition-all origin-left"
                                        />

                                        {/* Vertical trunk line */}
                                        <motion.div
                                            initial={{ scaleY: 0 }}
                                            animate={{ scaleY: 1 }}
                                            exit={{ scaleY: 0 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="absolute left-0 top-0 bottom-0 w-0.5 bg-neon-primary origin-center"
                                        />

                                        {SOCIAL_LINKS.map((social, index) => (
                                            <motion.div
                                                key={social.name}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: -20, opacity: 0 }}
                                                transition={{ delay: 0.1 + (index * 0.05), duration: 0.2 }}
                                                className="relative group/branch"
                                            >
                                                {/* Horizontal branch line */}
                                                <motion.div
                                                    initial={{ scaleX: 0 }}
                                                    animate={{ scaleX: 1 }}
                                                    exit={{ scaleX: 0 }}
                                                    transition={{ duration: 0.2, delay: 0.15 + (index * 0.05) }}
                                                    className="absolute left-[-40px] top-1/2 h-0.5 w-[40px] bg-border/50 group-hover/branch:bg-neon-primary transition-all origin-left"
                                                />

                                                <Link
                                                    href={social.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 px-3 py-2 bg-background/90 border-2 border-border hover:border-neon-primary rounded-lg transition-all hover:shadow-[0_0_10px_var(--neon-primary)] hover:translate-x-1 min-w-[140px]"
                                                >
                                                    <social.icon className="w-4 h-4 text-neon-primary shrink-0" />
                                                    <span className="text-sm font-mono text-muted-foreground group-hover/branch:text-neon-primary whitespace-nowrap">
                                                        {social.name}
                                                    </span>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Manifesto Button */}
                        <motion.div variants={itemVariants} layout transition={smoothTransition.layout}>
                            <button
                                onClick={onOpenManifesto}
                                className="flex items-center gap-2 p-2.5 sm:px-4 sm:py-3 bg-background/90 hover:bg-muted border-2 border-neon-primary/50 hover:border-neon-primary rounded-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_var(--neon-primary)] font-mono text-sm w-full text-left"
                            >
                                <Scroll className="w-5 h-5 text-neon-primary shrink-0" />
                                <span className="text-neon-primary whitespace-nowrap">Manifesto</span>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                layout
                onClick={() => setIsExpanded(!isExpanded)}
                className="group flex items-center justify-center p-2.5 sm:px-4 sm:py-3 bg-background/90 hover:bg-muted border-2 border-neon-primary/30 hover:border-neon-primary rounded-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_var(--neon-primary)]"
                aria-label={isExpanded ? "Hide Navigation" : "Show Navigation"}
            >
                {isExpanded ? (
                    <div className="flex items-center gap-2">
                        <ChevronLeft className="w-5 h-5 text-neon-primary" />
                        <span className="text-neon-primary text-xs font-mono hidden sm:inline">Hide</span>
                    </div>
                ) : (
                    <Menu className="w-5 h-5 text-neon-primary" />
                )}
            </motion.button>
        </div>
    );
}
