import { promises as fs } from "fs"
import path from "path"
import type { Analysis } from "./types"

const FILE_PATH = path.join(process.cwd(), "data", "analyses.json")

/** Read every analysis, newest first. Returns [] if the file is missing or invalid. */
export async function readAnalyses(): Promise<Analysis[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8")
    const parsed = JSON.parse(raw) as Analysis[]
    if (!Array.isArray(parsed)) return []
    return [...parsed].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}

/** Find a single analysis by id. */
export async function getAnalysis(id: string): Promise<Analysis | null> {
  const analyses = await readAnalyses()
  return analyses.find((a) => a.id === id) ?? null
}

/** All analyses that include a given company. */
export async function analysesByCompany(companyId: string): Promise<Analysis[]> {
  const analyses = await readAnalyses()
  return analyses.filter((a) => a.companyId === companyId)
}

/** All analyses that include a given person. */
export async function analysesByPerson(personId: string): Promise<Analysis[]> {
  const analyses = await readAnalyses()
  return analyses.filter((a) => a.personIds?.includes(personId))
}

/** Append a new analysis to the JSON file and return the persisted record. */
export async function saveAnalysis(analysis: Analysis): Promise<Analysis> {
  const existing = await readAnalyses()
  const next = [analysis, ...existing]
  await fs.writeFile(FILE_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8")
  return analysis
}
