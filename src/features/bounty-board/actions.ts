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
        // Start with empty array (DB only mode)
        let bounties: Bounty[] = []; // [...staticBounties];

        // Try to fetch from Supabase as well
        const supabase = await createClient();
        if (supabase) {
            const { data: dbBounties, error } = await supabase
                .from("bounties")
                .select(`
                    *,
                    winner_profile:profiles!winner_user_id (username)
                `)
                .in("status", ["open", "completed", "expired"]);

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
                    status: (row.status === "open" && new Date(row.deadline) < new Date())
                        ? "expired"
                        : (row.status === "open" ? "active" : row.status),
                    rarity: row.rarity || "normal",
                    // Map company/type info
                    // Bounties with no company or "Kracked Devs" are official
                    companyName: row.company_name,
                    type: (!row.company_name || row.company_name === 'Kracked Devs') ? 'official' : 'community',

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
                        username: row.winner_profile?.username,  // For profile linking
                        xHandle: row.winner_x_handle,
                        xUrl: row.winner_x_url,
                        submissionUrl: row.winner_submission_url,
                    } : undefined,
                }));

                // Merge: DB bounties take precedence (by slug)
                // Remove static bounties that exist in DB, then add all DB bounties
                const dbSlugs = new Set(mappedDbBounties.map((b) => b.slug));
                bounties = bounties.filter((b) => !dbSlugs.has(b.slug));
                bounties.push(...mappedDbBounties);
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
 * Uses hybrid data source: Supabase first, static data fallback
 */
export async function fetchBountyBySlug(
    slug: string
): Promise<{ data: Bounty | null; error: string | null }> {
    try {
        // Try Supabase first (DB takes precedence)
        const supabase = await createClient();
        if (supabase) {
            const { data, error } = await supabase
                .from("bounties")
                .select(`
                    *,
                    winner_profile:profiles!winner_user_id (username)
                `)
                .eq("slug", slug)
                .single();

            if (!error && data) {
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
                    // Map company/type info
                    // Bounties with no company or "Kracked Devs" are official
                    companyName: row.company_name,
                    type: (!row.company_name || row.company_name === 'Kracked Devs') ? 'official' : 'community',

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
                        username: row.winner_profile?.username,  // For profile linking
                        xHandle: row.winner_x_handle,
                        xUrl: row.winner_x_url,
                        submissionUrl: row.winner_submission_url,
                    } : undefined,
                };

                return { data: bounty, error: null };
            }
        }

        // Fallback to static data if not found in DB
        const staticBounty = staticBounties.find((b) => b.slug === slug);
        if (staticBounty) {
            return { data: staticBounty, error: null };
        }

        return { data: null, error: "Bounty not found" };
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
        // Get combined bounties (static + DB) - this already includes all sources
        const { data: bounties } = await fetchActiveBounties();

        // Count active bounties (status === "active")
        const activeBounties = bounties.filter((b) => b.status === "active");
        const availableRewards = activeBounties.reduce((sum, b) => sum + b.reward, 0);

        // Count completed bounties (status === "completed")
        const completedBounties = bounties.filter((b) => b.status === "completed");
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

// Import XP system
import { grantXP, XP_RATES, calculateBountyWinXP } from "@/features/profiles/xp-system";

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

        // Grant XP for submission
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const submissionData = data as any;
            await grantXP(userId, 'bounty_submission', XP_RATES.BOUNTY_SUBMISSION, {
                bounty_slug: bountySlug,
                submission_id: submissionData.id
            });
        } catch (xpError) {
            console.error("Failed to grant submission XP:", xpError);
            // Don't block submission success
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

// ============================================================================
// Admin Verification Actions
// ============================================================================

export interface AdminSubmission {
    id: string;
    bountySlug: string;
    bountyTitle: string;
    bountyReward: number;
    userId: string;
    userName?: string;
    pullRequestUrl: string;
    status: "pending" | "approved" | "rejected";
    notes?: string;
    reviewedBy?: string;
    reviewedAt?: string;
    reviewNotes?: string;
    paymentRef?: string;
    paidAt?: string;
    createdAt: string;
}

/**
 * Fetch all submissions for admin review
 */
export async function fetchAllSubmissions(): Promise<{
    data: AdminSubmission[];
    error: string | null;
}> {
    try {
        const supabase = await createClient();
        if (!supabase) {
            return { data: [], error: "Database connection unavailable" };
        }

        const { data, error } = await supabase
            .from("bounty_submissions")
            .select(`
                id,
                bounty_slug,
                bounty_title,
                bounty_reward,
                user_id,
                pull_request_url,
                status,
                notes,
                reviewed_by,
                reviewed_at,
                review_notes,
                payment_ref,
                paid_at,
                created_at
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching submissions:", error);
            return { data: [], error: error.message };
        }

        const submissions: AdminSubmission[] = (data || []).map((row: any) => ({
            id: row.id,
            bountySlug: row.bounty_slug,
            bountyTitle: row.bounty_title,
            bountyReward: row.bounty_reward,
            userId: row.user_id,
            pullRequestUrl: row.pull_request_url,
            status: row.status,
            notes: row.notes,
            reviewedBy: row.reviewed_by,
            reviewedAt: row.reviewed_at,
            reviewNotes: row.review_notes,
            paymentRef: row.payment_ref,
            paidAt: row.paid_at,
            createdAt: row.created_at,
        }));

        return { data: submissions, error: null };
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return { data: [], error: "Failed to fetch submissions" };
    }
}

/**
 * Review a submission (approve or reject)
 * Requires a comment for audit trail
 */
export async function reviewSubmission(
    submissionId: string,
    status: "approved" | "rejected",
    comment: string,
    reviewerId: string
): Promise<{ success: boolean; error: string | null }> {
    try {
        // Validate comment is provided
        if (!comment || comment.trim() === "") {
            return { success: false, error: "Comment is required for review" };
        }

        const supabase = await createClient();
        if (!supabase) {
            return { success: false, error: "Database connection unavailable" };
        }

        // Fetch submission first to get user_id and bounty_reward for XP
        // Only needed if we are approving
        let submissionData: any = null;
        if (status === 'approved') {
            const { data, error: fetchError } = await supabase
                .from('bounty_submissions')
                .select('user_id, bounty_reward, bounty_slug')
                .eq('id', submissionId)
                .single();

            if (!fetchError) submissionData = data;
        }

        const { error } = await (supabase
            .from("bounty_submissions") as any)
            .update({
                status,
                review_notes: comment.trim(),
                reviewed_by: reviewerId,
                reviewed_at: new Date().toISOString(),
            })
            .eq("id", submissionId);

        if (error) {
            console.error("Error reviewing submission:", error);
            return { success: false, error: error.message };
        }

        // Grant XP if approved
        if (status === 'approved' && submissionData) {
            try {
                const xpAmount = calculateBountyWinXP(submissionData.bounty_reward || 0);
                await grantXP(
                    submissionData.user_id,
                    'bounty_win',
                    xpAmount,
                    {
                        submission_id: submissionId,
                        bounty_slug: submissionData.bounty_slug,
                        bounty_value: submissionData.bounty_reward
                    }
                );
            } catch (xpError) {
                console.error("Failed to grant bounty win XP:", xpError);
            }
        }

        return { success: true, error: null };
    } catch (error) {
        console.error("Error reviewing submission:", error);
        return { success: false, error: "Failed to review submission" };
    }
}

/**
 * Mark a submission as paid with transaction reference
 * Also marks the bounty as completed and saves winner info
 */
export async function markSubmissionPaid(
    submissionId: string,
    transactionRef: string
): Promise<{ success: boolean; error: string | null }> {
    try {
        // Validate transaction reference is provided
        if (!transactionRef || transactionRef.trim() === "") {
            return { success: false, error: "Transaction reference is required" };
        }

        const supabase = await createClient();
        if (!supabase) {
            return { success: false, error: "Database connection unavailable" };
        }

        // First, get the submission details to find the bounty and user
        const { data: submission, error: fetchError } = await supabase
            .from("bounty_submissions")
            .select(`
                id,
                bounty_slug,
                user_id,
                pull_request_url,
                submitter:profiles!bounty_submissions_user_id_fkey (username, full_name)
            `)
            .eq("id", submissionId)
            .single();

        if (fetchError || !submission) {
            console.error("Error fetching submission:", fetchError);
            return { success: false, error: "Submission not found" };
        }

        const row = submission as any;

        // Update the submission as paid
        const { error: updateError } = await (supabase
            .from("bounty_submissions") as any)
            .update({
                payment_ref: transactionRef.trim(),
                paid_at: new Date().toISOString(),
            })
            .eq("id", submissionId);

        if (updateError) {
            console.error("Error marking as paid:", updateError);
            return { success: false, error: updateError.message };
        }

        // Get winner name from profile
        const winnerName = row.submitter?.username || row.submitter?.full_name || "Anonymous";

        // Update the bounty status to completed and save winner info
        const { error: bountyError } = await (supabase
            .from("bounties") as any)
            .update({
                status: "completed",
                completed_at: new Date().toISOString(),
                winner_name: winnerName,
                winner_submission_url: row.pull_request_url,
            })
            .eq("slug", row.bounty_slug);

        if (bountyError) {
            console.error("Error updating bounty status:", bountyError);
            // Don't fail the whole operation - payment was already recorded
            // Just log the error, the bounty can be updated manually
        }

        return { success: true, error: null };
    } catch (error) {
        console.error("Error marking as paid:", error);
        return { success: false, error: "Failed to mark as paid" };
    }
}

// ============================================================================
// Manual Bounty Completion (for external submissions)
// ============================================================================

export interface ManualCompletionData {
    winnerName: string;
    winnerXHandle?: string;
    winnerXUrl?: string;
    winnerSubmissionUrl?: string;
}

/**
 * Mark a bounty as completed manually (for submissions outside the platform)
 * Updates bounty status to completed and saves winner info
 */
export async function markBountyCompletedManually(
    bountyId: string,
    winnerData: ManualCompletionData
): Promise<{ success: boolean; error: string | null }> {
    try {
        // Validate winner name is provided
        if (!winnerData.winnerName || winnerData.winnerName.trim() === "") {
            return { success: false, error: "Winner name is required" };
        }

        const supabase = await createClient();
        if (!supabase) {
            return { success: false, error: "Database connection unavailable" };
        }

        // Update the bounty with winner info and mark as completed
        const { error } = await (supabase
            .from("bounties") as any)
            .update({
                status: "completed",
                completed_at: new Date().toISOString(),
                winner_name: winnerData.winnerName.trim(),
                winner_x_handle: winnerData.winnerXHandle?.trim() || null,
                winner_x_url: winnerData.winnerXUrl?.trim() || null,
                winner_submission_url: winnerData.winnerSubmissionUrl?.trim() || null,
            })
            .eq("id", bountyId);

        if (error) {
            console.error("Error marking bounty as completed:", error);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (error) {
        console.error("Error marking bounty as completed:", error);
        return { success: false, error: "Failed to mark bounty as completed" };
    }
}
