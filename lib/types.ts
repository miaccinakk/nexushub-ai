export type AnalysisStatus = "Analyzed" | "In Progress" | "Not Started"

export interface Company {
  id: string
  name: string
  website: string
  industry: string
  country: string
  targetMarket: string
  description: string
  productDescription: string
  businessGoals: string
  additionalInfo: string
  status: AnalysisStatus
}

export interface CompanyInput {
  name: string
  website: string
  industry: string
  targetMarket: string
  productDescription: string
  businessGoals: string
  additionalInfo: string
  /** Extra business links: socials, decks, docs, press — one per line or comma-separated. */
  links: string
  /** Custom AI prompt / instructions that steer tone, language, focus and constraints. */
  guidance: string
}

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
