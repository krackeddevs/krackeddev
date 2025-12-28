"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileData = {
    id: string;
    role: string;
    developer_role: string | null;
    stack: string[];
    bio: string | null;
    location: string | null;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    x_url: string | null;
    linkedin_url: string | null;
    website_url: string | null;
    contribution_stats?: unknown; // JSONB column
    level?: number;
    xp?: number;
};

export async function getProfile(): Promise<{ data?: ProfileData; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {
        return { error: error.message };
    }

    return { data };
}

/**
 * Fetch a user's public profile by username (FR6)
 * Returns only public-safe fields
 */
export async function fetchPublicProfile(username: string): Promise<{ data?: ProfileData & { avatar_url?: string }; error?: string }> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, developer_role, role, stack, bio, location, x_url, linkedin_url, website_url, level, xp")
        .eq("username", username)
        .eq("status", "active")  // Only show active users
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            return { error: "User not found" };
        }
        return { error: error.message };
    }

    return { data: data as ProfileData & { avatar_url?: string } };
}

export async function updateProfile(data: Partial<ProfileData>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const { error } = await (supabase.from("profiles") as any)
        .update({
            developer_role: data.role as any,
            stack: data.stack,
            bio: data.bio,
            location: data.location,
            username: data.username,
            full_name: data.full_name,
            x_url: data.x_url,
            linkedin_url: data.linkedin_url,
            website_url: data.website_url,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (error) {
        // Handle unique constraint violation for username
        if (error.code === "23505" && error.message.includes("unique_username")) {
            return { error: "Username already taken. Please choose another." };
        }
        return { error: error.message };
    }

    revalidatePath("/profile/view");
    revalidatePath("/profile");
    return { success: true };
}
import { GithubStats, GithubLanguage } from "./types";

export async function fetchGithubStats(): Promise<{ data?: GithubStats; error?: string }> {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();

    const isGithubUser = user?.app_metadata?.provider === 'github' ||
        user?.identities?.some(id => id.provider === 'github');

    // Try to get token from session first, fallback to stored token in DB
    let accessToken = session?.provider_token;

    if (!accessToken && user?.id) {
        // Fallback: Retrieve stored GitHub token from profiles table
        const { data: profileData } = await supabase
            .from('profiles')
            .select('github_access_token')
            .eq('id', user.id)
            .single();

        accessToken = (profileData as any)?.github_access_token;
    }

    if (!accessToken || !isGithubUser) {
        return { error: "No GitHub token found or user not connected to GitHub." };
    }

    try {
        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query {
                        viewer {
                            login
                            avatarUrl
                            contributionsCollection {
                                contributionCalendar {
                                    totalContributions
                                    weeks {
                                        contributionDays {
                                            contributionCount
                                            date
                                            color
                                        }
                                    }
                                }
                            }
                            repositories(first: 10, orderBy: {field: STARGAZERS, direction: DESC}, isFork: false) {
                                nodes {
                                    languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
                                        edges {
                                            size
                                            node {
                                                name
                                                color
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `,
            }),
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token invalid or expired - user may have signed in with Google but not synced GitHub
                return { error: "GitHub not connected or token expired" };
            }
            console.error("GitHub API Error Status:", response.status);
            return { error: "Failed to connect to GitHub API" };
        }

        const json = await response.json();

        if (json.errors) {
            console.error("GitHub API Errors:", json.errors);
            return { error: "Failed to fetch GitHub stats" };
        }

        if (!json.data || !json.data.viewer) {
            console.error("GitHub API: No viewer data returned", json);
            return { error: "No GitHub data available" };
        }

        const data = json.data.viewer;

        // Process Languages
        const languageMap = new Map<string, { size: number; color: string }>();
        let totalSize = 0;

        data.repositories.nodes.forEach((repo: any) => {
            repo.languages.edges.forEach((edge: any) => {
                const { size, node } = edge;
                const { name, color } = node;

                if (languageMap.has(name)) {
                    const current = languageMap.get(name)!;
                    languageMap.set(name, { ...current, size: current.size + size });
                } else {
                    languageMap.set(name, { size, color });
                }
                totalSize += size;
            });
        });

        const topLanguages: GithubLanguage[] = Array.from(languageMap.entries())
            .map(([name, { size, color }]) => ({
                name,
                color,
                percentage: size / totalSize,
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5); // Top 5

        return {
            data: {
                username: data.login,
                avatarUrl: data.avatarUrl,
                totalContributions: data.contributionsCollection.contributionCalendar.totalContributions,
                contributionCalendar: data.contributionsCollection.contributionCalendar.weeks,
                topLanguages,
            },
        };

    } catch (error) {
        console.error("Error fetching GitHub stats:", error);
        return { error: "Failed to connect to GitHub" };
    }
}

import { BountyStats, UserSubmission } from "./types";

export async function fetchBountyStats(userId?: string): Promise<{ data?: BountyStats; error?: string }> {
    const supabase = await createClient();

    // If no userId provided, use current user
    let targetUserId = userId;
    if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: "Not authenticated" };
        targetUserId = user.id;
    }

    const { data, error } = await supabase
        .from("bounty_submissions")
        .select("bounty_reward")
        .eq("user_id", targetUserId)
        .eq("status", "approved");

    if (error) {
        console.error("Error fetching bounty stats:", error);
        return { error: "Failed to fetch bounty stats" };
    }

    const totalWins = (data || []).length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalEarnings = (data || []).reduce((acc: number, curr: any) => acc + (curr.bounty_reward || 0), 0);

    return {
        data: {
            totalWins,
            totalEarnings,
        },
    };
}

export type TopHunter = {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    developer_role: string | null;
    location: string | null;
    totalWins: number;
    totalEarnings: number;
};

export type Member = {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    developer_role: string | null;
    location: string | null;
    created_at: string;
};

/**
 * Fetch all active members for the members page (FR6)
 */
export async function fetchAllMembers(limit: number = 50): Promise<{ data: Member[]; error?: string }> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, developer_role, location, created_at, status")
        .eq("status", "active")
        .eq("onboarding_completed", true)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching members:", error);
        return { data: [], error: "Failed to fetch members" };
    }

    return { data: (data || []) as Member[] };
}

/**
 * Fetch top bounty hunters for leaderboard (FR6)
 */
export async function fetchTopHunters(limit: number = 20): Promise<{ data: TopHunter[]; error?: string }> {
    const supabase = await createClient();

    // Step 1: Get approved submissions
    const { data: submissions, error: subError } = await supabase
        .from("bounty_submissions")
        .select("user_id, bounty_reward")
        .eq("status", "approved");

    if (subError) {
        console.error("Error fetching submissions:", subError);
        return { data: [], error: "Failed to fetch leaderboard" };
    }

    if (!submissions || submissions.length === 0) {
        return { data: [] };
    }

    // Step 2: Aggregate by user
    const userStatsMap = new Map<string, { wins: number; earnings: number }>();
    for (const sub of submissions as any[]) {
        const existing = userStatsMap.get(sub.user_id) || { wins: 0, earnings: 0 };
        existing.wins += 1;
        existing.earnings += sub.bounty_reward || 0;
        userStatsMap.set(sub.user_id, existing);
    }

    const userIds = Array.from(userStatsMap.keys());

    // Step 3: Fetch profiles for these users
    const { data: profiles, error: profError } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, developer_role, location, status")
        .in("id", userIds)
        .neq("status", "banned");

    if (profError) {
        console.error("Error fetching profiles:", profError);
        return { data: [], error: "Failed to fetch user profiles" };
    }

    // Step 4: Combine data
    const hunters: TopHunter[] = (profiles || []).map((profile: any) => {
        const stats = userStatsMap.get(profile.id) || { wins: 0, earnings: 0 };
        return {
            id: profile.id,
            username: profile.username,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            developer_role: profile.developer_role,
            location: profile.location,
            totalWins: stats.wins,
            totalEarnings: stats.earnings,
        };
    });

    // Sort by total wins, then earnings
    hunters.sort((a, b) => b.totalWins - a.totalWins || b.totalEarnings - a.totalEarnings);

    return { data: hunters.slice(0, limit) };
}

export async function fetchUserSubmissions(): Promise<{ data: UserSubmission[]; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { data: [], error: "Not authenticated" };
    }

    const { data, error } = await supabase
        .from("bounty_submissions")
        .select("id, bounty_slug, bounty_title, bounty_reward, status, created_at, paid_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching user submissions:", error);
        return { data: [], error: "Failed to fetch submissions" };
    }

    const submissions: UserSubmission[] = (data || []).map((row: any) => ({
        id: row.id,
        bountySlug: row.bounty_slug,
        bountyTitle: row.bounty_title,
        bountyReward: row.bounty_reward,
        status: row.status as "pending" | "approved" | "rejected",
        createdAt: row.created_at,
        paidAt: row.paid_at,
    }));

    return { data: submissions };
}

import { calculateContributionStats } from "./utils/contribution-utils";
import { ContributionStats, GithubContributionCalendar } from "./types";

/**
 * Fetch contribution stats for a user.
 * - If viewing own profile, fetches fresh data from GitHub and updates DB cache.
 * - If viewing others, relies on DB cache.
 */
export async function fetchContributionStats(username: string): Promise<{ data?: ContributionStats | null; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Fetch Profile from DB to get cached stats and ID
    const { data, error: profileError } = await supabase
        .from("profiles")
        .select("id, contribution_stats, portfolio_synced_at")
        .eq("username", username)
        .single();

    // Explicitly cast to avoid 'never' inference if schema types are missing
    const profile = data as { id: string; contribution_stats: any; portfolio_synced_at: string } | null;

    if (profileError || !profile) {
        return { error: "User not found" };
    }

    let statsData: GithubContributionCalendar | null = profile.contribution_stats as any;

    // Handle potential double-encoded JSON (stringified JSON in DB)
    if (typeof statsData === 'string') {
        try {
            statsData = JSON.parse(statsData);
        } catch (e) {
            console.error("Failed to parse contribution_stats:", e);
            statsData = null;
        }
    }

    // 2. If viewing own profile, try to refresh from GitHub
    if (user && user.id === profile.id) {
        // Refresh if data is missing OR it's been more than 1 hour
        const lastSync = profile.portfolio_synced_at ? new Date(profile.portfolio_synced_at) : null;
        const now = new Date();
        const shouldRefresh = !statsData || !lastSync || (now.getTime() - lastSync.getTime() > 1000 * 60 * 60); // 1 hour

        if (shouldRefresh) {
            const { data: liveData, error: liveError } = await fetchGithubStats();

            if (!liveError && liveData && liveData.contributionCalendar) {
                // Transform to the shape we want to store (GithubContributionCalendar)
                const newStats: GithubContributionCalendar = {
                    totalContributions: liveData.totalContributions,
                    weeks: liveData.contributionCalendar
                };

                // Update DB
                await (supabase.from("profiles") as any)
                    .update({
                        contribution_stats: newStats,
                        portfolio_synced_at: new Date().toISOString()
                    })
                    .eq("id", user.id);

                statsData = newStats;
            } else if (liveError) {
                console.error("Failed to sync GitHub stats:", liveError);
                // If sync failed and data is STALE (older than 24 hours), force return null
                // This triggers the "Connect GitHub" UI, prompting the user to re-authenticate which fixes invalid tokens.
                const isStale = !lastSync || (now.getTime() - lastSync.getTime() > 1000 * 60 * 60 * 24); // 24 hours
                if (isStale) {
                    return { data: null, error: "GitHub sync failed and data is stale. Please reconnect." };
                }
            }
        }
    }

    // 3. Calculate Streaks
    const contributionStats = calculateContributionStats(statsData);

    // Attach Level/XP if available (mainly for public view where we fetch them)
    if (contributionStats && profile) {
        contributionStats.level = (profile as any).level || 1;
        contributionStats.xp = (profile as any).xp || 0;
    }

    return { data: contributionStats || null };
}



export interface MiniProfileData {
    username: string | null;
    avatar_url: string | null;
    developer_role: string | null;
    bounties_won: number;
    current_streak: number;
    level: number;
    xp: number;
}

export async function fetchMiniProfileData(userId: string): Promise<MiniProfileData | null> {
    const supabase = await createClient();

    // Fetch profile and contribution stats
    const { data } = await supabase
        .from("profiles")
        .select("username, avatar_url, developer_role, contribution_stats, level, xp")
        .eq("id", userId)
        .single();

    if (!data) return null;

    // Explicit type casting to avoid inference issues with generic Supabase client
    const profile = data as {
        username: string | null;
        avatar_url: string | null;
        developer_role: string | null;
        contribution_stats: any;
        level: number;
        xp: number;
    };

    // Fetch confirmed bounty wins
    const { count: wins } = await supabase
        .from("bounty_submissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "approved");

    // Calculate current streak from cached stats
    // Cast to any to access weeks safely
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stats: any = profile.contribution_stats;
    const currentStreak = calculateContributionStats(stats)?.currentStreak || 0;

    return {
        username: profile.username,
        avatar_url: profile.avatar_url,
        developer_role: profile.developer_role,
        bounties_won: wins || 0,
        current_streak: currentStreak,
        level: profile.level || 1,
        xp: profile.xp || 0
    };
}
