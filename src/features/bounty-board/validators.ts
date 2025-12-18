// GitHub PR URL validation utilities
// Separate from server actions since these are sync functions/constants

// GitHub PR URL validation regex - exported for testing
export const GITHUB_PR_URL_REGEX = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/pull\/\d+$/;

/**
 * Validate a GitHub PR URL format
 */
export function validateGitHubPrUrl(url: string): { valid: boolean; error?: string } {
    if (!url || url.trim() === "") {
        return { valid: false, error: "Pull request URL is required" };
    }

    if (!GITHUB_PR_URL_REGEX.test(url.trim())) {
        return {
            valid: false,
            error: "Please enter a valid GitHub pull request URL (e.g., https://github.com/owner/repo/pull/123)"
        };
    }

    return { valid: true };
}
