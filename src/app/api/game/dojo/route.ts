import { streamText } from "ai";
import { llm } from "@/lib/ai";
import { buildDojoWelcomePrompt, type DojoUserContext } from "@/lib/ai/prompts";
import { createClient } from "@/lib/supabase/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface ProfileRow {
  full_name: string | null;
  username: string | null;
  developer_role: string | null;
  stack: string[] | null;
  level: number | null;
  xp: number | null;
  location: string | null;
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Fetch user context for personalized dialogue
  let userContext: DojoUserContext | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, username, developer_role, stack, level, xp, location")
        .eq("id", user.id)
        .single<ProfileRow>();

      if (profile) {
        userContext = {
          name: profile.full_name,
          username: profile.username,
          developerRole: profile.developer_role,
          stack: profile.stack,
          level: profile.level ?? undefined,
          xp: profile.xp ?? undefined,
          location: profile.location,
        };
      }
    }
  } catch (error) {
    // If we can't fetch user context, continue with generic prompt
    console.error("Failed to fetch user context for dojo:", error);
  }

  const systemPrompt = buildDojoWelcomePrompt(userContext);

  const result = streamText({
    model: llm,
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
