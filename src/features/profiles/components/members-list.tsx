"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, User, Calendar, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Member } from "../actions";

interface MembersListProps {
    members: Member[];
    currentPage: number;
    totalPages: number;
    total: number;
    searchQuery?: string;
}

export function MembersList({ members, currentPage, totalPages, total, searchQuery: initialQuery = "" }: MembersListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchInput, setSearchInput] = useState(initialQuery);

    const handleSearch = (value: string) => {
        setSearchInput(value);

        // Debounce search - update URL after user stops typing
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
            params.set('q', value.trim());
            params.delete('page'); // Reset to page 1 on new search
        } else {
            params.delete('q');
        }

        // Use setTimeout for debouncing
        setTimeout(() => {
            router.push(`/members?${params.toString()}`);
        }, 500);
    };

    // Format date helper
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="space-y-6">
            {/* Search Input */}
            <div className="relative group">
                <div className="absolute inset-0 bg-primary/10 dark:bg-neon-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary dark:text-neon-primary" />
                    <input
                        type="text"
                        placeholder="Search by name, role, or location..."
                        value={searchInput}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-card/80 dark:bg-black/40 backdrop-blur-md border border-border dark:border-neon-primary/30 focus:border-primary dark:focus:border-neon-primary outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground/70 transition-all rounded-lg shadow-sm dark:shadow-[0_0_10px_rgba(34,211,238,0.05)] focus:shadow-md dark:focus:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    />
                </div>
            </div>

            {/* Results count */}
            {searchInput && (
                <p className="text-primary dark:text-neon-primary font-mono text-sm tracking-widest uppercase">
                    Detecting signatures: {members.length} of {total}
                </p>
            )}

            {/* Members Grid */}
            {members.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border/50 rounded-xl bg-muted/20 dark:bg-card/10">
                    <User className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                    <p className="text-muted-foreground font-mono">
                        {searchInput ? "No signatures match query protocols." : "No members found."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => (
                        <Link
                            key={member.id}
                            href={`/profile/${member.username}`}
                            className="block group relative"
                        >
                            <div className="absolute inset-0 bg-primary/5 dark:bg-neon-primary/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                            <div className="relative flex items-center gap-4 p-5 bg-card/50 dark:bg-card/20 backdrop-blur-md border border-border dark:border-white/10 group-hover:border-primary/50 dark:group-hover:border-neon-primary/50 transition-all duration-300 rounded-xl h-[96px] overflow-hidden group-hover:-translate-y-1 group-hover:shadow-md dark:group-hover:shadow-[0_4px_20px_rgba(34,211,238,0.15)]">
                                {/* Level Badge */}
                                <div className="absolute top-0 right-0 bg-primary/10 dark:bg-neon-primary/10 border-l border-b border-primary/20 dark:border-neon-primary/20 px-2 py-0.5 rounded-bl-lg">
                                    <span className="text-[10px] font-mono text-primary dark:text-neon-primary font-bold">LVL {member.level || 1}</span>
                                </div>

                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    {member.avatar_url ? (
                                        <div className="relative">
                                            <div className="absolute inset-0 rounded-full bg-primary dark:bg-neon-primary blur-md opacity-20 group-hover:opacity-60 transition-opacity" />
                                            <img
                                                src={member.avatar_url}
                                                alt={member.username || "User"}
                                                className="relative w-14 h-14 rounded-full border-2 border-background dark:border-white/20 group-hover:border-primary dark:group-hover:border-neon-primary transition-colors object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center border-2 border-border dark:border-white/10 group-hover:border-primary/50 dark:group-hover:border-neon-primary/50 transition-colors">
                                            <User className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                                    <h3 className="font-bold font-mono text-foreground group-hover:text-primary dark:group-hover:text-neon-primary transition-colors truncate text-base tracking-tight">
                                        {member.full_name || member.username || "Anonymous"}
                                    </h3>

                                    <div className="text-xs text-primary/80 dark:text-neon-primary/70 font-mono uppercase tracking-wider truncate">
                                        {member.developer_role || "DEVELOPER"}
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono mt-1 truncate">
                                        {member.location ? (
                                            <span className="flex items-center gap-1 truncate">
                                                <MapPin className="w-3 h-3 text-muted-foreground/70 dark:text-white/40" />
                                                <span className="truncate max-w-[120px]">{member.location}</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-muted-foreground/70 dark:text-white/40" />
                                                <span>Joined {formatDate(member.created_at)}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {!searchInput && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    {/* Previous Button */}
                    <Link
                        href={currentPage > 1 ? `/members?page=${currentPage - 1}` : '#'}
                        className={`flex items-center gap-1 px-4 py-2 font-mono text-sm border transition-all rounded ${currentPage > 1
                            ? 'border-border dark:border-neon-primary/30 text-foreground hover:border-primary dark:hover:border-neon-primary hover:bg-primary/5 dark:hover:bg-neon-primary/10'
                            : 'border-border/50 text-muted-foreground cursor-not-allowed opacity-50'
                            }`}
                        onClick={(e) => currentPage <= 1 && e.preventDefault()}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Prev</span>
                    </Link>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, idx) =>
                            typeof page === 'number' ? (
                                <Link
                                    key={idx}
                                    href={`/members?page=${page}`}
                                    className={`px-3 py-2 font-mono text-sm border transition-all rounded min-w-[2.5rem] text-center ${currentPage === page
                                        ? 'border-primary dark:border-neon-primary bg-primary/10 dark:bg-neon-primary/10 text-primary dark:text-neon-primary font-bold'
                                        : 'border-border dark:border-neon-primary/30 text-foreground hover:border-primary dark:hover:border-neon-primary hover:bg-primary/5 dark:hover:bg-neon-primary/10'
                                        }`}
                                >
                                    {page}
                                </Link>
                            ) : (
                                <span key={idx} className="px-2 text-muted-foreground">
                                    ...
                                </span>
                            )
                        )}
                    </div>

                    {/* Next Button */}
                    <Link
                        href={currentPage < totalPages ? `/members?page=${currentPage + 1}` : '#'}
                        className={`flex items-center gap-1 px-4 py-2 font-mono text-sm border transition-all rounded ${currentPage < totalPages
                            ? 'border-border dark:border-neon-primary/30 text-foreground hover:border-primary dark:hover:border-neon-primary hover:bg-primary/5 dark:hover:bg-neon-primary/10'
                            : 'border-border/50 text-muted-foreground cursor-not-allowed opacity-50'
                            }`}
                        onClick={(e) => currentPage >= totalPages && e.preventDefault()}
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}
