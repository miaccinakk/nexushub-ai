import { promises as fs } from "fs"
import path from "path"
import type { SavedAnalysis } from "./types"

const FILE_PATH = path.join(process.cwd(), "data", "analyses.json")

/** Read every saved analysis, newest first. Returns [] if the file is missing or invalid. */
export async function readAnalyses(): Promise<SavedAnalysis[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8")
    const parsed = JSON.parse(raw) as SavedAnalysis[]
    if (!Array.isArray(parsed)) return []
    return [...parsed].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}

/** Append a new analysis to the JSON file and return the persisted record. */
export async function saveAnalysis(analysis: SavedAnalysis): Promise<SavedAnalysis> {
  const existing = await readAnalyses()
  const next = [analysis, ...existing]
  await fs.writeFile(FILE_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8")
  return analysis
}
