import { describe, it, expect } from "vitest";
import { validateGitHubPrUrl, GITHUB_PR_URL_REGEX } from "./validators";

describe("GitHub PR URL Validation", () => {
    describe("GITHUB_PR_URL_REGEX", () => {
        it("matches valid GitHub PR URL", () => {
            expect(GITHUB_PR_URL_REGEX.test("https://github.com/owner/repo/pull/123")).toBe(true);
        });

        it("matches PR URL with dashes in owner/repo names", () => {
            expect(GITHUB_PR_URL_REGEX.test("https://github.com/my-org/my-repo/pull/1")).toBe(true);
        });

        it("matches PR URL with dots in repo name", () => {
            expect(GITHUB_PR_URL_REGEX.test("https://github.com/owner/my.repo/pull/42")).toBe(true);
        });

        it("matches PR URL with underscores", () => {
            expect(GITHUB_PR_URL_REGEX.test("https://github.com/user_name/repo_name/pull/999")).toBe(true);
        });

        it("rejects non-GitHub URLs", () => {
            expect(GITHUB_PR_URL_REGEX.test("https://gitlab.com/owner/repo/pull/1")).toBe(false);
        });

        it("rejects issues URL (not PR)", () => {
            expect(GITHUB_PR_URL_REGEX.test("https://github.com/owner/repo/issues/1")).toBe(false);
        });

        it("rejects commit URL", () => {
            expect(GITHUB_PR_URL_REGEX.test("https://github.com/owner/repo/commit/abc123")).toBe(false);
        });

        it("rejects plain GitHub URL", () => {
            expect(GITHUB_PR_URL_REGEX.test("https://github.com/owner/repo")).toBe(false);
        });

        it("rejects PR URL without number", () => {
            expect(GITHUB_PR_URL_REGEX.test("https://github.com/owner/repo/pull/")).toBe(false);
        });
    });

    describe("validateGitHubPrUrl", () => {
        it("returns valid for correct PR URL", () => {
            const result = validateGitHubPrUrl("https://github.com/owner/repo/pull/123");
            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it("returns error for empty string", () => {
            const result = validateGitHubPrUrl("");
            expect(result.valid).toBe(false);
            expect(result.error).toBe("Pull request URL is required");
        });

        it("returns error for whitespace only", () => {
            const result = validateGitHubPrUrl("   ");
            expect(result.valid).toBe(false);
            expect(result.error).toBe("Pull request URL is required");
        });

        it("returns error for invalid URL format", () => {
            const result = validateGitHubPrUrl("not-a-url");
            expect(result.valid).toBe(false);
            expect(result.error).toContain("valid GitHub pull request URL");
        });

        it("returns error for non-PR GitHub URL", () => {
            const result = validateGitHubPrUrl("https://github.com/owner/repo/issues/1");
            expect(result.valid).toBe(false);
            expect(result.error).toContain("valid GitHub pull request URL");
        });

        it("trims whitespace and validates", () => {
            const result = validateGitHubPrUrl("  https://github.com/owner/repo/pull/123  ");
            expect(result.valid).toBe(true);
        });
    });
});
