import { notFound } from "next/navigation";
import { fetchPublicProfile, fetchBountyStats } from "@/features/profiles/actions";
import { PublicProfileDetails } from "@/features/profiles/components/public-profile-details";

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

    return (
        <main className="min-h-screen bg-gray-900">
            <div className="relative z-10 py-8">
                <PublicProfileDetails
                    profile={profile}
                    bountyStats={bountyStatsResult.data}
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
