"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/code-block";

interface MarkdownViewerProps {
    content: string;
    className?: string;
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
    return (
        <article className={cn("prose dark:prose-invert prose-green max-w-none break-words", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                    h1: ({ children, ...props }: any) => (
                        <h1 className="text-3xl font-bold mt-6 mb-4" {...props}>{children}</h1>
                    ),
                    h2: ({ children, ...props }: any) => (
                        <h2 className="text-2xl font-bold mt-5 mb-3" {...props}>{children}</h2>
                    ),
                    h3: ({ children, ...props }: any) => (
                        <h3 className="text-xl font-bold mt-4 mb-2" {...props}>{children}</h3>
                    ),
                    blockquote: ({ children, ...props }: any) => (
                        <blockquote className="border-l-4 border-primary/50 pl-4 italic my-4 text-muted-foreground" {...props}>
                            {children}
                        </blockquote>
                    ),
                    ul: ({ children, ...props }: any) => (
                        <ul className="list-disc pl-6 my-4 space-y-1" {...props}>{children}</ul>
                    ),
                    ol: ({ children, ...props }: any) => (
                        <ol className="list-decimal pl-6 my-4 space-y-1" {...props}>{children}</ol>
                    ),
                    li: ({ children, ...props }: any) => (
                        <li className="text-foreground/90" {...props}>{children}</li>
                    ),
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        const value = String(children).replace(/\n$/, "");

                        if (!inline && match) {
                            return (
                                <CodeBlock
                                    language={match[1]}
                                    value={value}
                                />
                            );
                        }

                        // Fallback for inline code or blocks without language
                        if (!inline) {
                            return (
                                <CodeBlock
                                    language="text"
                                    value={value}
                                />
                            );
                        }

                        return (
                            <code className={cn("bg-muted px-1.5 py-0.5 rounded text-sm font-mono", className)} {...props}>
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
