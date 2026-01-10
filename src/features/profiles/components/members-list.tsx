"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, User, Calendar, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Member } from "../actions";
import { cn } from "@/lib/utils";

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
            <div className="relative group max-w-2xl mx-auto mb-16">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 group-focus-within:text-[var(--neon-primary)] transition-colors" />
                <input
                    type="text"
                    placeholder="LOCATE OPERATIVES (NAME, ROLE, LOCATION)..."
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-card/40 backdrop-blur-md border border-border/50 focus:border-[var(--neon-primary)]/50 focus:ring-1 focus:ring-[var(--neon-primary)]/20 outline-none font-mono text-[10px] tracking-[0.2em] uppercase text-foreground placeholder:text-foreground/40 transition-all rounded-none"
                />
            </div>

            {/* Results count */}
            {searchInput && (
                <p className="text-[var(--neon-primary)] font-mono text-[10px] tracking-[0.3em] uppercase mb-8 text-center animate-pulse">
                    IDENTIFYING SIGNATURES: {members.length} OF {total} MATCHES
                </p>
            )}

            {/* Members Grid */}
            {members.length === 0 ? (
                <div className="text-center py-20 border border-border/30 rounded-none bg-card/5">
                    <User className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
                    <p className="text-foreground/30 font-mono text-[10px] tracking-widest uppercase">
                        {searchInput ? "NO SIGNATURES MATCH QUERY PROTOCOLS." : "NO OPERATIVES REGISTERED."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => (
                        <Link
                            key={member.id}
                            href={`/profile/${encodeURIComponent(member.username || "")}`}
                            className="block group relative"
                        >
                            <div className="relative flex items-center gap-5 p-5 bg-card/40 backdrop-blur-md border border-border/50 group-hover:border-[var(--neon-primary)]/50 group-hover:bg-foreground/[0.02] transition-all duration-300 rounded-none h-[110px] overflow-hidden">
                                {/* Level Badge */}
                                <div className="absolute top-0 right-0 bg-[var(--neon-primary)]/10 border-l border-b border-border/50 px-3 py-1">
                                    <span className="text-[9px] font-mono text-[var(--neon-primary)] font-bold tracking-tight">LV. {member.level || 1}</span>
                                </div>

                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <div className="w-16 h-16 rounded-none border border-border/50 p-1 group-hover:border-[var(--neon-primary)]/50 transition-colors bg-background/50">
                                        {member.avatar_url ? (
                                            <img
                                                src={member.avatar_url}
                                                alt={member.username || "User"}
                                                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted/20">
                                                <User className="w-6 h-6 text-foreground/20" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                                    <h3 className="font-bold font-mono text-foreground uppercase group-hover:text-[var(--neon-primary)] transition-colors truncate text-sm tracking-tighter">
                                        {member.full_name || member.username || "Anonymous"}
                                    </h3>

                                    <div className="text-[9px] text-[var(--neon-primary)]/80 font-mono font-black uppercase tracking-[0.2em] truncate">
                                        {member.developer_role || "DEVELOPER"}
                                    </div>

                                    <div className="flex items-center gap-3 text-[9px] text-foreground/60 font-mono mt-1 truncate uppercase tracking-tight">
                                        {member.location ? (
                                            <span className="flex items-center gap-1 truncate">
                                                <MapPin className="w-2.5 h-2.5 opacity-60" />
                                                <span className="truncate">{member.location}</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-2.5 h-2.5 opacity-60" />
                                                <span>SINCE {formatDate(member.created_at)}</span>
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
                <div className="flex items-center justify-center gap-2 mt-16">
                    {/* Previous Button */}
                    <Link
                        href={currentPage > 1 ? `/members?page=${currentPage - 1}` : '#'}
                        className={`group flex items-center gap-2 px-6 py-3 font-mono text-[10px] uppercase font-bold tracking-widest border transition-all rounded-none ${currentPage > 1
                            ? 'border-border/50 text-foreground/60 hover:border-[var(--neon-primary)]/50 hover:text-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/5'
                            : 'border-border/20 text-foreground/20 cursor-not-allowed'
                            }`}
                        onClick={(e) => currentPage <= 1 && e.preventDefault()}
                    >
                        <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        <span>PREV</span>
                    </Link>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-2">
                        {getPageNumbers().map((page, idx) =>
                            typeof page === 'number' ? (
                                <Link
                                    key={idx}
                                    href={`/members?page=${page}`}
                                    className={`px-4 py-3 font-mono text-[10px] font-bold border transition-all rounded-none min-w-[3rem] text-center ${currentPage === page
                                        ? 'border-[var(--neon-primary)] bg-[var(--neon-primary)]/10 text-[var(--neon-primary)] shadow-[0_0_15px_rgba(var(--neon-primary-rgb),0.1)]'
                                        : 'border-border/50 text-foreground/40 hover:border-[var(--neon-primary)]/30 hover:text-foreground'
                                        }`}
                                >
                                    {page.toString().padStart(2, '0')}
                                </Link>
                            ) : (
                                <span key={idx} className="px-3 py-3 font-mono text-[10px] text-foreground/20">
                                    ///
                                </span>
                            )
                        )}
                    </div>

                    {/* Next Button */}
                    <Link
                        href={currentPage < totalPages ? `/members?page=${currentPage + 1}` : '#'}
                        className={`group flex items-center gap-2 px-6 py-3 font-mono text-[10px] uppercase font-bold tracking-widest border transition-all rounded-none ${currentPage < totalPages
                            ? 'border-border/50 text-foreground/60 hover:border-[var(--neon-primary)]/50 hover:text-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/5'
                            : 'border-border/20 text-foreground/20 cursor-not-allowed'
                            }`}
                        onClick={(e) => currentPage >= totalPages && e.preventDefault()}
                    >
                        <span>NEXT</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            )}
        </div>
    );
}
