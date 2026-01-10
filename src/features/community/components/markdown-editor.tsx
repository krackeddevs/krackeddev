"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TiptapToolbar } from "./tiptap-toolbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownViewer } from "@/components/markdown-viewer";
import { Loader2 } from "lucide-react";
import "./tiptap-styles.css";
import { defaultMarkdownSerializer } from "prosemirror-markdown";

const lowlight = createLowlight(common);

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
    className?: string;
}

export function MarkdownEditor({
    value,
    onChange,
    placeholder,
    minHeight = "min-h-[200px]",
    className,
}: MarkdownEditorProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false, // We'll use CodeBlockLowlight instead
            }),
            Placeholder.configure({
                placeholder: placeholder || "Write your question here... (Markdown supported)",
            }),
            Image.configure({
                inline: true,
                allowBase64: false,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: cn("tiptap-editor p-4 focus:outline-none", minHeight),
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const markdown = editorToMarkdown(html);
            onChange(markdown);
        },
    });

    // Update editor content when value changes externally
    useEffect(() => {
        if (editor && value !== editorToMarkdown(editor.getHTML())) {
            const html = markdownToHtml(value);
            editor.commands.setContent(html, { emitUpdate: false });
        }
    }, [value, editor]);

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

            const {
                data: { publicUrl },
            } = supabase.storage.from("community-images").getPublicUrl(filePath);

            // Insert image into editor
            editor?.chain().focus().setImage({ src: publicUrl }).run();
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
        // Reset input
        e.target.value = "";
    };

    // Handle paste images
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of Array.from(items)) {
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) {
                        e.preventDefault();
                        handleImageUpload(file);
                    }
                }
            }
        };

        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, [editor]);

    return (
        <div className={cn("border rounded-lg overflow-hidden bg-card", className)}>
            <Tabs defaultValue="write" className="w-full">
                <div className="flex items-center justify-between border-b">
                    <TabsList className="bg-transparent h-9 px-2">
                        <TabsTrigger
                            value="write"
                            className="data-[state=active]:bg-background text-xs px-3 h-7"
                        >
                            Write
                        </TabsTrigger>
                        <TabsTrigger
                            value="preview"
                            className="data-[state=active]:bg-background text-xs px-3 h-7"
                        >
                            Preview
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="write" className="p-0 m-0 relative">
                    <TiptapToolbar editor={editor} onImageUpload={handleImageButtonClick} />
                    {isUploading && (
                        <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="flex items-center gap-2 bg-card p-2 rounded border shadow-lg">
                                <Loader2 className="animate-spin h-4 w-4" />
                                <span className="text-xs font-medium">Uploading image...</span>
                            </div>
                        </div>
                    )}
                    <EditorContent editor={editor} />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
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

// Helper functions for markdown conversion
function markdownToHtml(markdown: string): string {
    if (!markdown) return "";

    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
    html = html.replace(/__(.*?)__/gim, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");
    html = html.replace(/_(.*?)_/gim, "<em>$1</em>");

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>");

    // Inline code
    html = html.replace(/`(.*?)`/gim, "<code>$1</code>");

    // Images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" />');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

    // Unordered lists (- or *)
    html = html.replace(/^[*-] (.*$)/gim, "<li>$1</li>");
    html = html.replace(/((?:<li>.*?<\/li>\s*)+)/g, "<ul>$1</ul>");

    // Ordered lists (1. 2. etc)
    html = html.replace(/^\d+\. (.*$)/gim, "<li>$1</li>");
    html = html.replace(/(?<!<ul>)((?:<li>.*?<\/li>\s*)+)(?!<\/ul>)/g, (match) => {
        if (match.includes("<ul>")) return match;
        return `<ol>${match}</ol>`;
    });

    // Paragraphs
    const blockTags = ['h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'pre', 'p', 'div', 'img'];
    const lines = html.split('\n');
    html = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return "";
        const startsWithBlock = blockTags.some(tag => trimmed.toLowerCase().startsWith(`<${tag}`));
        if (startsWithBlock) return trimmed;
        return `<p>${trimmed}</p>`;
    }).join('\n');

    return html.trim();
}

function editorToMarkdown(html: string): string {
    let markdown = html;

    // Line breaks
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');

    // Code blocks
    markdown = markdown.replace(/<pre[^>]*><code[^>]*class="language-(\w+)"[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (match, lang, code) => {
        return `\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
    });
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (match, code) => {
        return `\n\`\`\`\n${code}\n\`\`\`\n\n`;
    });

    // Blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, content) => {
        const cleanContent = content.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '\n').trim();
        return `> ${cleanContent}\n\n`;
    });

    // Headers
    markdown = markdown.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (match, content) => {
        return `# ${content.replace(/<[^>]*>/g, '').trim()}\n\n`;
    });
    markdown = markdown.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (match, content) => {
        return `## ${content.replace(/<[^>]*>/g, '').trim()}\n\n`;
    });
    markdown = markdown.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (match, content) => {
        return `### ${content.replace(/<[^>]*>/g, '').trim()}\n\n`;
    });

    // Unordered lists
    markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
        const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
        if (items) {
            return items.map((item: string) => {
                // Preserve content, then replace internal paragraph tags with newlines
                let text = item.replace(/<li[^>]*>/gi, '').replace(/<\/li>/gi, '');
                text = text.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '\n').trim();
                return `- ${text}`;
            }).join('\n') + '\n\n';
        }
        return match;
    });

    // Ordered lists
    markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
        const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
        if (items) {
            return items.map((item: string, index: number) => {
                let text = item.replace(/<li[^>]*>/gi, '').replace(/<\/li>/gi, '');
                text = text.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '\n').trim();
                return `${index + 1}. ${text}`;
            }).join('\n') + '\n\n';
        }
        return match;
    });

    // Bold
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');

    // Italic
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

    // Inline code
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

    // Images
    markdown = markdown.replace(/<img[^>]+src="([^"]*)"[^>]*>/gi, '\n![]($1)\n\n');

    // Links
    markdown = markdown.replace(/<a[^>]+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Paragraphs
    markdown = markdown.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');

    // Clean up extra newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n');

    // Remove any remaining HTML tags
    markdown = markdown.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    markdown = markdown.replace(/&lt;/g, '<');
    markdown = markdown.replace(/&gt;/g, '>');
    markdown = markdown.replace(/&amp;/g, '&');
    markdown = markdown.replace(/&quot;/g, '"');
    markdown = markdown.replace(/&#39;/g, "'");
    markdown = markdown.replace(/&nbsp;/g, ' ');

    return markdown.trim();
}


