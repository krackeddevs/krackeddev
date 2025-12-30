"use client";

import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VotingControlProps {
    upvotes: number;
    orientation?: "vertical" | "horizontal";
    className?: string;
}

export function VotingControl({ upvotes, orientation = "vertical", className }: VotingControlProps) {
    return (
        <div className={cn("flex items-center gap-1", orientation === "vertical" ? "flex-col" : "flex-row", className)}>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-500/10 hover:text-green-500 rounded-full">
                <ChevronUp className="h-6 w-6" />
            </Button>

            <span className="font-mono font-bold text-lg">{upvotes}</span>

            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500 rounded-full" disabled>
                {/* Downvotes pending requirement */}
                <ChevronDown className="h-6 w-6 opacity-30" />
            </Button>
        </div>
    );
}
