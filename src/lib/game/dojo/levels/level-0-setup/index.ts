import type { Level } from "../../types";
import { level0Challenges, LEVEL_0_TOTAL_XP } from "./challenges";

export const level0Setup: Level = {
  id: "level-0",
  slug: "setup",
  title: "Environment Setup",
  description: "Prepare your vibe coding tools",
  order: 0,
  challenges: level0Challenges,
  totalXp: LEVEL_0_TOTAL_XP,
};

export { level0Challenges, LEVEL_0_TOTAL_XP } from "./challenges";
export {
  validateNodeVersion,
  validateNpmVersion,
  validateCursorVersion,
  getValidator,
} from "./validators";
