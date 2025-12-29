"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MiniProfileData } from "@/features/profiles/actions";
import { Trophy, Zap, Code2, Globe } from "lucide-react";

interface MiniProfileProps {
    data: MiniProfileData;
    className?: string;
}

export function MiniProfile({ data, className }: MiniProfileProps) {
    const router = useRouter();

    if (!data) return null;

    return (
        <div
            onClick={() => router.push("/profile/")}
            className={cn(
                "group relative w-full overflow-hidden rounded-xl border border-white/10 bg-black/10 backdrop-blur-sm transition-all duration-300 hover:border-neon-primary/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] cursor-pointer",
                className
            )}
        >
            {/* Cyberpunk Grid Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.17) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

            <div className="relative z-10 p-5 flex flex-col gap-4">
                {/* Top: Identity */}
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/10 group-hover:ring-neon-primary transition-colors">
                            {data.avatar_url ? (
                                <Image
                                    src={data.avatar_url}
                                    alt={data.username || "User"}
                                    width={48}
                                    height={48}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-white/5">
                                    <Code2 className="h-6 w-6 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        {/* Offline/Online indicator */}
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-neon-primary shadow-[0_0_4px_rgba(34,197,94,0.8)] ring-2 ring-black" />
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className="font-mono text-sm font-bold text-white group-hover:text-neon-primary transition-colors truncate">
                            @{data.username || "anon"}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider truncate">
                            {data.developer_role || "Hacker"}
                        </span>
                    </div>
                </div>

                {/* Bottom: Stats */}
                <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 w-full">
                    {/* Level */}
                    <div className="flex flex-col items-center p-2 rounded transition-colors hover:bg-white/5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-400 whitespace-nowrap">
                            <Globe className="h-3 w-3" />
                            <span>Lvl {data.level}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider whitespace-nowrap">{data.xp} XP</span>
                    </div>

                    {/* Wins */}
                    <div className="flex flex-col items-center p-2 rounded transition-colors hover:bg-white/5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-yellow-400 whitespace-nowrap">
                            <Trophy className="h-3 w-3" />
                            <span>{data.bounties_won}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider whitespace-nowrap">Wins</span>
                    </div>

                    {/* Streak */}
                    <div className="flex flex-col items-center p-2 rounded transition-colors hover:bg-white/5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-400 whitespace-nowrap">
                            <Zap className="h-3 w-3 fill-orange-400" />
                            <span>{data.current_streak}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider whitespace-nowrap">Streak</span>
                    </div>
                </div>
            </div>

            {/* Hover Scanline */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
        </div>
    );
}
