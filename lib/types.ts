export type AnalysisStatus = "Analyzed" | "In Progress" | "Not Started"

/* =============================================================================
 *  ENTITY MODEL — top-level entities + derived assets
 *  1) Company  — a company card (site, industry, product, goals)
 *  2) Person   — a human contact card (role, socials, site, bio) — независим
 *  3) Analysis — a "lead" assembled from ONE company + SEVERAL people
 *  4) Email    — outreach content built on a company (optionally person/analysis)
 * ========================================================================== */

/* -------------------------------------------------------------------------- */
/*  Company                                                                    */
/* -------------------------------------------------------------------------- */

/** A company card persisted to data/companies.json. */
export interface Company {
  id: string
  createdAt: string
  name: string
  website: string
  industry: string
  targetMarket: string
  productDescription: string
  businessGoals: string
  additionalInfo: string
  /** Extra links: site, decks, docs, press — one per line. */
  links: string
}

/** Fields a user fills when creating a Company (everything except server ids). */
export type CompanyInput = Omit<Company, "id" | "createdAt">

export const EMPTY_COMPANY_INPUT: CompanyInput = {
  name: "",
  website: "",
  industry: "",
  targetMarket: "",
  productDescription: "",
  businessGoals: "",
  additionalInfo: "",
  links: "",
}

/* -------------------------------------------------------------------------- */
/*  Person                                                                     */
/* -------------------------------------------------------------------------- */

/** A person card persisted to data/people.json. Independent of any company. */
export interface Person {
  id: string
  createdAt: string
  name: string
  /** Role / title, e.g. "CEO", "Head of Growth". */
  role: string
  /** Personal website / portfolio. */
  website: string
  /** Social links — one per line (LinkedIn, X, Telegram, …). */
  links: string
  /** Who they are: background, characteristics, what matters to them. */
  bio: string
  additionalInfo: string
}

/** Fields a user fills when creating a Person. */
export type PersonInput = Omit<Person, "id" | "createdAt">

export const EMPTY_PERSON_INPUT: PersonInput = {
  name: "",
  role: "",
  website: "",
  links: "",
  bio: "",
  additionalInfo: "",
}

/* -------------------------------------------------------------------------- */
/*  Analysis                                                                   */
/* -------------------------------------------------------------------------- */

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

/** A completed analysis persisted to data/analyses.json — one company + people. */
export interface Analysis {
  id: string
  createdAt: string
  companyId: string
  /** Snapshot of the company name for list rendering without a join. */
  companyName: string
  /** People included in this lead. */
  personIds: string[]
  /** Snapshot of the people names for list rendering without a join. */
  personNames: string[]
  config: AnalysisConfig
  result: AnalysisResult
}

/* -------------------------------------------------------------------------- */
/*  Email                                                                      */
/* -------------------------------------------------------------------------- */

/** A generated outreach asset persisted to data/emails.json. */
export interface Email {
  id: string
  createdAt: string
  companyId: string
  companyName: string
  /** Optional — the specific person this outreach targets. */
  personId?: string
  personName?: string
  /** Optional — the analysis this email was built on. */
  analysisId?: string
  contentType: ContentTypeKey
  /** Human-facing label of the content type (snapshot). */
  contentLabel: string
  instructions: string
  language: string
  guidance: string
  text: string
}

/* -------------------------------------------------------------------------- */
/*  Prompt input                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The flat shape passed to the prompt builders and /api/generate.
 * Assembled from a Company (+ people + optional AnalysisConfig).
 */
export interface PromptInput {
  name: string
  website: string
  industry: string
  targetMarket: string
  productDescription: string
  businessGoals: string
  additionalInfo: string
  links: string

  /** Formatted block describing the people attached to this lead. */
  people: string

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

/** Render one person into a compact, readable block for the prompt. */
function personBlock(person: Pick<Person, "name" | "role" | "website" | "links" | "bio" | "additionalInfo">): string {
  const parts = [
    `- ${person.name || "N/A"}${person.role ? ` — ${person.role}` : ""}`,
    person.website ? `  Сайт: ${person.website}` : "",
    person.links?.trim() ? `  Соцсети: ${person.links.replace(/\s*\n\s*/g, ", ")}` : "",
    person.bio?.trim() ? `  О человеке: ${person.bio.trim()}` : "",
    person.additionalInfo?.trim() ? `  Доп.: ${person.additionalInfo.trim()}` : "",
  ]
  return parts.filter(Boolean).join("\n")
}

/** Merge a Company, its people and an (optional) AnalysisConfig into a flat prompt input. */
export function buildPromptInput(
  company: CompanyInput,
  people: PersonInput[] = [],
  config?: Partial<AnalysisConfig>,
): PromptInput {
  return {
    name: company.name,
    website: company.website,
    industry: company.industry,
    targetMarket: company.targetMarket,
    productDescription: company.productDescription,
    businessGoals: company.businessGoals,
    additionalInfo: company.additionalInfo,
    links: company.links,
    people: people.length > 0 ? people.map(personBlock).join("\n") : "",
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
export type EntityType = "company" | "person" | "analysis" | "email"
