import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export const llm = openai(process.env.OPENAI_MODEL!);

export { generateText, streamText, generateObject, streamObject } from "ai";
