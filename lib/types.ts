export type AnalysisStatus = "Analyzed" | "In Progress" | "Not Started"

/* =============================================================================
 *  ENTITY MODEL — three separate levels, linked by leadId
 *  1) Lead     — the prospect / company card (who we're reaching out to)
 *  2) Analysis — a GTM breakdown built on top of a Lead
 *  3) Email    — outreach content built on a Lead (optionally on an Analysis)
 * ========================================================================== */

/** Level 1 — the core lead entity persisted to data/leads.json. */
export interface Lead {
  id: string
  createdAt: string
  name: string
  website: string
  industry: string
  targetMarket: string
  productDescription: string
  businessGoals: string
  additionalInfo: string
  /** Extra business links: socials, decks, docs, press — one per line. */
  links: string
}

/** Fields a user fills when creating a Lead (everything except server-managed ids). */
export type LeadInput = Omit<Lead, "id" | "createdAt">

export const EMPTY_LEAD_INPUT: LeadInput = {
  name: "",
  website: "",
  industry: "",
  targetMarket: "",
  productDescription: "",
  businessGoals: "",
  additionalInfo: "",
  links: "",
}

/** Config that steers an analysis run: exclusions + prioritization + AI steering. */
export interface AnalysisConfig {
  /* Exclusions / stop-factors */
  excludeIndustries: string
  excludeRegions: string
  excludeSizes: string
  stopFactors: string
  /* Prioritization */
  mustHaveSignals: string
  priorityCriteria: string
  priorityThreshold: string
  /* AI steering */
  guidance: string
  language: string
}

export const EMPTY_ANALYSIS_CONFIG: AnalysisConfig = {
  excludeIndustries: "",
  excludeRegions: "",
  excludeSizes: "",
  stopFactors: "",
  mustHaveSignals: "",
  priorityCriteria: "",
  priorityThreshold: "",
  guidance: "",
  language: "Auto",
}

/** Level 2 — a completed analysis persisted to data/analyses.json. */
export interface Analysis {
  id: string
  leadId: string
  createdAt: string
  /** Snapshot of the lead name for list rendering without a join. */
  leadName: string
  config: AnalysisConfig
  result: AnalysisResult
}

/** Level 3 — a generated outreach asset persisted to data/emails.json. */
export interface Email {
  id: string
  leadId: string
  /** Optional — the analysis this email was built on. */
  analysisId?: string
  createdAt: string
  leadName: string
  contentType: ContentTypeKey
  /** Human-facing label of the content type (snapshot). */
  contentLabel: string
  instructions: string
  language: string
  guidance: string
  text: string
}

/**
 * The flat shape passed to the prompt builders and /api/generate.
 * It is assembled from a Lead (+ optional AnalysisConfig) — see buildPromptInput.
 */
export interface CompanyInput {
  name: string
  website: string
  industry: string
  targetMarket: string
  productDescription: string
  businessGoals: string
  additionalInfo: string
  links: string

  excludeIndustries: string
  excludeRegions: string
  excludeSizes: string
  stopFactors: string

  mustHaveSignals: string
  priorityCriteria: string
  priorityThreshold: string

  guidance: string
  language: string
}

/** Merge a Lead and an (optional) AnalysisConfig into a flat prompt input. */
export function buildPromptInput(lead: LeadInput, config?: Partial<AnalysisConfig>): CompanyInput {
  return {
    name: lead.name,
    website: lead.website,
    industry: lead.industry,
    targetMarket: lead.targetMarket,
    productDescription: lead.productDescription,
    businessGoals: lead.businessGoals,
    additionalInfo: lead.additionalInfo,
    links: lead.links,
    excludeIndustries: config?.excludeIndustries ?? "",
    excludeRegions: config?.excludeRegions ?? "",
    excludeSizes: config?.excludeSizes ?? "",
    stopFactors: config?.stopFactors ?? "",
    mustHaveSignals: config?.mustHaveSignals ?? "",
    priorityCriteria: config?.priorityCriteria ?? "",
    priorityThreshold: config?.priorityThreshold ?? "",
    guidance: config?.guidance ?? "",
    language: config?.language ?? "Auto",
  }
}

export const LANGUAGES = [
  "Auto",
  "English",
  "Russian",
  "Arabic",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Chinese",
] as const

export const ANALYSIS_SECTIONS = [
  { key: "market-overview", task: "Market Overview", title: "Market Overview" },
  { key: "icp", task: "Ideal Customer Profile", title: "Ideal Customer Profile (ICP)" },
  { key: "audience", task: "Target Audience", title: "Target Audience" },
  { key: "messaging", task: "Key Messaging", title: "Key Messaging" },
  { key: "sales-angles", task: "Sales Angles", title: "Sales Angles" },
  { key: "content-ideas", task: "Content Ideas", title: "Content Ideas" },
] as const

export type AnalysisSectionKey = (typeof ANALYSIS_SECTIONS)[number]["key"]

export type AnalysisResult = Record<AnalysisSectionKey, string>

export const CONTENT_TYPES = [
  { key: "linkedin", task: "LinkedIn Post", label: "LinkedIn Post" },
  { key: "email", task: "Email Outreach", label: "Email Outreach" },
  { key: "event", task: "Event Invitation", label: "Event Invitation" },
  { key: "twitter", task: "Twitter Post", label: "X / Twitter Post" },
  { key: "video", task: "Video / Avatar Script", label: "Video / Avatar Script" },
  { key: "ideas", task: "Content Ideas", label: "Content Ideas" },
] as const

export type ContentTypeKey = (typeof CONTENT_TYPES)[number]["key"]

/** Entity kinds used by the dashboard filter. */
export type EntityType = "lead" | "analysis" | "email"
