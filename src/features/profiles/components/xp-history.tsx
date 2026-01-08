"use client";

import { useEffect, useState } from "react";
import { fetchUserXPHistory } from "@/features/profiles/actions";
import { XPEvent } from "@/features/profiles/types";
import {
    CalendarIcon,
    GithubIcon,
    TrophyIcon,
    FlameIcon,
    CheckCircleIcon,
    SettingsIcon,
    FileTextIcon,
    MessageCircleIcon,
    MessageSquareIcon,
    ThumbsUpIcon,
    ZapIcon
} from "lucide-react";

// Lucide icons map
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EVENT_ICONS: Record<string, any> = {
    daily_login: <CalendarIcon className="w-5 h-5 text-blue-400" />,
    github_contribution: <GithubIcon className="w-5 h-5 text-purple-400" />,
    bounty_submission: <FileTextIcon className="w-5 h-5 text-yellow-400" />,
    bounty_win: <TrophyIcon className="w-5 h-5 text-yellow-500" />,
    streak_milestone: <FlameIcon className="w-5 h-5 text-orange-500" />,
    profile_completion: <CheckCircleIcon className="w-5 h-5 text-green-400" />,
    manual_adjustment: <SettingsIcon className="w-5 h-5 text-gray-400" />,
    // Community Gamification Events
    ask_question: <MessageCircleIcon className="w-5 h-5 text-indigo-400" />,
    answer_question: <MessageSquareIcon className="w-5 h-5 text-cyan-400" />,
    answer_accepted: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
    upvote_received: <ThumbsUpIcon className="w-5 h-5 text-blue-500" />
};

const EVENT_LABELS: Record<string, string> = {
    daily_login: "Daily Login",
    github_contribution: "GitHub Contribution",
    bounty_submission: "Bounty Submitted",
    bounty_win: "Bounty Won",
    streak_milestone: "Streak Milestone",
    profile_completion: "Profile Completed",
    manual_adjustment: "Manual Adjustment",
    // Community Gamification Events
    ask_question: "Asked Question",
    answer_question: "Answered Question",
    answer_accepted: "Answer Accepted",
    upvote_received: "Upvote Received"
};

// Helper to handle dynamic labels based on metadata
const getEventLabel = (event: XPEvent) => {
    if (event.eventType === 'answer_accepted') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const role = (event.metadata as any)?.role;
        if (role === 'asker') return "Accepted an Answer";
        return "Answer Accepted";
    }
    return EVENT_LABELS[event.eventType] || "XP Gained";
};

export function XPHistory() {
    const [events, setEvents] = useState<XPEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserXPHistory(20).then(({ data }) => {
            if (data) setEvents(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-muted/50 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (events.length === 0) {
        return <div className="text-gray-500 text-sm text-center py-4">No recent activity</div>;
    }

    return (
        <div className="xp-history">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-3 bg-[var(--neon-purple)]" />
                <h3 className="text-[10px] font-mono font-black text-muted-foreground uppercase tracking-[0.2em]">Transaction_Logs</h3>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="flex items-center justify-between p-4 bg-card/40 border border-border/10 hover:border-[var(--neon-cyan)]/30 transition-all duration-300 relative group"
                    >
                        <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-10 transition-opacity">
                            <ZapIcon className="w-8 h-8 text-[var(--neon-cyan)]" />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-background border border-border/20 text-muted-foreground group-hover:text-[var(--neon-cyan)] group-hover:border-[var(--neon-cyan)]/30 transition-colors">
                                {EVENT_ICONS[event.eventType] || <ZapIcon className="w-5 h-5" />}
                            </div>
                            <div className="space-y-1">
                                <div className="text-[11px] font-mono font-black text-foreground uppercase tracking-widest">
                                    {getEventLabel(event)}
                                </div>
                                <div className="text-[9px] text-muted-foreground font-mono uppercase opacity-40">
                                    TIMESTAMP: {new Date(event.createdAt).toISOString().replace('T', ' ').slice(0, 19)}
                                </div>
                            </div>
                        </div>
                        <div className="text-[var(--neon-cyan)] font-black font-mono text-xs px-3 py-1 bg-[var(--neon-cyan)]/5 border border-[var(--neon-cyan)]/20 italic">
                            +{event.xpAmount} <span className="text-[8px] opacity-40 not-italic">XP</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
