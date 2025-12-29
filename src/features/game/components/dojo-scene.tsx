"use client";

import { useState } from "react";
import Image from "next/image";
import { AIDialogueBox } from "./ai-dialogue-box";
import { useDojoDialogue } from "../hooks/use-dojo-dialogue";
import { DOJO_WELCOME_CONFIG } from "@/lib/ai/prompts";

interface DojoSceneProps {
  onComplete?: () => void;
}

export function DojoScene({ onComplete }: DojoSceneProps) {
  const [gameStarted, setGameStarted] = useState(false);

  const {
    phase,
    currentText,
    error,
    isStreaming,
    isLastMessage,
    hasMoreMessages,
    start,
    advance,
    reset,
  } = useDojoDialogue({
    onComplete,
    maxMessages: DOJO_WELCOME_CONFIG.messageCount,
  });

  const handleStart = () => {
    setGameStarted(true);
    start();
  };

  const handleAdvance = () => {
    advance();
  };

  const handleRestart = () => {
    setGameStarted(false);
    reset();
  };

  // Welcome Screen
  if (!gameStarted) {
    return (
      <div className="relative w-full h-full min-h-screen bg-black overflow-hidden flex items-center justify-center">
        <div className="relative w-full max-w-5xl aspect-video">
          <Image
            src="/map/dojo-start.png"
            alt="Dojo Welcome"
            fill
            priority
            className="object-contain"
            style={{
              imageRendering: "pixelated",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
            }}
          />

          {/* Start Button */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center">
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-gray-800 text-white text-sm border-4 border-white hover:bg-gray-700 hover:scale-105 transition-all duration-200 shadow-lg"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              START
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="relative w-full max-w-5xl aspect-video">
        <Image
          src="/map/dojo.png"
          alt="Dojo"
          fill
          priority
          className="object-contain"
          style={{
            imageRendering: "pixelated",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* Loading state - only show when streaming and no text yet */}
        {phase === "streaming" && !currentText && (
          <div className="absolute bottom-4 left-0 right-0 z-50 flex justify-center px-4">
            <div className="relative w-full max-w-2xl">
              <div className="bg-gray-800 p-1.5 rounded-md">
                <div className="bg-white p-1 rounded-md">
                  <div className="bg-white border-4 border-gray-800 rounded-md">
                    <div className="absolute -top-5 left-8">
                      <div className="bg-gray-800 p-0.5 rounded-md">
                        <div className="bg-white px-5 py-2 rounded-md">
                          <span
                            className="text-gray-800 text-base font-bold uppercase tracking-wider"
                            style={{
                              fontFamily: "'Press Start 2P', monospace",
                            }}
                          >
                            {DOJO_WELCOME_CONFIG.speaker}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-6 min-h-28 flex items-center justify-center">
                      <p
                        className="text-gray-800 text-sm animate-pulse"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                      >
                        ...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute bottom-4 left-0 right-0 z-50 flex justify-center px-4">
            <div className="bg-red-900/90 text-white p-4 rounded-md max-w-2xl">
              <p
                className="text-sm mb-2"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                Error: {error}
              </p>
              <button
                onClick={handleRestart}
                className="text-xs underline hover:no-underline"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* AI Dialogue - show when we have text (streaming or ready) */}
        {currentText && phase !== "complete" && !error && (
          <AIDialogueBox
            text={currentText}
            speaker={DOJO_WELCOME_CONFIG.speaker}
            isStreaming={isStreaming}
            isLastMessage={isLastMessage || !hasMoreMessages}
            onAdvance={handleAdvance}
          />
        )}
      </div>

      {/* Completion overlay */}
      {phase === "complete" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center p-8">
            <p
              className="text-white text-sm mb-6"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Training complete.
            </p>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-gray-800 text-white text-xs border-2 border-white hover:bg-gray-700 transition-colors"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Train Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
