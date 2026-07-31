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
  ].join("\n")
}

export function buildSectionPrompt(input: CompanyInput, task: string): string {
  return [
    `[TASK: ${task}]`,
    `You are a senior B2B go-to-market strategist.`,
    `Using the company profile below, produce a concise, insightful "${task}".`,
    ``,
    companyContext(input),
  ].join("\n")
}

export function buildContentPrompt(input: CompanyInput, task: string): string {
  return [
    `[TASK: ${task}]`,
    `You are an expert B2B copywriter.`,
    `Write a ready-to-use "${task}" for the company below. Keep it on-brand, specific, and persuasive.`,
    ``,
    companyContext(input),
  ].join("\n")
}
