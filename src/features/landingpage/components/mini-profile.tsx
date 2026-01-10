"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MiniProfileData } from "@/features/profiles/actions";
import { LevelBadge } from "@/features/profiles/components/level-badge";
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
            onClick={() => router.push(`/profile/${encodeURIComponent(data.username || "")}`)}
            className={cn(
                "group relative w-full overflow-hidden rounded-xl border border-border bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-neon-primary/50 hover:shadow-[0_0_20px_var(--neon-primary)] cursor-pointer",
                className
            )}
        >
            {/* Cyberpunk Grid Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: "var(--grid-background)", backgroundSize: "20px 20px" }} />

            <div className="relative z-10 p-5 flex flex-col gap-4">
                {/* Top: Identity */}
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-border group-hover:ring-neon-primary transition-colors">
                            {data.avatar_url ? (
                                <Image
                                    src={data.avatar_url}
                                    alt={data.username || "User"}
                                    width={48}
                                    height={48}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <Code2 className="h-6 w-6 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        {/* Offline/Online indicator */}
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-neon-primary shadow-[0_0_4px_var(--neon-primary)] ring-2 ring-background" />
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className="font-mono text-sm font-bold text-foreground group-hover:text-neon-primary transition-colors truncate">
                            @{data.username || "anon"}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider truncate">
                            {data.developer_role || "Hacker"}
                        </span>
                    </div>
                </div>

                {/* Bottom: Stats */}
                <div className="grid grid-cols-3 gap-2 border-t border-border pt-4 w-full">
                    {/* Level */}
                    {/* Level */}
                    <div className="flex flex-col items-center p-2 rounded transition-colors hover:bg-muted/10">
                        <LevelBadge level={data.level} size="xs" showLabel={false} />
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider whitespace-nowrap mt-1">{data.xp} XP</span>
                    </div>

                    {/* Wins */}
                    <div className="flex flex-col items-center p-2 rounded transition-colors hover:bg-muted/10">
                        <div className="flex items-center gap-1.5 text-base font-mono font-bold text-rank-gold whitespace-nowrap">
                            <Trophy className="h-5 w-5" />
                            <span>{data.bounties_won}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider whitespace-nowrap mt-1">Wins</span>
                    </div>

                    {/* Streak */}
                    <div className="flex flex-col items-center p-2 rounded transition-colors hover:bg-muted/10">
                        <div className="flex items-center gap-1.5 text-base font-mono font-bold text-rank-bronze whitespace-nowrap">
                            <Zap className="h-5 w-5 text-rank-bronze fill-rank-bronze" />
                            <span>{data.current_streak}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider whitespace-nowrap mt-1">Streak</span>
                    </div>
                </div>
            </div>

            {/* Hover Scanline */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-muted/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
        </div>
    );
}
