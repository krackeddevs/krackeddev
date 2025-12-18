import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BountyCard } from "./bounty-card";
import type { Bounty } from "../types";

// Mock bounty data for tests
const mockActiveBounty: Bounty = {
    id: "1",
    slug: "test-bounty",
    title: "Test Bounty Title",
    description: "This is a test bounty description",
    longDescription: "Long description here",
    reward: 150,
    difficulty: "intermediate",
    status: "active",
    tags: ["react", "typescript", "nextjs"],
    requirements: ["Requirement 1", "Requirement 2"],
    repositoryUrl: "https://github.com/test/repo",
    bountyPostUrl: "https://x.com/test",
    createdAt: "2025-01-01T00:00:00Z",
    deadline: "2025-12-31T23:59:59Z",
    submissions: [],
};

const mockRareBounty: Bounty = {
    ...mockActiveBounty,
    id: "2",
    slug: "rare-bounty",
    title: "Rare Bounty",
    rarity: "rare",
    reward: 500,
};

const mockCompletedBounty: Bounty = {
    ...mockActiveBounty,
    id: "3",
    slug: "completed-bounty",
    title: "Completed Bounty",
    status: "completed",
    winner: {
        name: "Test Winner",
        xHandle: "testwinner",
        xUrl: "https://x.com/testwinner",
    },
};

describe("BountyCard", () => {
    it("renders bounty title and reward", () => {
        render(<BountyCard bounty={mockActiveBounty} />);

        expect(screen.getByTestId("bounty-title")).toBeDefined();
        expect(screen.getByTestId("bounty-title").textContent).toContain("Test Bounty Title");
        expect(screen.getByTestId("reward-badge")).toBeDefined();
        expect(screen.getByTestId("reward-badge").textContent).toContain("RM150");
    });

    it("renders difficulty badge", () => {
        render(<BountyCard bounty={mockActiveBounty} />);

        expect(screen.getByTestId("difficulty-badge")).toBeDefined();
        expect(screen.getByTestId("difficulty-badge").textContent).toContain("INTERMEDIATE");
    });

    it("renders status badge", () => {
        render(<BountyCard bounty={mockActiveBounty} />);

        expect(screen.getByTestId("status-badge")).toBeDefined();
        expect(screen.getByTestId("status-badge").textContent).toContain("ACTIVE");
    });

    it("displays rarity badge for rare bounties", () => {
        render(<BountyCard bounty={mockRareBounty} />);

        expect(screen.getByTestId("rarity-badge")).toBeDefined();
        expect(screen.getByTestId("rarity-badge").textContent).toContain("RARE");
    });

    it("does not display rarity badge for normal bounties", () => {
        render(<BountyCard bounty={mockActiveBounty} />);

        expect(screen.queryByTestId("rarity-badge")).toBeNull();
    });

    it("displays winner section for completed bounties", () => {
        render(<BountyCard bounty={mockCompletedBounty} />);

        expect(screen.getByTestId("winner-badge")).toBeDefined();
        expect(screen.getByTestId("winner-badge").textContent).toContain("Winner");
        expect(screen.getByTestId("winner-badge").textContent).toContain("@testwinner");
    });

    it("does not display winner section for active bounties", () => {
        render(<BountyCard bounty={mockActiveBounty} />);

        expect(screen.queryByTestId("winner-badge")).toBeNull();
    });

    it("renders tags (max 3 visible)", () => {
        render(<BountyCard bounty={mockActiveBounty} />);

        const tagsContainer = screen.getByTestId("tags-container");
        expect(tagsContainer).toBeDefined();
        expect(tagsContainer.textContent).toContain("react");
        expect(tagsContainer.textContent).toContain("typescript");
        expect(tagsContainer.textContent).toContain("nextjs");
    });

    it("renders deadline", () => {
        render(<BountyCard bounty={mockActiveBounty} />);

        expect(screen.getByTestId("deadline")).toBeDefined();
    });

    it("links to correct bounty detail page", () => {
        render(<BountyCard bounty={mockActiveBounty} />);

        const link = screen.getByRole("link");
        expect(link.getAttribute("href")).toBe("/code/bounty/test-bounty");
    });
});
