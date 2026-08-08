import { promises as fs } from "fs"
import path from "path"
import type { Company } from "./types"

const FILE_PATH = path.join(process.cwd(), "data", "companies.json")

/** Read every company, newest first. Returns [] if the file is missing or invalid. */
export async function readCompanies(): Promise<Company[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8")
    const parsed = JSON.parse(raw) as Company[]
    if (!Array.isArray(parsed)) return []
    return [...parsed].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}

/** Find a single company by id. */
export async function getCompany(id: string): Promise<Company | null> {
  const companies = await readCompanies()
  return companies.find((c) => c.id === id) ?? null
}

/** Append a new company to the JSON file and return the persisted record. */
export async function saveCompany(company: Company): Promise<Company> {
  const existing = await readCompanies()
  const next = [company, ...existing]
  await fs.writeFile(FILE_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8")
  return company
}

/** Update an existing company in place. Returns the updated record, or null if not found. */
export async function updateCompany(
  id: string,
  patch: Partial<Omit<Company, "id" | "createdAt">>,
): Promise<Company | null> {
  const existing = await readCompanies()
  const index = existing.findIndex((c) => c.id === id)
  if (index === -1) return null
  const updated: Company = { ...existing[index], ...patch }
  existing[index] = updated
  await fs.writeFile(FILE_PATH, JSON.stringify(existing, null, 2) + "\n", "utf-8")
  return updated
}
