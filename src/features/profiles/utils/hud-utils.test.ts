import { describe, it, expect } from "vitest";
import { mapEventToSystemSpeak, calculateSystemMetrics } from "./hud-utils";
import { XPEvent, ContributionStats } from "../types";

describe("hud-utils", () => {
    describe("mapEventToSystemSpeak", () => {
        it("should format daily_login correctly", () => {
            const event: XPEvent = {
                id: "1",
                userId: "user1",
                eventType: "daily_login",
                xpAmount: 10,
                metadata: {},
                createdAt: "2024-01-01T12:00:00Z"
            };
            const result = mapEventToSystemSpeak(event);
            expect(result).toContain("NODE_AUTH_SUCCESS: +10XP");
        });

        it("should format github_contribution correctly", () => {
            const event: XPEvent = {
                id: "1",
                userId: "user1",
                eventType: "github_contribution",
                xpAmount: 50,
                metadata: {},
                createdAt: "2024-01-01T12:00:00Z"
            };
            const result = mapEventToSystemSpeak(event);
            expect(result).toContain("COMMS_SYNC: +50XP");
        });

        it("should handle unknown event types gracefully", () => {
            const event: any = {
                id: "1",
                userId: "user1",
                eventType: "unknown_type",
                xpAmount: 5,
                metadata: {},
                createdAt: "2024-01-01T12:00:00Z"
            };
            const result = mapEventToSystemSpeak(event);
            expect(result).toContain("DATA_PACKET: +5XP");
            expect(result).toContain("UNKNOWN_TYPE");
        });
    });

    describe("calculateSystemMetrics", () => {
        it("should calculate correct grade for level 60", () => {
            const profile = { level: 60, portfolio_synced_at: new Date().toISOString() };
            const metrics = calculateSystemMetrics(profile, null, null);
            expect(metrics.archiveGrade).toBe("S");
        });

        it("should calculate high uptime for high streak", () => {
            const stats: ContributionStats = { currentStreak: 10, longestStreak: 10, contributionsThisWeek: 10, lastContributionDate: null };
            const metrics = calculateSystemMetrics(null, stats, null);
            expect(metrics.nodeUptime).toBeGreaterThanOrEqual(90);
        });

        it("should handle null synced time", () => {
            const metrics = calculateSystemMetrics({}, null, null);
            expect(metrics.signalStability).toBeGreaterThan(0);
        });
    });
});
