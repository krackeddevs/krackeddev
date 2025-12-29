import { notFound } from "next/navigation";
import { fetchPublicProfile, fetchBountyStats, fetchContributionStats } from "@/features/profiles/actions";
import { PublicProfileDetails } from "@/features/profiles/components/public-profile-details";
import { GithubStats } from "@/features/profiles/types";

interface PublicProfilePageProps {
    params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
    const { username } = await params;

    // Fetch profile by username
    const { data: profile, error } = await fetchPublicProfile(username);

    if (error || !profile) {
        notFound();
    }

    // Fetch bounty stats for this user
    const bountyStatsResult = await fetchBountyStats(profile.id);

    // Fetch contribution stats (read-only from cache)
    const contributionStatsResult = await fetchContributionStats(username);

    // Reconstruct GithubStats from cached contribution_stats for the heatmap
    let githubStats: GithubStats | undefined;

    if (profile.contribution_stats) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cachedStats = profile.contribution_stats as any;

        // Handle stringified JSON
        if (typeof cachedStats === 'string') {
            try {
                cachedStats = JSON.parse(cachedStats);
            } catch (e) {
                console.error("Failed to parse cached stats in public profile:", e);
                cachedStats = null;
            }
        }

        if (cachedStats && cachedStats.weeks) {
            githubStats = {
                username: profile.username || "",
                avatarUrl: profile.avatar_url || "",
                totalContributions: cachedStats.totalContributions || 0,
                contributionCalendar: cachedStats.weeks,
                topLanguages: [], // Top languages not currently cached in contribution_stats
            };
        }
    }

    return (
        <main className="min-h-screen bg-gray-900">
            <div className="relative z-10 py-8">
                <PublicProfileDetails
                    profile={profile}
                    bountyStats={bountyStatsResult.data}
                    contributionStats={contributionStatsResult.data}
                    githubStats={githubStats}
                />
            </div>
        </main>
    );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PublicProfilePageProps) {
    const { username } = await params;
    const { data: profile } = await fetchPublicProfile(username);

    if (!profile) {
        return { title: "User Not Found | Kracked Devs" };
    }

    return {
        title: `${profile.full_name || profile.username} | Kracked Devs`,
        description: profile.bio || `${profile.username}'s developer profile on Kracked Devs`,
    };
}
