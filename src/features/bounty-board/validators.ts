// Submission URL validation utilities
// Separate from server actions since these are sync functions/constants

// HTTPS URL validation regex - accepts any valid https URL
// Matches: https://domain.com, https://sub.domain.com/path, etc.
export const SUBMISSION_URL_REGEX = /^https:\/\/[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)+(\/.*)?\/?$/;

// Legacy export for backward compatibility (if any tests depend on it)
export const GITHUB_PR_URL_REGEX = SUBMISSION_URL_REGEX;

/**
 * Validate a submission URL format
 * Accepts any valid HTTPS URL (GitHub PRs, Vercel deployments, portfolios, etc.)
 */
export function validateSubmissionUrl(url: string): { valid: boolean; error?: string } {
    if (!url || url.trim() === "") {
        return { valid: false, error: "Submission URL is required" };
    }

    const trimmedUrl = url.trim();

    // Check for https protocol
    if (!trimmedUrl.startsWith("https://")) {
        return {
            valid: false,
            error: "URL must use HTTPS (e.g., https://your-demo.vercel.app)"
        };
    }

    if (!SUBMISSION_URL_REGEX.test(trimmedUrl)) {
        return {
            valid: false,
            error: "Please enter a valid URL (e.g., https://your-demo.vercel.app or https://github.com/owner/repo/pull/123)"
        };
    }

    return { valid: true };
}

// Legacy export for backward compatibility
export const validateGitHubPrUrl = validateSubmissionUrl;
