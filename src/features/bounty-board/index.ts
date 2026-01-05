// Bounty Board Feature - Public API
// This barrel file exports all public components, actions, and types

// Types
export type {
    Bounty,
    BountyStatus,
    BountyDifficulty,
    BountyRarity,
    BountyWinner,
    BountySubmission,
    BountyFilters,
    BountyStats,
} from "./types";

export { difficultyColors, statusColors, rarityColors } from "./types";

// Server Actions
export {
    fetchActiveBounties,
    fetchBountyBySlug,
    fetchBountySubmissions,
    fetchBountyStats,
    fetchUniqueTags,
    submitBountySolution,
    // Admin verification actions
    fetchAllSubmissions,
    reviewSubmission,
    markSubmissionPaid,
} from "./actions";

// Types
export type { AdminSubmission } from "./actions";

// Validators (sync functions - separate from server actions)
export { validateGitHubPrUrl, GITHUB_PR_URL_REGEX } from "./validators";

// List Page Components
export { BountyCard } from "./components/bounty-card";
export { BountyFilters as BountyFiltersPanel } from "./components/bounty-filters";
export * from "./components/bounty-stats-bar";
export * from "./components/bounty-list";
export * from "./components/poll-widget";
export { PollWidgetSkeleton } from "./components/poll-widget-skeleton";

// Detail Page Components
export { BountyDetail } from "./components/bounty-detail";
export { SubmissionCard } from "./components/submission-card";
export { WinnerDisplay } from "./components/winner-display";
