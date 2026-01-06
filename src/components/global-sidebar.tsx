"use client";

import { X, Home, Users, Briefcase, Trophy, Code, Info, Shield, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/context/SupabaseContext";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GlobalSidebar({ isOpen, onClose }: SidebarProps) {
    const { profile } = useSupabase();

    const menuItems = [
        { label: "Dashboard", icon: Home, href: "/" },
        { label: "Command Center", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Townhall", icon: Users, href: "/community" },
        { label: "Job Board", icon: Briefcase, href: "/jobs" },
        { label: "Leaderboard", icon: Trophy, href: "/leaderboard" },
        { label: "Bounty Board", icon: Code, href: "/code/bounty" },
        { label: "The Manifesto", icon: Info, href: "/about" },
    ];

    if (profile?.role === 'admin') {
        menuItems.push({ label: "Admin Console", icon: Shield, href: "/admin/dashboard" });
    }

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Panel */}
            <div className={`
                fixed top-0 left-0 h-full w-72 bg-sidebar border-r border-sidebar-border z-[101] shadow-[20px_0_50px_rgba(0,0,0,0.5)]
                transition-transform duration-300 ease-out transform transition-colors
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="h-full flex flex-col p-8">
                    <div className="flex items-center justify-between mb-16">
                        <div className="font-mono text-[var(--neon-primary)] font-bold tracking-widest text-xs">MAIN NAVIGATION</div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/10 h-8 w-8">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <nav className="flex-grow flex flex-col gap-3">
                        {menuItems.map((item, i) => (
                            <Link
                                key={i}
                                href={item.href}
                                className="group flex items-center gap-4 py-3 border-b border-sidebar-border/50 hover:border-[var(--neon-primary)] transition-all duration-300"
                                onClick={onClose}
                            >
                                <item.icon className="w-4 h-4 text-sidebar-foreground/30 group-hover:text-[var(--neon-primary)] transition-colors" />
                                <span className="font-mono text-xs uppercase tracking-[0.2em] text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors">
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto border-t border-sidebar-border/30 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[var(--neon-primary)]/10 border border-[var(--neon-primary)]/30 flex items-center justify-center">
                                <Code className="w-5 h-5 text-[var(--neon-primary)]" />
                            </div>
                            <div>
                                <div className="text-[10px] font-mono text-sidebar-foreground/40 tracking-wider">NETWORK STATUS</div>
                                <div className="text-xs font-mono text-[var(--neon-primary)] font-bold tracking-widest">BETA v1.4.0</div>
                            </div>
                        </div>
                        <p className="text-[9px] font-mono text-sidebar-foreground/30 uppercase leading-relaxed tracking-tight">
                            Crafted for the Malaysian developer elite. Stay kracked.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
