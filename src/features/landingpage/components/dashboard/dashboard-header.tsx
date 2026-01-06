"use client";

import Link from "next/link";
import { Menu, User, Sun, Moon, Zap, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/context/SupabaseContext";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

interface HeaderProps {
    onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: HeaderProps) {
    const { isAuthenticated, signOut, openLoginModal, profile } = useSupabase();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const cycleTheme = () => {
        if (theme === "dark") setTheme("light");
        else if (theme === "light") setTheme("monochrome-dark");
        else if (theme === "monochrome-dark") setTheme("monochrome-light");
        else setTheme("dark");
    };

    const getThemeIcon = () => {
        if (theme === "dark") return <Moon className="w-4 h-4 text-[#22c55e]" />;
        if (theme === "light") return <Sun className="w-4 h-4 text-[#15803d]" />;
        if (theme === "monochrome-dark") return <Zap className="w-4 h-4 text-white" />;
        if (theme === "monochrome-light") return <Ghost className="w-4 h-4 text-black" />;
        return <Moon className="w-4 h-4" />;
    };

    const getThemeLabel = () => {
        if (theme === "dark") return "DARK NEON";
        if (theme === "light") return "LIGHT NEON";
        if (theme === "monochrome-dark") return "DARK NOIR";
        if (theme === "monochrome-light") return "LIGHT NOIR";
        return "THEME";
    };

    return (
        <header className="h-14 flex items-center justify-between px-4 border-b border-border/20 bg-background sticky top-0 z-50 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onMenuClick} className="text-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/10 h-8 w-8">
                    <Menu className="w-5 h-5" />
                </Button>

                <Link href="/" className="flex items-center gap-2 group">
                    <span className="font-mono text-lg font-bold tracking-tighter text-foreground group-hover:text-[var(--neon-primary)] transition-colors duration-300">
                        &lt;Kracked Devs /&gt;
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-[var(--beta-badge)] text-[var(--beta-badge-text)]">
                        BETA
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2">
                    <Button
                        variant="ghost"
                        asChild
                        className="text-foreground/60 hover:text-[var(--neon-primary)] font-mono text-[10px] uppercase tracking-widest h-8"
                    >
                        <Link href="/for-company">For Company</Link>
                    </Button>

                    <Button
                        variant="ghost"
                        asChild
                        className="text-foreground/60 hover:text-[var(--neon-primary)] font-mono text-[10px] uppercase tracking-widest h-8"
                    >
                        <Link href="/for-developers">For Developers</Link>
                    </Button>

                    <Button
                        variant="ghost"
                        asChild
                        className="text-foreground/60 hover:text-[var(--neon-primary)] font-mono text-[10px] uppercase tracking-widest h-8"
                    >
                        <Link href="/for-government">For Government</Link>
                    </Button>

                    <Button
                        asChild
                        className="bg-transparent border border-[var(--neon-primary)]/50 text-[var(--neon-primary)] hover:bg-[var(--neon-primary)] hover:text-white font-mono text-[10px] uppercase tracking-widest h-8 px-4 rounded-sm transition-all ml-2"
                    >
                        <Link href="/hire/register">Hiring?</Link>
                    </Button>
                </div>

                <div className="flex items-center h-8 bg-background border border-border/20 rounded-sm ml-2 overflow-hidden shadow-sm">
                    <Button
                        variant="ghost"
                        className="h-full px-3 text-foreground/50 hover:text-[var(--neon-primary)] flex items-center gap-2 transition-colors"
                        onClick={cycleTheme}
                        title={`Current Theme: ${getThemeLabel()}`}
                    >
                        {getThemeIcon()}
                        <span className="text-[9px] font-mono font-bold tracking-widest hidden sm:inline">{getThemeLabel()}</span>
                    </Button>

                    <div className="w-[1px] h-4 bg-border/20" />

                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-full w-8 text-foreground/50 hover:text-[var(--neon-primary)]">
                                    <User className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background border-border/20">
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="cursor-pointer font-mono text-foreground hover:text-[var(--neon-primary)]">PROFILE</Link>
                                </DropdownMenuItem>
                                {profile?.role === 'admin' && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/dashboard" className="cursor-pointer font-mono text-[#fbbf24]">ADMIN</Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator className="bg-border/10" />
                                <DropdownMenuItem
                                    className="text-red-500 font-mono"
                                    onClick={() => signOut()}
                                >
                                    LOGOUT
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="ghost" size="icon" className="h-full w-8 text-foreground/50 hover:text-[var(--neon-primary)]" onClick={() => openLoginModal()}>
                            <User className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
