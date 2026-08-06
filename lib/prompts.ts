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
    ``,
    `[EXCLUSIONS — hard filters, disqualify before scoring]`,
    `Exclude industries: ${input.excludeIndustries || "N/A"}`,
    `Exclude regions: ${input.excludeRegions || "N/A"}`,
    `Exclude company sizes: ${input.excludeSizes || "N/A"}`,
    `Stop-factors (if present, drop the lead, do not score): ${input.stopFactors || "N/A"}`,
    ``,
    `[PRIORITIZATION rules]`,
    `Must-have signals for high priority: ${input.mustHaveSignals || "N/A"}`,
    `Signals that raise priority: ${input.priorityCriteria || "N/A"}`,
    `Priority threshold: ${input.priorityThreshold || "N/A"}`,
  ].join("\n")
}

/**
 * Forces the response language when the user picked a specific one.
 * "Auto" (or empty) lets the model match the input language.
 */
function languageBlock(input: CompanyInput): string {
  const lang = input.language?.trim()
  if (!lang || lang === "Auto") return ""
  return ["", `[LANGUAGE] Write the entire response in ${lang}, including headings and labels.`].join("\n")
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
    languageBlock(input),
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
    languageBlock(input),
    guidanceBlock(input, instructions),
  ]
    .filter(Boolean)
    .join("\n")
}
