"use client";

import { useState, useEffect, useCallback } from "react";

export interface DialogueLine {
  speaker?: string;
  text: string;
}

interface DialogueBoxProps {
  dialogues: DialogueLine[];
  onComplete?: () => void;
  typingSpeed?: number;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
}

export function DialogueBox({
  dialogues,
  onComplete,
  typingSpeed = 30,
  autoAdvance = false,
  autoAdvanceDelay = 2000,
}: DialogueBoxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  const currentDialogue = dialogues[currentIndex];
  const fullText = currentDialogue?.text ?? "";

  useEffect(() => {
    if (!currentDialogue) return;

    setDisplayedText("");
    setIsTyping(true);

    let charIndex = 0;
    const intervalId = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(intervalId);
      }
    }, typingSpeed);

    return () => clearInterval(intervalId);
  }, [currentIndex, fullText, typingSpeed, currentDialogue]);

  useEffect(() => {
    if (isTyping) {
      setShowCursor(true);
      return;
    }

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [isTyping]);

  useEffect(() => {
    if (!autoAdvance || isTyping) return;

    const timeoutId = setTimeout(() => {
      advanceDialogue();
    }, autoAdvanceDelay);

    return () => clearTimeout(timeoutId);
  }, [autoAdvance, autoAdvanceDelay, isTyping]);

  const advanceDialogue = useCallback(() => {
    if (isTyping) return;

    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete?.();
    }
  }, [isTyping, currentIndex, dialogues.length, onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === " " ||
        e.key === "Enter" ||
        e.key === "z" ||
        e.key === "Z"
      ) {
        e.preventDefault();
        advanceDialogue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [advanceDialogue]);

  if (!currentDialogue) return null;

  return (
    <div
      className="absolute bottom-4 left-0 right-0 z-50 flex justify-center px-4 cursor-pointer select-none"
      onClick={advanceDialogue}
    >
      <div className="relative w-full max-w-2xl">
        <div className="bg-gray-800 p-1.5 rounded-md">
          <div className="bg-white p-1 rounded-md">
            <div className="bg-white border-4 border-gray-800 rounded-md">
              {currentDialogue.speaker && (
                <div className="absolute -top-5 left-8">
                  <div className="bg-gray-800 p-0.5 rounded-md">
                    <div className="bg-white px-5 py-2 rounded-md">
                      <span
                        className="text-gray-800 text-base font-bold uppercase tracking-wider"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                      >
                        {currentDialogue.speaker}
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
                  {displayedText}

                  {isTyping && (
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
              isTyping ? "opacity-0" : "opacity-100"
            }`}
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            TAP SPACEBAR / CLICK TO CONTINUE
          </span>

          {!isTyping && (
            <span
              className={`text-white text-lg transition-opacity duration-200 ${
                showCursor ? "opacity-100" : "opacity-0"
              }`}
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {currentIndex < dialogues.length - 1 ? (
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
