"use client";

import { useState } from "react";
import { Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const socialLinks = [
    {
        name: "X / Twitter",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        url: "https://x.com/KrackedDevs",
        color: "hover:text-[var(--neon-primary)]",
    },
    {
        name: "TikTok",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
        ),
        url: "https://www.tiktok.com/@krackeddevs",
        color: "hover:text-[var(--neon-cyan)]",
    },
    {
        name: "Instagram",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
        url: "https://www.instagram.com/krackeddevs",
        color: "hover:text-[#E4405F]",
    },
    {
        name: "Discord",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
        ),
        url: "https://discord.gg/krackeddevs",
        color: "hover:text-[#5865F2]",
    },
];

export function FloatingSocialNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 left-6 z-40">
            <div className="relative">
                {/* Social Links - Expand Upward */}
                <div
                    className={cn(
                        "absolute bottom-16 left-0 flex flex-col gap-2 transition-all duration-300",
                        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                    )}
                >
                    {socialLinks.map((link, index) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "group flex items-center gap-3 bg-background border border-border rounded-none p-3 transition-all duration-200",
                                "hover:border-[var(--neon-primary)] hover:shadow-[0_0_10px_rgba(var(--neon-primary-rgb),0.3)]",
                                link.color
                            )}
                            style={{
                                transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
                            }}
                            title={link.name}
                        >
                            <div className="text-foreground/60 group-hover:text-current transition-colors">
                                {link.icon}
                            </div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/60 group-hover:text-current transition-colors whitespace-nowrap">
                                {link.name}
                            </span>
                        </a>
                    ))}
                </div>

                {/* Main Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-12 h-12 rounded-none bg-background border-2 border-border flex items-center justify-center transition-all duration-300",
                        "hover:border-[var(--neon-primary)] hover:shadow-[0_0_15px_rgba(var(--neon-primary-rgb),0.3)]",
                        isOpen && "border-[var(--neon-primary)] shadow-[0_0_15px_rgba(var(--neon-primary-rgb),0.3)]"
                    )}
                    aria-label={isOpen ? "Close social links" : "Open social links"}
                >
                    {isOpen ? (
                        <X className="w-5 h-5 text-[var(--neon-primary)]" />
                    ) : (
                        <Share2 className="w-5 h-5 text-foreground/60 group-hover:text-[var(--neon-primary)]" />
                    )}
                </button>
            </div>
        </div>
    );
}
