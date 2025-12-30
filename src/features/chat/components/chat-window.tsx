import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "../hooks/use-chat";
import { usePresence } from "../hooks/use-presence";
import { MessageList } from "./message-list";
import { Loader2, Send, Minimize2, Info } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatWindowProps {
    channelId?: string;
    onClose: () => void;
}

export function ChatWindow({ channelId: initialChannel = "general", onClose }: ChatWindowProps) {
    const [activeChannel, setActiveChannel] = useState(initialChannel);
    const { messages, isLoading, sendMessage, isSending } = useChat(activeChannel);
    const { onlineCount, onlineUsers } = usePresence(activeChannel);
    const [inputValue, setInputValue] = useState("");

    const channels = [
        { id: "general", label: "#general" },
        { id: "bounty-hunting", label: "#bounty-hunting" },
        { id: "looking-for-group", label: "#lfg" },
    ];

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isSending) return;

        const content = inputValue;
        setInputValue(""); // Clear immediately for optimistic feel
        await sendMessage(content);
    };

    const currentChannelLabel = channels.find(c => c.id === activeChannel)?.label || `#${activeChannel}`;

    return (
        <div className="w-full h-full flex flex-col bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-t-lg sm:rounded-lg overflow-hidden flex-1">
            {/* Header */}
            <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <div className="flex flex-col">
                        <h3 className="font-bold text-sm">Townhall {currentChannelLabel}</h3>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="text-[10px] text-muted-foreground hover:underline flex items-center gap-1 cursor-pointer outline-none">
                                    {onlineCount} Online
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-2" align="start">
                                <h4 className="text-xs font-bold mb-2 px-1">Online Users</h4>
                                <ScrollArea className="h-[200px]">
                                    <div className="space-y-1">
                                        {onlineUsers.map((u) => (
                                            <div key={u.user_id} className="flex items-center gap-2 p-1 hover:bg-muted rounded-md text-xs">
                                                <Avatar className="h-5 w-5">
                                                    <AvatarImage src={u.avatar_url || ""} />
                                                    <AvatarFallback>{u.username[0] || "?"}</AvatarFallback>
                                                </Avatar>
                                                <span className="truncate">{u.username}</span>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="group relative mr-2">
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        <div className="absolute right-0 top-6 w-48 bg-card border border-border p-2 rounded text-[10px] text-muted-foreground shadow-lg hidden group-hover:block z-50">
                            Info: Mentions and private DMs are coming soon! Stay tuned.
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
                        <Minimize2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Channel Tabs */}
            <div className="flex items-center gap-1 p-1 bg-muted/20 border-b border-border overflow-x-auto no-scrollbar">
                {channels.map((channel) => (
                    <button
                        key={channel.id}
                        onClick={() => setActiveChannel(channel.id)}
                        className={`text-xs px-2 py-1 rounded-md transition-colors whitespace-nowrap ${activeChannel === channel.id
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            }`}
                    >
                        {channel.label}
                    </button>
                ))}
            </div>

            {/* MessageList */}
            <MessageList
                messages={messages}
                isLoading={isLoading}
                channelName={currentChannelLabel}
            />

            {/* Input */}
            <div className="p-3 border-t border-border bg-background">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Message ${currentChannelLabel}...`}
                        className="flex-1 bg-muted/50 border-input/50 focus-visible:ring-1"
                        disabled={isSending}
                        autoFocus
                    />
                    <Button type="submit" size="icon" disabled={isSending || !inputValue.trim()} className="shrink-0">
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}
