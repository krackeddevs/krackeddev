"use client";

import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
    Bold,
    Italic,
    Code,
    List,
    ListOrdered,
    Link as LinkIcon,
    Heading2,
    Quote,
    Undo,
    Redo,
    Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TiptapToolbarProps {
    editor: Editor | null;
    onImageUpload: () => void;
}

export function TiptapToolbar({ editor, onImageUpload }: TiptapToolbarProps) {
    if (!editor) {
        return null;
    }

    const ToolbarButton = ({
        onClick,
        isActive = false,
        disabled = false,
        children,
        title,
    }: {
        onClick: () => void;
        isActive?: boolean;
        disabled?: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
                "h-7 w-7 text-muted-foreground hover:text-foreground",
                isActive && "bg-muted text-foreground"
            )}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {children}
        </Button>
    );

    return (
        <div className="flex items-center gap-1 py-1 px-2 bg-muted/30 border-b flex-wrap">
            {/* Text Formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                title="Bold (⌘B)"
            >
                <Bold className="w-3 h-3" />
            </ToolbarButton>

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                title="Italic (⌘I)"
            >
                <Italic className="w-3 h-3" />
            </ToolbarButton>

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive("code")}
                title="Inline Code (⌘E)"
            >
                <Code className="w-3 h-3" />
            </ToolbarButton>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Headings */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive("heading", { level: 2 })}
                title="Heading"
            >
                <Heading2 className="w-3 h-3" />
            </ToolbarButton>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Lists */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                title="Bullet List"
            >
                <List className="w-3 h-3" />
            </ToolbarButton>

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                title="Numbered List"
            >
                <ListOrdered className="w-3 h-3" />
            </ToolbarButton>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Quote & Code Block */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                title="Quote"
            >
                <Quote className="w-3 h-3" />
            </ToolbarButton>

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive("codeBlock")}
                title="Code Block"
            >
                <Code className="w-3 h-3" />
            </ToolbarButton>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Image Upload */}
            <ToolbarButton onClick={onImageUpload} title="Upload Image">
                <ImageIcon className="w-3 h-3" />
            </ToolbarButton>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Undo/Redo */}
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo (⌘Z)"
            >
                <Undo className="w-3 h-3" />
            </ToolbarButton>

            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo (⌘⇧Z)"
            >
                <Redo className="w-3 h-3" />
            </ToolbarButton>
        </div>
    );
}
