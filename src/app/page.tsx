import { LandingPage } from "@/features/landingpage";
import { createClient } from "@/lib/supabase/server";
import { fetchMiniProfileData } from "@/features/profiles/actions";
import { getLandingStats, getCommunityLocations } from "@/features/landingpage/actions";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Parallel pre-fetching for maximum speed
  const [miniProfileData, initialStats, initialLocations] = await Promise.all([
    user ? fetchMiniProfileData(user.id) : null,
    getLandingStats(),
    getCommunityLocations()
  ]);

  return (
    <LandingPage
      isLoggedIn={!!user}
      miniProfileData={miniProfileData}
      initialStats={initialStats}
      initialLocations={initialLocations}
    />
  );
}
