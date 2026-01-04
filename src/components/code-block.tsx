"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
    language: string;
    value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = async () => {
        if (!value) return;
        await navigator.clipboard.writeText(value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="group relative my-4 overflow-hidden rounded-lg bg-[#282c34] font-mono text-sm">
            <div className="flex items-center justify-between bg-[#21252b] px-4 py-2 text-xs text-gray-400">
                <span className="font-medium lowercase">{language || "text"}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={copyToClipboard}
                >
                    {isCopied ? (
                        <Check className="h-3 w-3 text-green-500" />
                    ) : (
                        <Copy className="h-3 w-3" />
                    )}
                    <span className="sr-only">Copy code</span>
                </Button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{
                    margin: 0,
                    padding: "1rem",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                    background: "transparent",
                }}
                wrapLongLines={true}
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
}
