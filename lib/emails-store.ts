import { promises as fs } from "fs"
import path from "path"
import type { Email } from "./types"

const FILE_PATH = path.join(process.cwd(), "data", "emails.json")

/** Read every email, newest first. Returns [] if the file is missing or invalid. */
export async function readEmails(): Promise<Email[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8")
    const parsed = JSON.parse(raw) as Email[]
    if (!Array.isArray(parsed)) return []
    return [...parsed].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}

/** Find a single email by id. */
export async function getEmail(id: string): Promise<Email | null> {
  const emails = await readEmails()
  return emails.find((e) => e.id === id) ?? null
}

/** All emails that belong to a given lead. */
export async function emailsByLead(leadId: string): Promise<Email[]> {
  const emails = await readEmails()
  return emails.filter((e) => e.leadId === leadId)
}

/** Append a new email to the JSON file and return the persisted record. */
export async function saveEmail(email: Email): Promise<Email> {
  const existing = await readEmails()
  const next = [email, ...existing]
  await fs.writeFile(FILE_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8")
  return email
}
