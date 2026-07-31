import type { CompanyInput } from "./types"

/**
 * Builds a compact, structured context block shared by every prompt.
 * The [TASK: ...] marker lets the mock model route responses; a real model
 * simply reads it as plain instruction text.
 */
function companyContext(input: CompanyInput): string {
  return [
    `Company: ${input.name || "N/A"}`,
    `Website: ${input.website || "N/A"}`,
    `Industry: ${input.industry || "N/A"}`,
    `Target market: ${input.targetMarket || "N/A"}`,
    `Product description: ${input.productDescription || "N/A"}`,
    `Business goals: ${input.businessGoals || "N/A"}`,
    `Additional information: ${input.additionalInfo || "N/A"}`,
    `Business links: ${input.links?.trim() ? input.links.replace(/\s*\n\s*/g, ", ") : "N/A"}`,
  ].join("\n")
}

/**
 * Appends the user's custom AI instructions (if any) as a high-priority
 * directive. `extra` carries per-generation instructions for a single asset.
 */
function guidanceBlock(input: CompanyInput, extra?: string): string {
  const parts: string[] = []
  if (input.guidance?.trim()) parts.push(input.guidance.trim())
  if (extra?.trim()) parts.push(extra.trim())
  if (parts.length === 0) return ""
  return ["", `[CUSTOM INSTRUCTIONS — follow these closely]`, ...parts].join("\n")
}

export function buildSectionPrompt(input: CompanyInput, task: string): string {
  return [
    `[TASK: ${task}]`,
    `You are a senior B2B go-to-market strategist.`,
    `Using the company profile below, produce a concise, insightful "${task}".`,
    ``,
    companyContext(input),
    guidanceBlock(input),
  ]
    .filter(Boolean)
    .join("\n")
}

export function buildContentPrompt(input: CompanyInput, task: string, instructions?: string): string {
  return [
    `[TASK: ${task}]`,
    `You are an expert B2B copywriter.`,
    `Write a ready-to-use "${task}" for the company below. Keep it on-brand, specific, and persuasive.`,
    ``,
    companyContext(input),
    guidanceBlock(input, instructions),
  ]
    .filter(Boolean)
    .join("\n")
}
