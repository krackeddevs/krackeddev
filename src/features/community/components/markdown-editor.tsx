"use client";

import { useState, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MarkdownViewer } from "@/components/markdown-viewer";
import { Loader2, Image as ImageIcon, Code, Bold, Italic, Link as LinkIcon, List } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
    className?: string; // Add className prop for flexibility
}

export function MarkdownEditor({ value, onChange, placeholder, minHeight = "min-h-[200px]", className }: MarkdownEditorProps) {
    const [isUploading, setIsUploading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const supabase = createClient();

    const insertText = (text: string, cursorOffset = 0) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const previousValue = textarea.value;

        const newValue = previousValue.substring(0, start) + text + previousValue.substring(end);

        onChange(newValue);

        // Restore cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
        }, 0);
    };

    const handleToolbarClick = (type: "bold" | "italic" | "code" | "link" | "list") => {
        switch (type) {
            case "bold":
                insertText("**bold**", 2);
                break;
            case "italic":
                insertText("*italic*", 1);
                break;
            case "code":
                insertText("\n```javascript\n\n```\n", 15);
                break;
            case "link":
                insertText("[text](url)", 1);
                break;
            case "list":
                insertText("\n- ", 3);
                break;
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB.");
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("community-images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("community-images")
                .getPublicUrl(filePath);

            insertText(`![](${publicUrl})`, 0); // Insert image markdown
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith("image/")) {
                const file = item.getAsFile();
                if (file) {
                    handleImageUpload(file);
                    e.preventDefault(); // Prevent double paste behavior if text is also present
                }
            }
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className={cn("border rounded-lg overflow-hidden bg-card", className)} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <Tabs defaultValue="write" className="w-full">
                <div className="flex items-center justify-between px-2 bg-muted/30 border-b">
                    <TabsList className="bg-transparent h-9">
                        <TabsTrigger value="write" className="data-[state=active]:bg-background text-xs px-3 h-7">Write</TabsTrigger>
                        <TabsTrigger value="preview" className="data-[state=active]:bg-background text-xs px-3 h-7">Preview</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-1 py-1">
                        <ToolbarButton icon={<Bold className="w-3 h-3" />} onClick={() => handleToolbarClick("bold")} tooltip="Bold" />
                        <ToolbarButton icon={<Italic className="w-3 h-3" />} onClick={() => handleToolbarClick("italic")} tooltip="Italic" />
                        <ToolbarButton icon={<List className="w-3 h-3" />} onClick={() => handleToolbarClick("list")} tooltip="List" />
                        <ToolbarButton icon={<LinkIcon className="w-3 h-3" />} onClick={() => handleToolbarClick("link")} tooltip="Link" />
                        <ToolbarButton icon={<Code className="w-3 h-3" />} onClick={() => handleToolbarClick("code")} tooltip="Code Block" />
                        <div className="w-px h-4 bg-border mx-1" />
                        <div className="relative">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                                disabled={isUploading}
                            />
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" disabled={isUploading}>
                                {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                            </Button>
                        </div>
                    </div>
                </div>

                <TabsContent value="write" className="p-0 m-0 relative group">
                    {isUploading && (
                        <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="flex items-center gap-2 bg-card p-2 rounded border shadow-lg">
                                <Loader2 className="animate-spin h-4 w-4" />
                                <span className="text-xs font-medium">Uploading image...</span>
                            </div>
                        </div>
                    )}
                    <Textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onPaste={handlePaste}
                        placeholder={placeholder || "Write your question here... (Markdown supported)"}
                        className={`w-full border-0 focus-visible:ring-0 rounded-none resize-none p-4 font-mono text-sm ${minHeight}`}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Attach images by dragging & dropping, selecting or pasting them.
                    </div>
                </TabsContent>

                <TabsContent value="preview" className={`p-4 overflow-y-auto ${minHeight} bg-muted/10`}>
                    {value ? (
                        <MarkdownViewer content={value} />
                    ) : (
                        <p className="text-muted-foreground text-sm italic">Nothing to preview</p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ToolbarButton({ icon, onClick, tooltip }: { icon: React.ReactNode, onClick: () => void, tooltip: string }) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={onClick}
            title={tooltip}
        >
            {icon}
        </Button>
    );
}
