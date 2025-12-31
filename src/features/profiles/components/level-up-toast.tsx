"use client";

import { toast } from "sonner";
import { TrophyIcon } from "lucide-react";

export function showLevelUpToast(newLevel: number) {
    toast.custom((t) => (
        <div className="flex items-center gap-4 w-full bg-slate-900 border border-cyan-500 rounded-lg p-4 shadow-lg shadow-cyan-500/20 relative overflow-hidden">
            {/* Background glow animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse" />

            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-full text-white shadow-md z-10">
                <TrophyIcon className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 z-10">
                <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-lg">
                    LEVEL UP!
                </div>
                <div className="text-sm text-gray-300">
                    Congratulations! You've reached <span className="text-cyan-400 font-bold">Level {newLevel}</span>
                </div>
            </div>
        </div>
    ), {
        duration: 5000,
    });
}
