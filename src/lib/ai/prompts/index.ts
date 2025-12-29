/**
 * AI Prompts Index
 *
 * Central export for all AI prompts used throughout the application.
 * Each prompt module contains system prompts, initial messages, and configs.
 */

export {
  DOJO_WELCOME_SYSTEM_PROMPT,
  DOJO_WELCOME_CONFIG,
  buildDojoWelcomePrompt,
  type DojoUserContext,
} from "./dojo-welcome";
