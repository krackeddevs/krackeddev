"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Building2, Users, Scroll, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingNavProps {
    onOpenManifesto: () => void;
}

export function FloatingNav({ onOpenManifesto }: FloatingNavProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    // Variants for animation
    const containerVariants = {
        expanded: {
            width: "auto",
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
        collapsed: {
            width: "auto",
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
    };

    const itemVariants = {
        expanded: { opacity: 1, x: 0, display: "flex" },
        collapsed: { opacity: 0, x: -20, transitionEnd: { display: "none" } },
    };

    return (
        <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3 items-start">
            <AnimatePresence mode="wait">
                {isExpanded && (
                    <motion.div
                        className="flex flex-col gap-3"
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={containerVariants}
                    >
                        {/* Jobs Button */}
                        <motion.div variants={itemVariants}>
                            <Link
                                href="/jobs"
                                className="flex items-center gap-2 p-2.5 sm:px-4 sm:py-3 bg-background/90 hover:bg-muted border-2 border-neon-primary/50 hover:border-neon-primary rounded-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_var(--neon-primary)] font-mono text-sm w-full"
                            >
                                <Briefcase className="w-5 h-5 text-neon-primary shrink-0" />
                                <span className="text-neon-primary whitespace-nowrap hidden sm:inline">Jobs</span>
                            </Link>
                        </motion.div>

                        {/* Companies Button */}
                        <motion.div variants={itemVariants}>
                            <Link
                                href="/companies"
                                className="flex items-center gap-2 p-2.5 sm:px-4 sm:py-3 bg-background/90 hover:bg-muted border-2 border-neon-primary/50 hover:border-neon-primary rounded-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_var(--neon-primary)] font-mono text-sm w-full"
                            >
                                <Building2 className="w-5 h-5 text-neon-primary shrink-0" />
                                <span className="text-neon-primary whitespace-nowrap hidden sm:inline">Companies</span>
                            </Link>
                        </motion.div>

                        {/* Community Button */}
                        <motion.div variants={itemVariants}>
                            <Link
                                href="/members"
                                className="flex items-center gap-2 p-2.5 sm:px-4 sm:py-3 bg-background/90 hover:bg-muted border-2 border-neon-primary/50 hover:border-neon-primary rounded-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_var(--neon-primary)] font-mono text-sm w-full"
                            >
                                <Users className="w-5 h-5 text-neon-primary shrink-0" />
                                <span className="text-neon-primary whitespace-nowrap hidden sm:inline">Community</span>
                            </Link>
                        </motion.div>

                        {/* Manifesto Button */}
                        <motion.div variants={itemVariants}>
                            <button
                                onClick={onOpenManifesto}
                                className="flex items-center gap-2 p-2.5 sm:px-4 sm:py-3 bg-background/90 hover:bg-muted border-2 border-neon-primary/50 hover:border-neon-primary rounded-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_var(--neon-primary)] font-mono text-sm w-full text-left"
                            >
                                <Scroll className="w-5 h-5 text-neon-primary shrink-0" />
                                <span className="text-neon-primary whitespace-nowrap hidden sm:inline">Manifesto</span>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <button
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
            </button>
        </div>
    );
}
