export type ChallengeType = "terminal-paste" | "confirm" | "quiz";

export interface ChallengeValidation {
  pattern: RegExp;
  minVersion?: string;
  errorMessage: string;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  instruction: string; // What Botak Guy tells them to do
  command?: string; // Terminal command to run (for terminal-paste)
  helpText?: string; // Additional help/installation instructions
  helpLink?: string; // URL to documentation or download page
  helpLinkText?: string; // Text for the help link
  validation?: ChallengeValidation;
  successMessage: string; // Botak Guy's response on success
  xpReward: number;
}

export interface Level {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  challenges: Challenge[];
  totalXp: number; // Sum of all challenge XP
}

export interface LevelProgress {
  levelId: string;
  completedChallenges: string[]; // Array of challenge IDs
  currentChallengeIndex: number;
  completed: boolean;
  completedAt?: string; // ISO timestamp
}

export interface GameProgress {
  currentLevelId: string;
  levels: Record<string, LevelProgress>;
  totalXp: number;
  lastActivityAt: string;
}

// Validation result for challenge validators
export interface ValidationResult {
  valid: boolean;
  extractedValue?: string; // e.g., version number
  error?: string;
}
