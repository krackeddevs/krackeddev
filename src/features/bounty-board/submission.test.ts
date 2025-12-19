import { describe, it, expect } from "vitest";
import { validateSubmissionUrl, validateGitHubPrUrl, SUBMISSION_URL_REGEX, GITHUB_PR_URL_REGEX } from "./validators";

describe("Submission URL Validation", () => {
    describe("SUBMISSION_URL_REGEX", () => {
        it("matches valid GitHub PR URL", () => {
            expect(SUBMISSION_URL_REGEX.test("https://github.com/owner/repo/pull/123")).toBe(true);
        });

        it("matches Vercel deployment URL", () => {
            expect(SUBMISSION_URL_REGEX.test("https://my-app.vercel.app")).toBe(true);
        });

        it("matches Vercel deployment URL with path", () => {
            expect(SUBMISSION_URL_REGEX.test("https://my-app.vercel.app/dashboard")).toBe(true);
        });

        it("matches custom domain URL", () => {
            expect(SUBMISSION_URL_REGEX.test("https://myportfolio.com/project")).toBe(true);
        });

        it("matches Netlify URL", () => {
            expect(SUBMISSION_URL_REGEX.test("https://amazing-site.netlify.app")).toBe(true);
        });

        it("matches YouTube URL", () => {
            expect(SUBMISSION_URL_REGEX.test("https://youtube.com/watch?v=abc123")).toBe(true);
        });

        it("rejects HTTP (non-HTTPS) URLs", () => {
            expect(SUBMISSION_URL_REGEX.test("http://example.com")).toBe(false);
        });

        it("rejects localhost URLs", () => {
            expect(SUBMISSION_URL_REGEX.test("https://localhost:3000")).toBe(false);
        });

        it("rejects URLs without domain extension", () => {
            expect(SUBMISSION_URL_REGEX.test("https://localhost")).toBe(false);
        });
    });

    describe("validateSubmissionUrl", () => {
        it("returns valid for GitHub PR URL", () => {
            const result = validateSubmissionUrl("https://github.com/owner/repo/pull/123");
            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it("returns valid for Vercel URL", () => {
            const result = validateSubmissionUrl("https://my-demo.vercel.app");
            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it("returns valid for custom domain", () => {
            const result = validateSubmissionUrl("https://portfolio.io/project");
            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it("returns error for empty string", () => {
            const result = validateSubmissionUrl("");
            expect(result.valid).toBe(false);
            expect(result.error).toBe("Submission URL is required");
        });

        it("returns error for whitespace only", () => {
            const result = validateSubmissionUrl("   ");
            expect(result.valid).toBe(false);
            expect(result.error).toBe("Submission URL is required");
        });

        it("returns error for non-HTTPS URL", () => {
            const result = validateSubmissionUrl("http://example.com");
            expect(result.valid).toBe(false);
            expect(result.error).toContain("HTTPS");
        });

        it("returns error for invalid URL format", () => {
            const result = validateSubmissionUrl("not-a-url");
            expect(result.valid).toBe(false);
            expect(result.error).toContain("valid URL");
        });

        it("trims whitespace and validates", () => {
            const result = validateSubmissionUrl("  https://demo.vercel.app  ");
            expect(result.valid).toBe(true);
        });
    });

    describe("Legacy exports (backward compatibility)", () => {
        it("GITHUB_PR_URL_REGEX equals SUBMISSION_URL_REGEX", () => {
            expect(GITHUB_PR_URL_REGEX).toBe(SUBMISSION_URL_REGEX);
        });

        it("validateGitHubPrUrl equals validateSubmissionUrl", () => {
            expect(validateGitHubPrUrl).toBe(validateSubmissionUrl);
        });
    });
});
