import type { Level } from "../types";
import { level0Setup } from "./level-0-setup";

// Level registry - all available levels
export const levels: Level[] = [level0Setup];

// Lookup levels by ID or slug
export const levelById: Record<string, Level> = Object.fromEntries(
  levels.map((level) => [level.id, level])
);

export const levelBySlug: Record<string, Level> = Object.fromEntries(
  levels.map((level) => [level.slug, level])
);

/**
 * Get a level by its ID
 */
export function getLevel(id: string): Level | undefined {
  return levelById[id];
}

/**
 * Get a level by its slug
 */
export function getLevelBySlug(slug: string): Level | undefined {
  return levelBySlug[slug];
}

/**
 * Get the next level after the given level ID
 */
export function getNextLevel(currentLevelId: string): Level | undefined {
  const currentLevel = levelById[currentLevelId];
  if (!currentLevel) return undefined;

  return levels.find((level) => level.order === currentLevel.order + 1);
}

/**
 * Check if a level is unlocked based on completion of previous levels
 */
export function isLevelUnlocked(
  levelId: string,
  completedLevelIds: string[]
): boolean {
  const level = levelById[levelId];
  if (!level) return false;

  // Level 0 is always unlocked
  if (level.order === 0) return true;

  // Check if all previous levels are completed
  const previousLevels = levels.filter((l) => l.order < level.order);
  return previousLevels.every((l) => completedLevelIds.includes(l.id));
}

// Re-export level 0
export { level0Setup } from "./level-0-setup";
