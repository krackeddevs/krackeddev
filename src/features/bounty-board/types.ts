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
    type: 'official' | 'community';
    companyName?: string;
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
    beginner: "bg-neon-primary/20 text-neon-primary border-neon-primary/50",
    intermediate: "bg-rank-gold/20 text-rank-gold border-rank-gold/50",
    advanced: "bg-rank-bronze/20 text-rank-bronze border-rank-bronze/50",
    expert: "bg-destructive/20 text-destructive border-destructive/50",
};

export const statusColors: Record<BountyStatus, string> = {
    active: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50",
    claimed: "bg-neon-purple/20 text-neon-purple border-neon-purple/50",
    completed: "bg-neon-primary/20 text-neon-primary border-neon-primary/50",
    expired: "bg-muted/20 text-muted-foreground border-muted/50",
};

export const rarityColors: Record<BountyRarity, string> = {
    normal: "bg-muted/20 text-muted-foreground border-muted/50",
    rare: "bg-rank-gold/20 text-rank-gold border-rank-gold/50 shadow-rank-gold/20 shadow-lg",
};
