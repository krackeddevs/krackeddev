"use client";

import { useState, useCallback, useRef } from "react";

export interface UseDojoDialogueOptions {
  onComplete?: () => void;
  maxMessages?: number;
}

type DialoguePhase = "idle" | "streaming" | "ready" | "complete";

export interface DojoDialogueState {
  phase: DialoguePhase;
  currentText: string;
  messageIndex: number;
  error: string | null;
}

/**
 * Hook for generating AI-powered dialogue for the dojo scene.
 * Fetches one message at a time via streaming from the dojo API.
 */
export function useDojoDialogue(options: UseDojoDialogueOptions = {}) {
  const { onComplete, maxMessages = 5 } = options;

  const [state, setState] = useState<DojoDialogueState>({
    phase: "idle",
    currentText: "",
    messageIndex: 0,
    error: null,
  });

  // Keep conversation history across fetches
  const conversationHistoryRef = useRef<Array<{ role: string; content: string }>>(
    []
  );

  const fetchNextMessage = useCallback(async () => {
    const messageIndex = conversationHistoryRef.current.filter(
      (m) => m.role === "assistant"
    ).length;

    // Check if we've reached max messages
    if (messageIndex >= maxMessages) {
      setState((prev) => ({ ...prev, phase: "complete" }));
      onComplete?.();
      return;
    }

    setState((prev) => ({
      ...prev,
      phase: "streaming",
      currentText: "",
      error: null,
    }));

    try {
      // Build the user prompt based on conversation progress
      let userPrompt: string;
      if (messageIndex === 0) {
        userPrompt =
          "I just entered The Dojo for the first time. Welcome me and briefly explain what this place is - a game to learn vibe coding from zero through levels and challenges.";
      } else {
        userPrompt = "Ask me if I'm ready to embark on this journey. Make it feel like the beginning of an adventure.";
      }

      conversationHistoryRef.current.push({ role: "user", content: userPrompt });

      const response = await fetch("/api/game/dojo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistoryRef.current }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate dialogue");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        setState((prev) => ({
          ...prev,
          currentText: fullText,
        }));
      }

      // Clean up and store in history
      const cleanedText = fullText.trim();
      conversationHistoryRef.current.push({
        role: "assistant",
        content: cleanedText,
      });

      const newMessageIndex = conversationHistoryRef.current.filter(
        (m) => m.role === "assistant"
      ).length;

      setState((prev) => ({
        ...prev,
        phase: "ready",
        currentText: cleanedText,
        messageIndex: newMessageIndex,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        phase: "idle",
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    }
  }, [maxMessages, onComplete]);

  const advance = useCallback(() => {
    const currentMessageCount = conversationHistoryRef.current.filter(
      (m) => m.role === "assistant"
    ).length;

    if (currentMessageCount >= maxMessages) {
      setState((prev) => ({ ...prev, phase: "complete" }));
      onComplete?.();
    } else {
      // Fetch the next message
      fetchNextMessage();
    }
  }, [maxMessages, onComplete, fetchNextMessage]);

  const reset = useCallback(() => {
    conversationHistoryRef.current = [];
    setState({
      phase: "idle",
      currentText: "",
      messageIndex: 0,
      error: null,
    });
  }, []);

  const isLastMessage = state.messageIndex >= maxMessages;

  return {
    phase: state.phase,
    currentText: state.currentText,
    messageIndex: state.messageIndex,
    error: state.error,
    isStreaming: state.phase === "streaming",
    isReady: state.phase === "ready",
    isComplete: state.phase === "complete",
    isLastMessage,
    hasMoreMessages: state.messageIndex < maxMessages,
    start: fetchNextMessage,
    advance,
    reset,
  };
}
