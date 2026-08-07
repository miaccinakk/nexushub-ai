import { promises as fs } from "fs"
import path from "path"
import type { Lead } from "./types"

const FILE_PATH = path.join(process.cwd(), "data", "leads.json")

/** Read every lead, newest first. Returns [] if the file is missing or invalid. */
export async function readLeads(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8")
    const parsed = JSON.parse(raw) as Lead[]
    if (!Array.isArray(parsed)) return []
    return [...parsed].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}

/** Find a single lead by id. */
export async function getLead(id: string): Promise<Lead | null> {
  const leads = await readLeads()
  return leads.find((l) => l.id === id) ?? null
}

/** Append a new lead to the JSON file and return the persisted record. */
export async function saveLead(lead: Lead): Promise<Lead> {
  const existing = await readLeads()
  const next = [lead, ...existing]
  await fs.writeFile(FILE_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8")
  return lead
}

/** Update an existing lead in place. Returns the updated record, or null if not found. */
export async function updateLead(
  id: string,
  patch: Partial<Omit<Lead, "id" | "createdAt">>,
): Promise<Lead | null> {
  const existing = await readLeads()
  const index = existing.findIndex((l) => l.id === id)
  if (index === -1) return null
  const updated: Lead = { ...existing[index], ...patch }
  existing[index] = updated
  await fs.writeFile(FILE_PATH, JSON.stringify(existing, null, 2) + "\n", "utf-8")
  return updated
}
