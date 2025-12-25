import { LandingPage } from "@/features/landingpage";
import { createClient } from "@/lib/supabase/server";
import { fetchMiniProfileData } from "@/features/profiles/actions";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const miniProfileData = user ? await fetchMiniProfileData(user.id) : null;

  return <LandingPage isLoggedIn={!!user} miniProfileData={miniProfileData} />;
}
