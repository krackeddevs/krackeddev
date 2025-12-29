/**
 * Dojo Welcome Scene Prompt
 *
 * Used when a player first enters the dojo in the game.
 * The AI plays the role of "Botak Guy", a wise coding sensei.
 */

export interface DojoUserContext {
  name?: string | null;
  username?: string | null;
  developerRole?: string | null;
  stack?: string[] | null;
  level?: number;
  xp?: number;
  location?: string | null;
}

const BASE_SYSTEM_PROMPT = `You are "Botak Guy", a wise and slightly mysterious coding sensei in a pixel-art dojo. You speak in short, impactful sentences with a blend of ancient wisdom and modern developer humor.

Your personality:
- Wise but approachable
- Uses coding metaphors mixed with martial arts philosophy
- Occasionally makes jokes about clean code, git commits, and debugging
- Encouraging but also challenges players to improve
- Speaks concisely - each message should be 1-2 short sentences max

Your role in this scene:
- Welcome the player to the dojo
- Set up their journey as a developer
- Introduce concepts of "vibe coding" and the developer's path
- Be memorable and engaging

Guidelines:
- Keep responses SHORT (under 100 characters ideally, max 150)
- Use simple, impactful language
- No emojis
- No markdown formatting
- Speak as if you're in a retro RPG game`;

/**
 * Builds the system prompt with user context injected.
 * This allows Botak Guy to personalize his dialogue.
 */
export function buildDojoWelcomePrompt(user?: DojoUserContext | null): string {
  if (!user) {
    return BASE_SYSTEM_PROMPT;
  }

  const contextParts: string[] = [];

  // Name context
  const displayName = user.name || user.username;
  if (displayName) {
    contextParts.push(`The player's name is "${displayName}". Address them by name occasionally.`);
  }

  // Developer role context
  if (user.developerRole) {
    const roleDescriptions: Record<string, string> = {
      student: "a student just starting their coding journey",
      junior: "a junior developer eager to learn",
      mid: "a mid-level developer looking to level up",
      senior: "a senior developer seeking mastery",
      lead: "a tech lead who guides others",
      principal: "a principal engineer with deep expertise",
    };
    const roleDesc = roleDescriptions[user.developerRole] || `a ${user.developerRole} developer`;
    contextParts.push(`They are ${roleDesc}. Tailor your wisdom to their experience level.`);
  }

  // Tech stack context
  if (user.stack && user.stack.length > 0) {
    const stackPreview = user.stack.slice(0, 3).join(", ");
    contextParts.push(`They work with: ${stackPreview}. You can reference their tech stack in your wisdom.`);
  }

  // Level/XP context
  if (user.level && user.level > 1) {
    contextParts.push(`They are level ${user.level} with ${user.xp || 0} XP. Acknowledge their progress.`);
  } else if (user.xp && user.xp > 0) {
    contextParts.push(`They have ${user.xp} XP. They are not a complete beginner.`);
  }

  // Location context (optional flavor)
  if (user.location) {
    contextParts.push(`They are from ${user.location}.`);
  }

  if (contextParts.length === 0) {
    return BASE_SYSTEM_PROMPT;
  }

  const userContext = `

Player Context:
${contextParts.map((p) => `- ${p}`).join("\n")}

Use this context naturally - don't force every detail into every response, but weave in personal touches where appropriate.`;

  return BASE_SYSTEM_PROMPT + userContext;
}

// Keep the static version for backwards compatibility
export const DOJO_WELCOME_SYSTEM_PROMPT = BASE_SYSTEM_PROMPT;

export const DOJO_WELCOME_CONFIG = {
  speaker: "Botak Guy",
  typingSpeed: 35,
  messageCount: 5, // Number of dialogue messages to generate
};
