import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ChatMessage } from "../hooks/use-chat";
import { FlagModal } from "@/features/moderation/components/flag-modal";
import { Flag } from "lucide-react";

interface MessageBubbleProps {
    message: ChatMessage;
    isMe: boolean;
}

export function MessageBubble({ message, isMe }: MessageBubbleProps) {
    const profile = message.profiles;
    const initial = profile?.username ? profile.username[0].toUpperCase() : "?";

    return (
        <div className={cn("flex gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 group", isMe ? "flex-row-reverse" : "flex-row")}>
            <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>

            <div className={cn("flex flex-col max-w-[80%]", isMe ? "items-end" : "items-start")}>
                <div className="flex items-center gap-2 mb-1">
                    {!isMe && (
                        <span className="text-xs font-bold text-foreground/80">
                            {profile?.username || "Unknown"}
                        </span>
                    )}
                    {!isMe && (
                        <FlagModal resourceId={message.id} resourceType="chat">
                            <button className="text-muted-foreground hover:text-red-500 transition-colors ml-2 opacity-0 group-hover:opacity-100" title="Flag message">
                                <Flag className="h-3 w-3" />
                            </button>
                        </FlagModal>
                    )}
                    {profile?.role === "admin" && (
                        <span className="text-[10px] bg-red-500/10 text-red-500 px-1 rounded uppercase font-bold border border-red-500/20">Admin</span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                </div>

                <div
                    className={cn(
                        "px-3 py-2 rounded-lg text-sm break-words",
                        isMe
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted text-foreground rounded-tl-none border border-border"
                    )}
                >
                    {message.content}
                </div>
            </div>
        </div>
    );
}
