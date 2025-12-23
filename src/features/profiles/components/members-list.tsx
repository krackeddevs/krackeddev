"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, User, Calendar, Search } from "lucide-react";
import { Member } from "../actions";

interface MembersListProps {
    members: Member[];
}

export function MembersList({ members }: MembersListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter members based on search
    const filteredMembers = members.filter((member) => {
        const query = searchQuery.toLowerCase();
        return (
            member.username?.toLowerCase().includes(query) ||
            member.full_name?.toLowerCase().includes(query) ||
            member.developer_role?.toLowerCase().includes(query) ||
            member.location?.toLowerCase().includes(query)
        );
    });

    // Format date helper
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search by name, role, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-neon-primary outline-none font-mono text-sm text-white placeholder-gray-500 transition-colors"
                />
            </div>

            {/* Results count */}
            {searchQuery && (
                <p className="text-gray-400 font-mono text-sm">
                    Found {filteredMembers.length} member{filteredMembers.length !== 1 ? "s" : ""}
                </p>
            )}

            {/* Members Grid */}
            {filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                    <User className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 font-mono">
                        {searchQuery ? "No members match your search." : "No members found."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMembers.map((member) => (
                        <Link
                            key={member.id}
                            href={`/profile/${member.username}`}
                            className="block group"
                        >
                            <div className="flex items-center gap-4 p-4 bg-gray-800/50 border border-gray-700 hover:border-neon-primary/50 transition-all">
                                {/* Avatar */}
                                {member.avatar_url ? (
                                    <img
                                        src={member.avatar_url}
                                        alt={member.username || "User"}
                                        className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-neon-primary/50 transition-colors"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center border-2 border-white/10">
                                        <User className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-mono text-white group-hover:text-neon-primary transition-colors truncate">
                                        {member.full_name || member.username || "Anonymous"}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 font-mono">
                                        {member.developer_role && (
                                            <span className="uppercase">{member.developer_role}</span>
                                        )}
                                        {member.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {member.location}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 font-mono mt-1">
                                        <Calendar className="w-3 h-3" />
                                        Joined {formatDate(member.created_at)}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
