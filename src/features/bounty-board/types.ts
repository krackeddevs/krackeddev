// Bounty Board Feature Types
// Migrated from src/lib/bounty/types.ts for Feature-Sliced Design

export type BountyStatus = "active" | "claimed" | "completed" | "expired";
export type BountyDifficulty = "beginner" | "intermediate" | "advanced" | "expert";
export type BountyRarity = "normal" | "rare";

export interface BountyWinner {
    name: string;
    username?: string;  // Profile username for linking
    xHandle?: string;
    xUrl?: string;
    submissionUrl?: string;
}

export interface Bounty {
    id: string;
    slug: string;
    title: string;
    description: string;
    longDescription: string;
    reward: number; // in RM
    difficulty: BountyDifficulty;
    status: BountyStatus;
    rarity?: BountyRarity; // Optional for backwards compatibility
    tags: string[];
    requirements: string[];
    repositoryUrl: string;
    bountyPostUrl: string; // X post URL for the bounty announcement
    submissionPostUrl?: string; // X post URL for submission/winner announcement
    createdAt: string;
    deadline: string;
    winner?: BountyWinner;
    completedAt?: string;
    submissions: BountySubmission[];
}

export interface BountySubmission {
    id: string;
    bountyId: string;
    pullRequestUrl: string;
    submittedBy: string;
    submittedAt: string;
    status: "pending" | "approved" | "rejected";
    notes?: string;
}

// Filter types for bounty list
export interface BountyFilters {
    search: string;
    status: BountyStatus | "all";
    difficulty: BountyDifficulty | "all";
    tags: string[];
}

// Bounty stats for the stats bar
export interface BountyStats {
    activeBounties: number;
    availableRewards: number;
    completedBounties: number;
    totalPaid: number;
}

// Color mappings for UI
export const difficultyColors: Record<BountyDifficulty, string> = {
    beginner: "bg-green-500/20 text-green-400 border-green-500/50",
    intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    advanced: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    expert: "bg-red-500/20 text-red-400 border-red-500/50",
};

export const statusColors: Record<BountyStatus, string> = {
    active: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
    claimed: "bg-purple-500/20 text-purple-400 border-purple-500/50",
    completed: "bg-green-500/20 text-green-400 border-green-500/50",
    expired: "bg-gray-500/20 text-gray-400 border-gray-500/50",
};

export const rarityColors: Record<BountyRarity, string> = {
    normal: "bg-gray-500/20 text-gray-400 border-gray-500/50",
    rare: "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-amber-500/20 shadow-lg",
};
