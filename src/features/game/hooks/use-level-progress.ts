"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  GameProgress,
  LevelProgress,
  Challenge,
} from "@/lib/game/dojo/types";
import { getLevel } from "@/lib/game/dojo/levels";

const STORAGE_KEY = "krackeddev-game-progress";

const DEFAULT_PROGRESS: GameProgress = {
  currentLevelId: "level-0",
  levels: {},
  totalXp: 0,
  lastActivityAt: new Date().toISOString(),
};

/**
 * Create a new level progress object
 */
function createLevelProgress(levelId: string): LevelProgress {
  return {
    levelId,
    completedChallenges: [],
    currentChallengeIndex: 0,
    completed: false,
  };
}

/**
 * Load progress from localStorage
 */
function loadProgress(): GameProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PROGRESS;
    return JSON.parse(stored) as GameProgress;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

/**
 * Save progress to localStorage
 */
function saveProgress(progress: GameProgress): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save game progress:", error);
  }
}

export interface UseLevelProgressOptions {
  levelId: string;
}

export interface UseLevelProgressReturn {
  // Current state
  progress: GameProgress;
  levelProgress: LevelProgress;
  currentChallenge: Challenge | null;
  currentChallengeIndex: number;
  totalChallenges: number;
  levelXpEarned: number;
  isLevelComplete: boolean;

  // Actions
  completeChallenge: (challengeId: string, xp: number) => void;
  resetLevel: () => void;
  resetAllProgress: () => void;
}

/**
 * Hook for managing level progress with localStorage persistence
 */
export function useLevelProgress({
  levelId,
}: UseLevelProgressOptions): UseLevelProgressReturn {
  const [progress, setProgress] = useState<GameProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const loaded = loadProgress();
    setProgress(loaded);
    setIsLoaded(true);
  }, []);

  // Save progress whenever it changes (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveProgress(progress);
    }
  }, [progress, isLoaded]);

  // Get or create level progress
  const levelProgress: LevelProgress =
    progress.levels[levelId] || createLevelProgress(levelId);

  // Get level data
  const level = getLevel(levelId);
  const challenges = level?.challenges || [];
  const totalChallenges = challenges.length;

  // Get current challenge
  const currentChallengeIndex = levelProgress.currentChallengeIndex;
  const currentChallenge = challenges[currentChallengeIndex] || null;

  // Calculate XP earned in this level
  const levelXpEarned = levelProgress.completedChallenges.reduce(
    (total, challengeId) => {
      const challenge = challenges.find((c) => c.id === challengeId);
      return total + (challenge?.xpReward || 0);
    },
    0
  );

  // Complete a challenge
  const completeChallenge = useCallback(
    (challengeId: string, xp: number) => {
      setProgress((prev) => {
        const currentLevelProgress =
          prev.levels[levelId] || createLevelProgress(levelId);

        // Don't duplicate completions
        if (currentLevelProgress.completedChallenges.includes(challengeId)) {
          return prev;
        }

        const newCompletedChallenges = [
          ...currentLevelProgress.completedChallenges,
          challengeId,
        ];
        const newChallengeIndex =
          currentLevelProgress.currentChallengeIndex + 1;
        const level = getLevel(levelId);
        const isComplete = newChallengeIndex >= (level?.challenges.length || 0);

        const newLevelProgress: LevelProgress = {
          ...currentLevelProgress,
          completedChallenges: newCompletedChallenges,
          currentChallengeIndex: newChallengeIndex,
          completed: isComplete,
          completedAt: isComplete ? new Date().toISOString() : undefined,
        };

        return {
          ...prev,
          levels: {
            ...prev.levels,
            [levelId]: newLevelProgress,
          },
          totalXp: prev.totalXp + xp,
          lastActivityAt: new Date().toISOString(),
        };
      });
    },
    [levelId]
  );

  // Reset current level progress
  const resetLevel = useCallback(() => {
    setProgress((prev) => {
      const currentLevelProgress = prev.levels[levelId];
      if (!currentLevelProgress) return prev;

      // Calculate XP to remove
      const level = getLevel(levelId);
      const xpToRemove = currentLevelProgress.completedChallenges.reduce(
        (total, challengeId) => {
          const challenge = level?.challenges.find((c) => c.id === challengeId);
          return total + (challenge?.xpReward || 0);
        },
        0
      );

      return {
        ...prev,
        levels: {
          ...prev.levels,
          [levelId]: createLevelProgress(levelId),
        },
        totalXp: Math.max(0, prev.totalXp - xpToRemove),
        lastActivityAt: new Date().toISOString(),
      };
    });
  }, [levelId]);

  // Reset all progress
  const resetAllProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    progress,
    levelProgress,
    currentChallenge,
    currentChallengeIndex,
    totalChallenges,
    levelXpEarned,
    isLevelComplete: levelProgress.completed,
    completeChallenge,
    resetLevel,
    resetAllProgress,
  };
}
