import { streamText } from "ai";
import { llm } from "@/lib/ai";
import { DOJO_WELCOME_SYSTEM_PROMPT } from "@/lib/ai/prompts";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: llm,
    system: DOJO_WELCOME_SYSTEM_PROMPT,
    messages,
  });

  return result.toTextStreamResponse();
}
