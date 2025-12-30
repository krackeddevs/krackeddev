"use client";

import React from "react";
import { GithubLanguage } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2 } from "lucide-react";
import { useTheme } from "next-themes";

interface TopLanguagesProps {
    languages: GithubLanguage[];
}

export function TopLanguages({ languages }: TopLanguagesProps) {
    const { theme } = useTheme();

    if (!languages || languages.length === 0) return null;

    // Helper to determine color based on theme
    const getLanguageColor = (langColor?: string) => {
        if (theme === 'blackwhite') {
            return "var(--neon-primary)"; // Or "white" / "var(--foreground)" for strict B&W
        }
        return langColor || "var(--neon-primary)";
    };

    return (
        <Card className="bg-card/40 border-border backdrop-blur-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-neon-cyan font-mono text-sm uppercase tracking-widest">
                    <Code2 className="w-4 h-4" />
                    Top Protocols
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {languages.map((lang) => {
                    const displayColor = getLanguageColor(lang.color);

                    return (
                        <div key={lang.name} className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                                <span className={theme === 'blackwhite' ? "text-foreground" : "text-zinc-300"}>
                                    {lang.name}
                                </span>
                                <span className="text-muted-foreground">{(lang.percentage * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                        width: `${lang.percentage * 100}%`,
                                        backgroundColor: displayColor,
                                        boxShadow: `0 0 10px ${displayColor}`
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
