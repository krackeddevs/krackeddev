export type BountyStatus = "active" | "claimed" | "completed" | "expired";
export type BountyDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export interface Bounty {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  reward: number; // in Malaysian Ringgit (RM)
  difficulty: BountyDifficulty;
  status: BountyStatus;
  tags: string[];
  requirements: string[];
  repositoryUrl: string;
  issueUrl?: string;
  createdAt: string;
  deadline?: string;
  claimedBy?: string;
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
