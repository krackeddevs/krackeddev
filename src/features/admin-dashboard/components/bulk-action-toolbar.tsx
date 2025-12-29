"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Trash2, Edit, Ban, UserCheck } from "lucide-react";

interface BulkActionToolbarProps {
    selectedCount: number;
    onClearSelection: () => void;
    actions: {
        label: string;
        icon?: React.ReactNode;
        onClick: () => void;
        variant?: "default" | "destructive";
    }[];
}

export function BulkActionToolbar({
    selectedCount,
    onClearSelection,
    actions,
}: BulkActionToolbarProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="flex items-center gap-2 p-3 bg-muted/50 border border-green-500/30 rounded-lg">
            <span className="text-sm font-medium font-mono">
                {selectedCount} selected
            </span>
            <div className="flex gap-2 ml-auto">
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        size="sm"
                        variant={action.variant || "outline"}
                        onClick={action.onClick}
                        className="gap-2"
                    >
                        {action.icon}
                        {action.label}
                    </Button>
                ))}
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClearSelection}
                >
                    Clear
                </Button>
            </div>
        </div>
    );
}
