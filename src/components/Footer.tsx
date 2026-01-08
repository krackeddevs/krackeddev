"use client";

import Link from "next/link";
import { TwitterIcon } from "@/components/icons/twitter-icon";
import { DiscordIcon } from "@/components/icons/discord-icon";
import { TikTokIcon } from "@/components/icons/tiktok-icon";
import { cn } from "@/lib/utils";

const FOOTER_LINKS = [
    {
        title: "PROJECT",
        links: [
            { name: "Santan Island", href: "/game" },
            { name: "Manifesto", href: "/about" },
        ],
    },
    {
        title: "COMMUNITY",
        links: [
            { name: "Developers", href: "/for-developers" },
            { name: "Agent Directory", href: "/members" },
        ],
    },
    {
        title: "BUSINESS",
        links: [
            { name: "For Companies", href: "/for-company" },
            { name: "Company Directory", href: "/companies" },
            { name: "Job Board", href: "/jobs" },
            { name: "Bounty Board", href: "/code/bounty" },
        ],
    },
    {
        title: "GOVERNMENT",
        links: [
            { name: "Government", href: "/for-government" },
        ],
    },
];

const SOCIAL_LINKS = [
    { name: "X", href: "https://x.com/KrackedDevs", icon: TwitterIcon },
    { name: "Discord", href: "https://discord.gg/krackeddevs", icon: DiscordIcon },
    { name: "TikTok", href: "https://www.tiktok.com/@krackeddevs", icon: TikTokIcon },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-border/20 bg-background pt-10 pb-6 px-4 transition-colors duration-300 relative overflow-hidden">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-background z-0" />

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-10">
                    {/* Brand Section */}
                    <div className="col-span-2 space-y-4">
                        <Link href="/" className="group inline-flex items-center gap-2">
                            <span className="font-mono text-xl font-bold tracking-tighter text-foreground group-hover:text-[var(--neon-primary)] transition-colors duration-300">
                                &lt;Kracked Devs /&gt;
                            </span>
                        </Link>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed max-w-[280px]">
                            A nexus for high-performance developers. Building the future of technical excellence in Southeast Asia.
                        </p>
                        <div className="flex gap-4">
                            {SOCIAL_LINKS.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-8 w-8 flex items-center justify-center border border-border/30 rounded-none bg-background hover:border-[var(--neon-primary)] hover:text-[var(--neon-primary)] transition-all group"
                                        aria-label={social.name}
                                    >
                                        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-[var(--neon-primary)] transition-colors" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {FOOTER_LINKS.map((group) => (
                        <div key={group.title} className="space-y-3">
                            <h3 className="font-mono text-[11px] font-bold tracking-[0.2em] text-foreground/40 uppercase">
                                {group.title}
                            </h3>
                            <ul className="space-y-1">
                                {group.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="font-mono text-[10px] text-muted-foreground hover:text-[var(--neon-primary)] uppercase tracking-widest transition-colors block py-0.5"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="pt-6 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                            © {currentYear} KRACKED_OS v1.4.0
                        </span>
                        <div className="flex gap-4">
                            <Link href="/privacy" className="font-mono text-[9px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
                                Privacy
                            </Link>
                            <Link href="/terms" className="font-mono text-[9px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
                                Terms
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-primary)] animate-pulse shadow-[0_0_8px_var(--neon-primary)]" />
                        <span className="font-mono text-[9px] text-[var(--neon-primary)] font-bold uppercase tracking-widest">
                            All systems operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
