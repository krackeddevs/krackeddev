"use client";

import { useState, useEffect, useCallback } from "react";

interface AIDialogueBoxProps {
  text: string;
  speaker?: string;
  isStreaming?: boolean;
  isLastMessage?: boolean;
  onAdvance?: () => void;
}

/**
 * AI-powered dialogue box that supports streaming text.
 * When streaming, it displays text as it arrives.
 * When not streaming (ready state), it shows full text immediately (already typed via streaming).
 */
export function AIDialogueBox({
  text,
  speaker = "Botak Guy",
  isStreaming = false,
  isLastMessage = false,
  onAdvance,
}: AIDialogueBoxProps) {
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blink effect when not streaming
  useEffect(() => {
    if (isStreaming) {
      setShowCursor(true);
      return;
    }

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [isStreaming]);

  const handleAdvance = useCallback(() => {
    // Only allow advance when not streaming
    if (isStreaming) return;
    onAdvance?.();
  }, [isStreaming, onAdvance]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === " " ||
        e.key === "Enter" ||
        e.key === "z" ||
        e.key === "Z"
      ) {
        e.preventDefault();
        handleAdvance();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAdvance]);

  const canAdvance = !isStreaming;

  return (
    <div
      className="absolute bottom-4 left-0 right-0 z-50 flex justify-center px-4 cursor-pointer select-none"
      onClick={handleAdvance}
    >
      <div className="relative w-full max-w-2xl">
        <div className="bg-gray-800 p-1.5 rounded-md">
          <div className="bg-white p-1 rounded-md">
            <div className="bg-white border-4 border-gray-800 rounded-md">
              {speaker && (
                <div className="absolute -top-5 left-8">
                  <div className="bg-gray-800 p-0.5 rounded-md">
                    <div className="bg-white px-5 py-2 rounded-md">
                      <span
                        className="text-gray-800 text-base font-bold uppercase tracking-wider"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                      >
                        {speaker}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="px-6 py-6 min-h-28 flex items-start">
                <p
                  className="text-gray-800 text-base leading-relaxed tracking-wide whitespace-pre-wrap"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  {text}

                  {isStreaming && (
                    <span className="inline-block w-3 h-5 bg-gray-800 ml-1 animate-pulse" />
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-2">
          <span
            className={`text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-opacity duration-300 ${
              canAdvance ? "opacity-100" : "opacity-0"
            }`}
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            TAP SPACEBAR / CLICK TO CONTINUE
          </span>

          {canAdvance && (
            <span
              className={`text-white text-lg transition-opacity duration-200 ${
                showCursor ? "opacity-100" : "opacity-0"
              }`}
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {!isLastMessage ? (
                <span className="inline-block animate-bounce">&#9660;</span>
              ) : (
                <span className="inline-block">&#9632;</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
