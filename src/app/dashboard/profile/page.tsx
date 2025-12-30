import {
    getProfile,
    fetchGithubStats,
    fetchBountyStats,
    fetchUserSubmissions,
    fetchContributionStats,
} from "@/features/profiles/actions";
import { ProfilePageClient } from "@/features/profiles/components/profile-page-client";
import { redirect } from "next/navigation";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function DashboardProfilePage() {
    const { data: profile, error } = await getProfile();
    let { data: githubStats } = await fetchGithubStats();
    const { data: bountyStats } = await fetchBountyStats();
    const { data: userSubmissions } = await fetchUserSubmissions();

    const contributionStatsResult = profile?.username
        ? await fetchContributionStats(profile.username)
        : { data: null };

    // Fallback for Github Stats
    if (!githubStats && profile?.contribution_stats) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cachedStats = profile.contribution_stats as any;
        if (cachedStats.weeks) {
            githubStats = {
                username: profile.username || "",
                avatarUrl: profile.avatar_url || "",
                totalContributions: cachedStats.totalContributions || 0,
                contributionCalendar: cachedStats.weeks,
                topLanguages: [],
            };
        }
    }

    if (error === "Not authenticated") {
        redirect("/");
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-destructive">
                        Profile Not Found
                    </h1>
                    <p className="text-muted-foreground">
                        Could not retrieve your profile data. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <ProfilePageClient
                initialData={profile}
                githubStats={githubStats}
                bountyStats={bountyStats}
                userSubmissions={userSubmissions}
                contributionStats={contributionStatsResult.data}
            />
        </div>
    );
}
