import { promises as fs } from "fs"
import path from "path"
import type { Person } from "./types"

const FILE_PATH = path.join(process.cwd(), "data", "people.json")

/** Read every person, newest first. Returns [] if the file is missing or invalid. */
export async function readPeople(): Promise<Person[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8")
    const parsed = JSON.parse(raw) as Person[]
    if (!Array.isArray(parsed)) return []
    return [...parsed].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}

/** Find a single person by id. */
export async function getPerson(id: string): Promise<Person | null> {
  const people = await readPeople()
  return people.find((p) => p.id === id) ?? null
}

/** Return every person whose id is in the given list, preserving newest-first order. */
export async function getPeopleByIds(ids: string[]): Promise<Person[]> {
  const people = await readPeople()
  const set = new Set(ids)
  return people.filter((p) => set.has(p.id))
}

/** Append a new person to the JSON file and return the persisted record. */
export async function savePerson(person: Person): Promise<Person> {
  const existing = await readPeople()
  const next = [person, ...existing]
  await fs.writeFile(FILE_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8")
  return person
}

/** Update an existing person in place. Returns the updated record, or null if not found. */
export async function updatePerson(
  id: string,
  patch: Partial<Omit<Person, "id" | "createdAt">>,
): Promise<Person | null> {
  const existing = await readPeople()
  const index = existing.findIndex((p) => p.id === id)
  if (index === -1) return null
  const updated: Person = { ...existing[index], ...patch }
  existing[index] = updated
  await fs.writeFile(FILE_PATH, JSON.stringify(existing, null, 2) + "\n", "utf-8")
  return updated
}
