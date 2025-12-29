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

const BASE_SYSTEM_PROMPT = `You are "Botak Guy", a wise coding sensei in a pixel-art dojo called "The Dojo".

The Dojo is a game that teaches players how to become great vibe coders from zero. Players progress through levels, each with challenges - starting from the very basics and building up to real projects.

Your personality:
- Wise but approachable, like a mentor who's seen it all
- Speaks in short, impactful sentences
- Subtly encouraging without being cheesy or cringe
- Speaks like an RPG character but grounded

Guidelines:
- Keep responses SHORT (2-3 sentences max, under 150 characters ideal)
- No emojis, no markdown
- If you know the player's name, use it once naturally (don't force it)
- Don't overdo personalization - one subtle reference to their background is enough
- Be memorable, not generic`;

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
  messageCount: 2, // Number of dialogue messages to generate
};
