"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { AIDialogueBox } from "./ai-dialogue-box";
import { ChallengeTask } from "./challenge-task";
import { ChallengeProgressBar } from "./challenge-progress-bar";
import { LevelComplete } from "./level-complete";
import { useDojoDialogue } from "../hooks/use-dojo-dialogue";
import { useLevelProgress } from "../hooks/use-level-progress";
import { DOJO_WELCOME_CONFIG } from "@/lib/ai/prompts";
import { level0Setup } from "@/lib/game/dojo/levels/level-0-setup";

type SceneState = "welcome" | "dialogue" | "level" | "complete";

interface DojoSceneProps {
  onComplete?: () => void;
}

export function DojoScene({ onComplete }: DojoSceneProps) {
  const [sceneState, setSceneState] = useState<SceneState>("welcome");

  // AI dialogue hook (for intro)
  const {
    phase: dialoguePhase,
    currentText,
    error,
    isStreaming,
    isLastMessage,
    hasMoreMessages,
    start: startDialogue,
    advance: advanceDialogue,
    reset: resetDialogue,
  } = useDojoDialogue({
    onComplete: () => {
      // After dialogue intro, transition to level challenges
      setSceneState("level");
    },
    maxMessages: DOJO_WELCOME_CONFIG.messageCount,
  });

  // Level progress hook
  const {
    currentChallenge,
    currentChallengeIndex,
    totalChallenges,
    levelXpEarned,
    isLevelComplete,
    completeChallenge,
    resetLevel,
  } = useLevelProgress({ levelId: level0Setup.id });

  // Handle START button click
  const handleStart = useCallback(() => {
    setSceneState("dialogue");
    startDialogue();
  }, [startDialogue]);

  // Handle dialogue advance
  const handleAdvanceDialogue = useCallback(() => {
    advanceDialogue();
  }, [advanceDialogue]);

  // Handle challenge completion
  const handleChallengeComplete = useCallback(
    (challengeId: string, xp: number) => {
      completeChallenge(challengeId, xp);

      // Check if this was the last challenge
      if (currentChallengeIndex + 1 >= totalChallenges) {
        setSceneState("complete");
        onComplete?.();
      }
    },
    [completeChallenge, currentChallengeIndex, totalChallenges, onComplete]
  );

  // Handle level replay
  const handleReplay = useCallback(() => {
    resetLevel();
    resetDialogue();
    setSceneState("welcome");
  }, [resetLevel, resetDialogue]);

  // Welcome Screen
  if (sceneState === "welcome") {
    return (
      <div className="relative w-full h-full min-h-screen bg-black overflow-hidden flex items-center justify-center">
        <div className="relative w-full max-w-7xl aspect-video">
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
              Start New Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Level Complete Screen
  if (sceneState === "complete" || isLevelComplete) {
    return (
      <div className="relative w-full h-full min-h-screen bg-black overflow-hidden flex items-center justify-center">
        <div className="relative w-full max-w-7xl aspect-video">
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

          <LevelComplete
            levelOrder={level0Setup.order}
            levelTitle={level0Setup.title}
            xpEarned={levelXpEarned}
            onReplay={handleReplay}
            hasNextLevel={false}
          />
        </div>
      </div>
    );
  }

  // Main game scene (dialogue or level)
  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="relative w-full max-w-7xl aspect-video">
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

        {/* Progress bar - only show during level */}
        {sceneState === "level" && currentChallenge && (
          <ChallengeProgressBar
            levelOrder={level0Setup.order}
            levelTitle={level0Setup.title}
            currentIndex={currentChallengeIndex}
            totalChallenges={totalChallenges}
            xpEarned={levelXpEarned}
            totalXp={level0Setup.totalXp}
          />
        )}

        {/* Dialogue Phase - Loading state */}
        {sceneState === "dialogue" &&
          dialoguePhase === "streaming" &&
          !currentText && (
            <div className="absolute bottom-4 left-0 right-0 z-50 flex justify-center px-4">
              <div className="relative w-full max-w-4xl">
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
            <div className="bg-red-900/90 text-white p-4 rounded-md max-w-4xl">
              <p
                className="text-sm mb-2"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                Error: {error}
              </p>
              <button
                onClick={handleReplay}
                className="text-xs underline hover:no-underline"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* AI Dialogue - intro phase */}
        {sceneState === "dialogue" &&
          currentText &&
          dialoguePhase !== "complete" &&
          !error && (
            <AIDialogueBox
              text={currentText}
              speaker={DOJO_WELCOME_CONFIG.speaker}
              isStreaming={isStreaming}
              isLastMessage={isLastMessage || !hasMoreMessages}
              onAdvance={handleAdvanceDialogue}
            />
          )}

        {/* Level challenges */}
        {sceneState === "level" && currentChallenge && (
          <ChallengeTask
            challenge={currentChallenge}
            speaker={DOJO_WELCOME_CONFIG.speaker}
            onComplete={handleChallengeComplete}
          />
        )}
      </div>
    </div>
  );
}
