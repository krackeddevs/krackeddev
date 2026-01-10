"use client";

import { useEffect, useState, useRef } from "react";
import { XPEvent } from "../types";
import { mapEventToSystemSpeak } from "../utils/hud-utils";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalFeedProps {
    logs: XPEvent[];
}

/**
 * A terminal-style feed that displays XP events with a typewriter effect.
 */
export function TerminalFeed({ logs }: TerminalFeedProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Normalize logs to chronological order (oldest first) for sequential animation
    // The logs coming in are usually newest first [newest, ..., oldest]
    // reverse() gives [oldest, ..., newest]
    const chronologicalLogs = [...logs].reverse();

    // Reset animation if logs change significantly (optional, but keep simple for now)
    // We only want to animate new arrivals or the initial list
    useEffect(() => {
        if (chronologicalLogs.length > 0 && activeIndex >= chronologicalLogs.length) {
            // If new logs were added at the end, continue from where we left off
            // Actually, the current logic handles this: activeIndex will point to the next one
        }
    }, [chronologicalLogs.length, activeIndex]);

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, activeIndex]);

    const handleLineComplete = (index: number) => {
        if (index === activeIndex) {
            // Small delay between lines for vibe
            setTimeout(() => {
                setActiveIndex(prev => prev + 1);
            }, 50);
        }
    };

    return (
        <div
            ref={scrollRef}
            className="h-full w-full overflow-y-auto font-mono text-[11px] p-2 space-y-2 relative scrollbar-hide"
        >
            <AnimatePresence initial={false}>
                {chronologicalLogs.map((log, index) => (
                    index <= activeIndex && (
                        <TerminalLine
                            key={log.id}
                            log={log}
                            shouldAnimate={index === activeIndex}
                            onComplete={() => handleLineComplete(index)}
                        />
                    )
                ))}
            </AnimatePresence>

            {/* Active Cursor - only show when not animating or at the very end */}
            {activeIndex >= chronologicalLogs.length && (
                <div className="flex items-center gap-2 text-[var(--neon-cyan)] opacity-40 pt-1">
                    <span>{">"} UPLINK_ACTIVE</span>
                    <span className="w-1.5 h-3 bg-[var(--neon-cyan)] animate-pulse" />
                </div>
            )}

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}

function TerminalLine({
    log,
    shouldAnimate,
    onComplete
}: {
    log: XPEvent;
    shouldAnimate: boolean;
    onComplete: () => void;
}) {
    const text = mapEventToSystemSpeak(log);
    const [displayedText, setDisplayedText] = useState(shouldAnimate ? "" : text);
    const [isComplete, setIsComplete] = useState(!shouldAnimate);
    const hasCalledComplete = useRef(false);

    useEffect(() => {
        if (!shouldAnimate) {
            if (!hasCalledComplete.current) {
                hasCalledComplete.current = true;
                onComplete();
            }
            return;
        }

        let i = displayedText.length;
        const interval = setInterval(() => {
            setDisplayedText(text.slice(0, i));
            if (i >= text.length) {
                clearInterval(interval);
                setIsComplete(true);
                if (!hasCalledComplete.current) {
                    hasCalledComplete.current = true;
                    onComplete();
                }
            }
            i++;
        }, 15);
        return () => clearInterval(interval);
    }, [text, shouldAnimate, onComplete, displayedText.length]);

    const isHighlight = log.eventType === 'bounty_win' || log.eventType === 'streak_milestone';
    const isSystem = log.eventType === 'daily_login' || log.eventType === 'profile_completion' || log.eventType === 'manual_adjustment';

    return (
        <motion.div
            initial={{ opacity: 0, x: -2 }}
            animate={{ opacity: 1, x: 0 }}
            className={`leading-relaxed break-words ${isHighlight ? 'text-[var(--neon-lime)]' :
                isSystem ? 'text-[var(--neon-cyan)]' :
                    'text-foreground/70'
                }`}
        >
            {displayedText}
            {!isComplete && (
                <span className="inline-block w-1.5 h-3 bg-current animate-pulse ml-1 align-normal" />
            )}
        </motion.div>
    );
}
