import { ContributionStats, GithubContributionCalendar } from "../types";

export function calculateContributionStats(calendar: GithubContributionCalendar | null): ContributionStats | null {
    if (!calendar || !calendar.weeks || calendar.weeks.length === 0) {
        return null;
    }

    // Flatten all days into a single array and sort descending by date
    const allDays = calendar.weeks
        .flatMap((week) => week.contributionDays)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (allDays.length === 0) {
        return null;
    }

    // --- Calculate Current Streak ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayString = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    const hasContributionToday = allDays.some(d => d.date === todayString && d.contributionCount > 0);
    const hasContributionYesterday = allDays.some(d => d.date === yesterdayString && d.contributionCount > 0);

    let currentStreak = 0;

    if (!hasContributionToday && !hasContributionYesterday) {
        currentStreak = 0;
    } else {
        let checkDate = new Date(today);
        if (!hasContributionToday) {
            checkDate = new Date(yesterday);
        }

        while (true) {
            const checkDateString = checkDate.toISOString().split('T')[0];
            const dayData = allDays.find(d => d.date === checkDateString);

            if (dayData && dayData.contributionCount > 0) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
    }

    // --- Calculate Longest Streak ---
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < allDays.length; i++) {
        const day = allDays[i];

        if (day.contributionCount > 0) {
            if (tempStreak === 0) {
                tempStreak = 1;
            } else {
                const prevDayDate = new Date(allDays[i - 1].date);
                const currentDayDate = new Date(day.date);
                const diffTime = Math.abs(prevDayDate.getTime() - currentDayDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    tempStreak++;
                } else {
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
            }
        } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 0;
        }
    }
    longestStreak = Math.max(longestStreak, tempStreak);


    // --- Calculate Contributions This Week ---
    const getMonday = (d: Date) => {
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const m = new Date(d);
        m.setDate(diff);
        m.setHours(0, 0, 0, 0);
        return m;
    };

    const currentWeekStart = getMonday(new Date());

    const contributionsThisWeek = allDays
        .filter(day => new Date(day.date) >= currentWeekStart)
        .reduce((sum, day) => sum + day.contributionCount, 0);

    // --- Last Contribution Date ---
    const lastContribution = allDays.find(d => d.contributionCount > 0);
    const lastContributionDate = lastContribution ? lastContribution.date : null;

    return {
        currentStreak,
        longestStreak,
        contributionsThisWeek,
        lastContributionDate,
    };
}
