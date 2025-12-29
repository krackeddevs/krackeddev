"use client";

import { useState, useEffect, useCallback } from "react";
import type { Challenge, ValidationResult } from "@/lib/game/dojo/types";
import { getValidator } from "@/lib/game/dojo/levels/level-0-setup/validators";
import { RetroContainer } from "./retro-container";

interface ChallengeTaskProps {
  challenge: Challenge;
  speaker?: string;
  onComplete: (challengeId: string, xp: number) => void;
}

type DisplayState = "instruction" | "input" | "success" | "error";

/**
 * Challenge Task component
 * Page 1: Instruction/help content
 * Page 2: Command + paste input + verification
 */
export function ChallengeTask({
  challenge,
  speaker = "Botak Guy",
  onComplete,
}: ChallengeTaskProps) {
  const [displayState, setDisplayState] = useState<DisplayState>("instruction");
  const [inputValue, setInputValue] = useState("");
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [showCursor, setShowCursor] = useState(true);
  const [xpAnimating, setXpAnimating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Handle copy command to clipboard
  const handleCopyCommand = useCallback(async () => {
    if (challenge.command) {
      try {
        await navigator.clipboard.writeText(challenge.command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  }, [challenge.command]);

  // Handle verify button click
  const handleVerify = useCallback(() => {
    const validate = getValidator(challenge.id);

    if (!validate) {
      // No validator - accept it
      setValidationResult({ valid: true });
      setDisplayState("success");
      setXpAnimating(true);
      return;
    }

    const result = validate(inputValue);
    setValidationResult(result);

    if (result.valid) {
      setDisplayState("success");
      setXpAnimating(true);
    } else {
      setDisplayState("error");
    }
  }, [challenge.id, inputValue]);

  // Handle continue after success
  const handleContinue = useCallback(() => {
    onComplete(challenge.id, challenge.xpReward);
    // Reset for next challenge
    setDisplayState("instruction");
    setInputValue("");
    setValidationResult(null);
    setXpAnimating(false);
    setCopied(false);
  }, [challenge.id, challenge.xpReward, onComplete]);

  // Handle retry after error
  const handleRetry = useCallback(() => {
    setDisplayState("input");
    setValidationResult(null);
  }, []);

  // Go back to instruction page
  const handleBack = useCallback(() => {
    setDisplayState("instruction");
  }, []);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        displayState === "instruction" &&
        (e.key === " " || e.key === "Enter")
      ) {
        e.preventDefault();
        setDisplayState("input");
      } else if (
        displayState === "success" &&
        (e.key === " " || e.key === "Enter")
      ) {
        e.preventDefault();
        handleContinue();
      } else if (
        displayState === "error" &&
        (e.key === " " || e.key === "Enter")
      ) {
        e.preventDefault();
        handleRetry();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [displayState, handleContinue, handleRetry]);

  const isSuccess = displayState === "success";
  const isError = displayState === "error";

  // ========================================
  // PAGE 1: INSTRUCTION PAGE
  // ========================================
  if (displayState === "instruction") {
    return (
      <div className="absolute inset-x-0 bottom-0 top-16 z-50 flex flex-col items-center justify-end px-4 overflow-y-auto pb-12">
        <div className="w-full max-w-4xl">
          {/* Instruction Card */}
          <RetroContainer speaker={speaker} className="mb-4">
            {/* Header */}
            <h3
              className="text-gray-800 text-base mb-4 font-bold"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {challenge.instruction}
            </h3>

            {/* Help text with proper formatting */}
            {challenge.helpText && (
              <div className="text-gray-800 text-sm font-mono whitespace-pre-wrap leading-relaxed mb-6">
                {challenge.helpText}
              </div>
            )}

            {/* Help link button */}
            {challenge.helpLink && (
              <a
                href={challenge.helpLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white text-xs border-2 border-blue-400 hover:bg-blue-500 transition-colors rounded"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {challenge.helpLinkText || "Learn More"}
              </a>
            )}
          </RetroContainer>

          {/* Hint */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <span
              className="text-white text-xs uppercase tracking-[0.2em] font-bold animate-pulse"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              PRESS SPACEBAR TO CONTINUE
            </span>
            <span
              className={`text-white text-lg transition-opacity duration-200 ${
                showCursor ? "opacity-100" : "opacity-0"
              }`}
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              <span className="inline-block animate-bounce">&#9660;</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // PAGE 2: INPUT/VERIFICATION PAGE
  // ========================================
  if (displayState === "input") {
    return (
      <div className="absolute inset-x-0 bottom-0 top-16 z-50 flex flex-col items-center justify-center px-4 overflow-y-auto pb-4">
        <div className="w-full max-w-4xl">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="mb-4 px-3 py-1 text-gray-400 text-xs hover:text-white transition-colors"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            &larr; BACK TO INSTRUCTIONS
          </button>

          <RetroContainer speaker={speaker}>
            <div className="space-y-4">
              {/* Command Display with Copy Button */}
              {challenge.command && (
                <div className="bg-gray-900 border-2 border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-gray-500 text-xs"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      RUN THIS COMMAND
                    </span>
                    <button
                      onClick={handleCopyCommand}
                      className="px-3 py-1 bg-gray-700 text-gray-300 text-xs border border-gray-600 hover:bg-gray-600 transition-colors rounded"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      {copied ? "COPIED!" : "COPY"}
                    </button>
                  </div>
                  <code className="text-green-400 text-base font-mono block select-all bg-gray-800 p-3 rounded">
                    $ {challenge.command}
                  </code>
                </div>
              )}

              {/* Paste Input Area */}
              <div className="bg-gray-900 border-2 border-gray-600 rounded-lg p-4">
                <label
                  className="text-yellow-400 text-xs block mb-3"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  PASTE YOUR OUTPUT HERE:
                </label>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Run the command above in your terminal, then paste the result here..."
                  className="w-full bg-gray-800 text-gray-100 font-mono text-sm resize-none border border-gray-700 rounded p-3 outline-none focus:border-green-500 placeholder-gray-600"
                  rows={4}
                  autoFocus
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleVerify}
                    disabled={!inputValue.trim()}
                    className="px-6 py-3 bg-green-600 text-white text-sm border-2 border-green-400 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    VERIFY
                  </button>
                </div>
              </div>
            </div>
          </RetroContainer>
        </div>
      </div>
    );
  }

  // ========================================
  // SUCCESS PAGE
  // ========================================
  if (isSuccess) {
    return (
      <div className="absolute inset-x-0 bottom-0 top-16 z-50 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl text-center">
          {/* XP Animation */}
          {xpAnimating && (
            <div
              className="animate-bounce text-yellow-400 text-2xl font-bold mb-4"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              +{challenge.xpReward} XP
            </div>
          )}

          {/* Success Message */}
          <div className="bg-green-900/90 border-2 border-green-600 rounded-lg p-6 mb-6">
            <div className="text-green-400 text-4xl mb-4">&#10003;</div>
            <p
              className="text-green-200 text-sm leading-relaxed"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {challenge.successMessage}
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="px-8 py-4 bg-green-600 text-white text-sm border-4 border-green-400 hover:bg-green-500 hover:scale-105 transition-all duration-200 rounded-lg shadow-lg"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            CONTINUE
          </button>

          {/* Hint */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <span
              className="text-gray-500 text-[10px] uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              OR PRESS SPACEBAR
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR PAGE
  // ========================================
  if (isError) {
    return (
      <div className="absolute inset-x-0 bottom-0 top-16 z-50 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl text-center">
          {/* Error Message */}
          <div className="bg-red-900/90 border-2 border-red-600 rounded-lg p-6 mb-6">
            <div className="text-red-400 text-4xl mb-4">&#10007;</div>
            <p
              className="text-red-200 text-sm leading-relaxed"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {validationResult?.error ||
                "Validation failed. Please try again."}
            </p>
          </div>

          {/* Retry Button */}
          <button
            onClick={handleRetry}
            className="px-8 py-4 bg-yellow-600 text-white text-sm border-4 border-yellow-400 hover:bg-yellow-500 hover:scale-105 transition-all duration-200 rounded-lg shadow-lg"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            TRY AGAIN
          </button>

          {/* Hint */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <span
              className="text-gray-500 text-[10px] uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              OR PRESS SPACEBAR
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
