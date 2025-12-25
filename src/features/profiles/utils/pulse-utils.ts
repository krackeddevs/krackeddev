
import { GithubContributionCalendar } from "../types";
import { DevPulseData, DevPulseDataPoint } from "../types";

/**
 * Aggregates GithubContributionCalendar data into DevPulseData for visualization.
 * Weekly: Last 7 days
 * Monthly: Last 30 days
 * Yearly: Last 52 weeks (approx 1 year)
 */
export function processDevPulseData(calendar: GithubContributionCalendar | null): DevPulseData {
    if (!calendar || !calendar.weeks) {
        // Return empty data structure with 0 counts
        return {
            weekly: Array(7).fill({ label: "", count: 0 }),
            monthly: Array(30).fill({ label: "", count: 0 }),
            yearly: Array(52).fill({ label: "", count: 0 })
        };
    }

    const weekly: DevPulseDataPoint[] = [];
    const monthly: DevPulseDataPoint[] = [];
    const yearly: DevPulseDataPoint[] = [];

    // Flatten all contribution days into a single array, reverse chronological order (newest first)
    const allDays = calendar.weeks
        .flatMap(week => week.contributionDays)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 1. Weekly: Last 7 days
    for (let i = 0; i < 7; i++) {
        const day = allDays[i];
        if (day) {
            // Abbreviated day name (e.g., "Mon")
            const date = new Date(day.date);
            const label = date.toLocaleDateString('en-US', { weekday: 'short' });
            weekly.unshift({ // Add to front to make chronological (oldest -> newest)
                label,
                count: day.contributionCount,
                date: day.date
            });
        } else {
            weekly.unshift({ label: "", count: 0 });
        }
    }

    // 2. Monthly: Last 30 days
    for (let i = 0; i < 30; i++) {
        const day = allDays[i];
        if (day) {
            const date = new Date(day.date);
            // Numeric day for month view (e.g., "15")
            const label = date.toLocaleDateString('en-US', { day: 'numeric' });
            monthly.unshift({
                label,
                count: day.contributionCount,
                date: day.date
            });
        } else {
            monthly.unshift({ label: "", count: 0 });
        }
    }

    // 3. Yearly: Last 52 weeks
    // We need to aggregate by week. The `weeks` array in calendar is already weekly data.
    // It usually comes in chronological order (oldest -> newest).
    const weeksReversed = [...calendar.weeks].reverse();

    for (let i = 0; i < 52; i++) {
        const week = weeksReversed[i];
        if (week) {
            // Sum contributions for the week
            const weekTotal = week.contributionDays.reduce((sum, day) => sum + day.contributionCount, 0);
            // Use start date of the week as label
            const startDate = new Date(week.contributionDays[0]?.date || "");
            // Format: "Jan 1"
            const label = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            yearly.unshift({
                label,
                count: weekTotal,
                date: week.contributionDays[0]?.date
            });
        } else {
            yearly.unshift({ label: "", count: 0 });
        }
    }

    return { weekly, monthly, yearly };
}
