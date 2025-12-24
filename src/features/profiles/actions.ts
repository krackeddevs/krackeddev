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
    x_url: string | null;
    linkedin_url: string | null;
    website_url: string | null;
};

export async function getProfile() {
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
        .select("id, username, full_name, avatar_url, developer_role, role, stack, bio, location, x_url, linkedin_url, website_url")
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

    if (!session?.provider_token || !isGithubUser) {
        return { error: "No GitHub token found or user not connected to GitHub." };
    }

    try {
        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.provider_token}`,
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

