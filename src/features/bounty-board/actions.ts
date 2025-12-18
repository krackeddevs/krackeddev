"use server";

import { createClient } from "@/lib/supabase/server";
import type { Bounty, BountyFilters, BountyStats, BountySubmission } from "./types";

// Static data import for hybrid approach (static + Supabase fallback)
// TODO: Remove this after full migration to Supabase
import { bounties as staticBounties } from "@/lib/bounty/data";

/**
 * Fetch active bounties with optional filters
 * Uses hybrid data source: static data first, Supabase fallback
 */
export async function fetchActiveBounties(
    filters?: Partial<BountyFilters>
): Promise<{ data: Bounty[]; error: string | null }> {
    try {
        // Start with static data
        let bounties: Bounty[] = [...staticBounties];

        // Try to fetch from Supabase as well
        const supabase = await createClient();
        if (supabase) {
            const { data: dbBounties, error } = await supabase
                .from("bounties")
                .select("*")
                .eq("status", "open");

            if (!error && dbBounties && dbBounties.length > 0) {
                // Map DB bounties to our type and merge with static
                const mappedDbBounties: Bounty[] = dbBounties.map((row: any) => ({
                    id: row.id,
                    slug: row.slug,
                    title: row.title,
                    description: row.description || "",
                    longDescription: row.long_description || row.description || "",
                    reward: row.reward_amount,
                    difficulty: row.difficulty || "intermediate",
                    status: row.status === "open" ? "active" : row.status,
                    rarity: row.rarity || "normal",
                    tags: row.skills || [],
                    requirements: row.requirements || [],
                    repositoryUrl: row.repository_url || "",
                    bountyPostUrl: row.bounty_post_url || "",
                    submissionPostUrl: row.submission_post_url,
                    createdAt: row.created_at,
                    deadline: row.deadline || new Date().toISOString(),
                    completedAt: row.completed_at,
                    submissions: [],
                    // Map winner data from DB columns
                    winner: row.winner_name ? {
                        name: row.winner_name,
                        xHandle: row.winner_x_handle,
                        xUrl: row.winner_x_url,
                        submissionUrl: row.winner_submission_url,
                    } : undefined,
                }));

                // Merge: DB bounties take precedence (by slug)
                const staticSlugs = new Set(bounties.map((b) => b.slug));
                for (const dbBounty of mappedDbBounties) {
                    if (!staticSlugs.has(dbBounty.slug)) {
                        bounties.push(dbBounty);
                    }
                }
            }
        }

        // Apply filters
        if (filters) {
            if (filters.search) {
                const query = filters.search.toLowerCase();
                bounties = bounties.filter(
                    (b) =>
                        b.title.toLowerCase().includes(query) ||
                        b.description.toLowerCase().includes(query) ||
                        b.tags.some((t) => t.toLowerCase().includes(query))
                );
            }

            if (filters.status && filters.status !== "all") {
                bounties = bounties.filter((b) => b.status === filters.status);
            }

            if (filters.difficulty && filters.difficulty !== "all") {
                bounties = bounties.filter((b) => b.difficulty === filters.difficulty);
            }

            if (filters.tags && filters.tags.length > 0) {
                bounties = bounties.filter((b) =>
                    filters.tags!.some((tag) => b.tags.includes(tag))
                );
            }
        }

        return { data: bounties, error: null };
    } catch (error) {
        console.error("Error fetching bounties:", error);
        return { data: [], error: "Failed to fetch bounties" };
    }
}

/**
 * Fetch a single bounty by slug
 * Uses hybrid data source: static data first, Supabase fallback
 */
export async function fetchBountyBySlug(
    slug: string
): Promise<{ data: Bounty | null; error: string | null }> {
    try {
        // First try static data
        const staticBounty = staticBounties.find((b) => b.slug === slug);
        if (staticBounty) {
            return { data: staticBounty, error: null };
        }

        // Fallback to Supabase
        const supabase = await createClient();
        if (!supabase) {
            return { data: null, error: "Bounty not found" };
        }

        const { data, error } = await supabase
            .from("bounties")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error || !data) {
            return { data: null, error: "Bounty not found" };
        }

        // Cast to any to avoid TypeScript errors when table not in generated types
        const row = data as any;

        // Map DB data to Bounty type
        const bounty: Bounty = {
            id: row.id,
            slug: row.slug,
            title: row.title,
            description: row.description || "",
            longDescription: row.long_description || row.description || "",
            reward: row.reward_amount,
            difficulty: row.difficulty || "intermediate",
            status: row.status === "open" ? "active" : row.status,
            rarity: row.rarity || "normal",
            tags: row.skills || [],
            requirements: row.requirements || [],
            repositoryUrl: row.repository_url || "",
            bountyPostUrl: row.bounty_post_url || "",
            submissionPostUrl: row.submission_post_url,
            createdAt: row.created_at,
            deadline: row.deadline || new Date().toISOString(),
            completedAt: row.completed_at,
            submissions: [],
            // Map winner data from DB columns
            winner: row.winner_name ? {
                name: row.winner_name,
                xHandle: row.winner_x_handle,
                xUrl: row.winner_x_url,
                submissionUrl: row.winner_submission_url,
            } : undefined,
        };

        return { data: bounty, error: null };
    } catch (error) {
        console.error("Error fetching bounty:", error);
        return { data: null, error: "Failed to fetch bounty" };
    }
}

/**
 * Fetch submissions for a specific bounty
 */
export async function fetchBountySubmissions(
    bountySlug: string
): Promise<{ data: BountySubmission[]; error: string | null }> {
    try {
        const supabase = await createClient();
        if (!supabase) {
            return { data: [], error: null };
        }

        const { data, error } = await supabase
            .from("bounty_submissions")
            .select(
                "id, pull_request_url, status, notes, created_at, user_id, submitter:profiles!bounty_submissions_user_id_fkey (username, full_name)"
            )
            .eq("bounty_slug", bountySlug)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Failed to load bounty submissions:", error);
            return { data: [], error: null }; // Non-fatal, return empty
        }

        const submissions: BountySubmission[] = (data ?? []).map((row: any) => {
            const submittedBy =
                row?.submitter?.username ||
                row?.submitter?.full_name ||
                (typeof row?.user_id === "string"
                    ? `${row.user_id.slice(0, 8)}…`
                    : "Unknown");

            return {
                id: row.id,
                bountyId: bountySlug,
                pullRequestUrl: row.pull_request_url,
                submittedBy,
                submittedAt: row.created_at ?? new Date().toISOString(),
                status: row.status,
                notes: row.notes ?? undefined,
            };
        });

        return { data: submissions, error: null };
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return { data: [], error: "Failed to fetch submissions" };
    }
}

/**
 * Calculate bounty stats for the stats bar
 */
export async function fetchBountyStats(): Promise<{
    data: BountyStats;
    error: string | null;
}> {
    try {
        const { data: bounties } = await fetchActiveBounties();

        const activeBounties = bounties.filter((b) => b.status === "active");
        const completedBounties = bounties.filter((b) => b.status === "completed");

        const availableRewards = activeBounties.reduce((sum, b) => sum + b.reward, 0);
        const totalPaid = completedBounties.reduce((sum, b) => sum + b.reward, 0);

        return {
            data: {
                activeBounties: activeBounties.length,
                availableRewards,
                completedBounties: completedBounties.length,
                totalPaid,
            },
            error: null,
        };
    } catch (error) {
        console.error("Error fetching stats:", error);
        return {
            data: {
                activeBounties: 0,
                availableRewards: 0,
                completedBounties: 0,
                totalPaid: 0,
            },
            error: "Failed to fetch stats",
        };
    }
}

/**
 * Get all unique tags from bounties for filter options
 */
export async function fetchUniqueTags(): Promise<{
    data: string[];
    error: string | null;
}> {
    try {
        const { data: bounties } = await fetchActiveBounties();
        const allTags = bounties.flatMap((b) => b.tags);
        const uniqueTags = [...new Set(allTags)].sort();
        return { data: uniqueTags, error: null };
    } catch (error) {
        return { data: [], error: "Failed to fetch tags" };
    }
}

// Import validators from separate file (sync functions can't be exported from "use server" file)
import { validateGitHubPrUrl } from "./validators";

/**
 * Submit a bounty solution (GitHub PR URL)
 * Enforces MVP constraint: 1 submission per user per bounty
 */
export async function submitBountySolution(
    bountySlug: string,
    bountyTitle: string,
    bountyReward: number,
    prUrl: string,
    userId: string
): Promise<{ data: BountySubmission | null; error: string | null }> {
    try {
        // Validate PR URL
        const validation = validateGitHubPrUrl(prUrl);
        if (!validation.valid) {
            return { data: null, error: validation.error || "Invalid PR URL" };
        }

        const supabase = await createClient();
        if (!supabase) {
            return { data: null, error: "Database connection unavailable" };
        }

        // Attempt to insert - unique constraint will reject duplicates
        const { data, error } = await supabase
            .from("bounty_submissions")
            .insert({
                bounty_slug: bountySlug,
                bounty_title: bountyTitle,
                bounty_reward: bountyReward,
                user_id: userId,
                pull_request_url: prUrl.trim(),
            } as any)
            .select("id, pull_request_url, status, notes, created_at, user_id")
            .single();

        if (error) {
            // Check for unique constraint violation
            if (error.code === "23505") {
                return {
                    data: null,
                    error: "You have already submitted a solution for this bounty."
                };
            }
            console.error("Error submitting solution:", error);
            return { data: null, error: error.message };
        }

        // Map to BountySubmission type
        const row = data as any;
        const submission: BountySubmission = {
            id: row.id,
            bountyId: bountySlug,
            pullRequestUrl: row.pull_request_url,
            submittedBy: userId.slice(0, 8) + "…", // Will be updated with profile info by caller
            submittedAt: row.created_at ?? new Date().toISOString(),
            status: row.status ?? "pending",
            notes: row.notes ?? undefined,
        };

        return { data: submission, error: null };
    } catch (error) {
        console.error("Error submitting solution:", error);
        return { data: null, error: "Failed to submit solution" };
    }
}
