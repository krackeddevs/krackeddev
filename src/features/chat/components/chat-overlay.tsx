"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import { ChatWindow } from "./chat-window";
import { useSupabase } from "@/context/SupabaseContext";
import { usePresence } from "../hooks/use-presence";
import { Button } from "@/components/ui/button";

export function ChatOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useSupabase();
    const { onlineCount } = usePresence("general");

    // Don't show if not logged in? Or show but prompt login?
    // Story says "As a User", implies logged in or at least visible.
    // If not authenticated, we could hide it or show a "Login to chat" state.
    // Let's hide it for now to avoid complexity, or show teaser.
    // Let's show teaser.

    if (!isAuthenticated) return null; // Simple for now.

    return (
        <div className="fixed bottom-20 lg:bottom-4 right-4 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[350px] h-[500px] sm:w-[400px] sm:h-[600px] shadow-2xl rounded-lg origin-bottom-right"
                    >
                        <ChatWindow onClose={() => setIsOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.button
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex items-center justify-center h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all border-2 border-primary"
                >
                    <MessageSquare className="h-6 w-6" />
                    {/* Unread dot or presence count badge */}
                    <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white border-2 border-background">
                        {onlineCount}
                    </div>
                    <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 animate-pulse" />
                </motion.button>
            )}
        </div>
    );
}
