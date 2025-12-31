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
        <div className="xp-history max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Recent Activity</h3>
            <div className="space-y-2">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="flex items-center justify-between p-3 bg-card/40 rounded-lg border border-border hover:border-cyan-500/50 transition-colors backdrop-blur-md"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-950/30 rounded-md border border-cyan-900/30">
                                {EVENT_ICONS[event.eventType] || <ZapIcon className="w-5 h-5 text-gray-400" />}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-foreground tracking-wide">
                                    {getEventLabel(event)}
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">
                                    {new Date(event.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="text-cyan-400 font-bold text-xs bg-cyan-950/50 px-2 py-1 rounded border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                            +{event.xpAmount} XP
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
