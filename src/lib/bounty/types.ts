export type BountyStatus = "active" | "claimed" | "completed" | "expired";
export type BountyDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export interface BountyWinner {
  name: string;
  xHandle: string;
  xUrl: string;
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
