import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import { ChatMessage } from "../hooks/use-chat";
import { useSupabase } from "@/context/SupabaseContext";

interface MessageListProps {
    messages: ChatMessage[];
    isLoading: boolean;
    channelName?: string;
}

export function MessageList({ messages, isLoading, channelName = "General" }: MessageListProps) {
    const { user } = useSupabase();
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                <div className="flex flex-col items-center gap-2">
                    <span className="animate-spin text-xl">💫</span>
                    <span>Tuning into frequency...</span>
                </div>
            </div>
        );
    }

    return (
        <ScrollArea className="flex-1 p-4 h-full">
            <div className="flex flex-col justify-end min-h-full">
                {/* System Welcome Message */}
                <div className="mb-6 mt-4 text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-2">
                        <span className="text-xl">🏝️</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">Welcome to {channelName}!</p>
                    <p className="text-xs text-muted-foreground max-w-[200px] mx-auto mt-1">
                        This is the start of the {channelName} channel history. Be nice and stay kracked.
                    </p>
                </div>

                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} isMe={user?.id === msg.user_id} />
                ))}
                <div ref={bottomRef} className="h-px w-full" />
            </div>
        </ScrollArea>
    );
}
