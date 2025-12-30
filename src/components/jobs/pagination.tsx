"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    isLoading,
}: PaginationProps) {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Always show first page
        pages.push(1);

        // Calculate range around current page
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        // Adjust range if we're near the edges
        if (currentPage <= 3) {
            end = 4;
        }
        if (currentPage >= totalPages - 2) {
            start = totalPages - 3;
        }

        // Add ellipsis after first page if needed
        if (start > 2) {
            pages.push("...");
        }

        // Add middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add ellipsis before last page if needed
        if (end < totalPages - 1) {
            pages.push("...");
        }

        // Always show last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 py-8 font-mono">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="border-neon-cyan/30 hover:border-neon-cyan hover:bg-neon-cyan/10"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Previous</span>
            </Button>

            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) =>
                    typeof page === "number" ? (
                        <Button
                            key={index}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(page)}
                            disabled={isLoading}
                            className={
                                currentPage === page
                                    ? "bg-neon-cyan text-black hover:bg-neon-cyan/90 min-w-[36px]"
                                    : "border-neon-cyan/30 hover:border-neon-cyan hover:bg-neon-cyan/10 min-w-[36px]"
                            }
                        >
                            {page}
                        </Button>
                    ) : (
                        <span key={index} className="px-2 text-muted-foreground">
                            {page}
                        </span>
                    )
                )}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="border-neon-cyan/30 hover:border-neon-cyan hover:bg-neon-cyan/10"
            >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
}
