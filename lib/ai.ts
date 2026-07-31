/**
 * =============================================================================
 *  AI INTEGRATION POINT
 * =============================================================================
 *
 *  This is the single place where the app talks to a language model.
 *  It uses the Vercel AI SDK with the OpenAI provider. The API key is read
 *  automatically from the `OPENAI_API_KEY` environment variable, and the model
 *  can be overridden with `OPENAI_MODEL` (defaults to "gpt-4o-mini").
 *
 *  The rest of the app only depends on this function signature:
 *      generateAIResponse(prompt: string) => Promise<string>
 * =============================================================================
 */

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"

const SYSTEM_PROMPT =
  "You are a senior B2B go-to-market strategist and expert copywriter. " +
  "Follow the task and any custom instructions in the prompt precisely. " +
  "Be concise, specific, and immediately usable. Return only the requested content."

export async function generateAIResponse(prompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set. Add it to your project environment variables.")
  }

  const { text } = await generateText({
    model: openai(MODEL),
    system: SYSTEM_PROMPT,
    prompt,
    temperature: 0.7,
  })

  return text.trim()
}
