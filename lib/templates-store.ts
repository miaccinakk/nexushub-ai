import { promises as fs } from "fs"
import path from "path"
import type { Template } from "./types"

const FILE_PATH = path.join(process.cwd(), "data", "templates.json")

/** Read every template, newest first. Returns [] if the file is missing or invalid. */
export async function readTemplates(): Promise<Template[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8")
    const parsed = JSON.parse(raw) as Template[]
    if (!Array.isArray(parsed)) return []
    return [...parsed].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}

/** Find a single template by id. */
export async function getTemplate(id: string): Promise<Template | null> {
  const templates = await readTemplates()
  return templates.find((t) => t.id === id) ?? null
}

/** Append a new template to the JSON file and return the persisted record. */
export async function saveTemplate(template: Template): Promise<Template> {
  const existing = await readTemplates()
  const next = [template, ...existing]
  await fs.writeFile(FILE_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8")
  return template
}

/** Delete a template by id. Returns true if a record was removed. */
export async function deleteTemplate(id: string): Promise<boolean> {
  const existing = await readTemplates()
  const next = existing.filter((t) => t.id !== id)
  if (next.length === existing.length) return false
  await fs.writeFile(FILE_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8")
  return true
}
