"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, UserPlus, Save } from "lucide-react"
import { EMPTY_PERSON_INPUT, type PersonInput } from "@/lib/types"
import { FieldCell } from "./field-cell"

interface FieldDef {
  key: keyof PersonInput
  label: string
  placeholder: string
  hint?: string
  type?: "input" | "textarea"
  full?: boolean
}

const FIELDS: FieldDef[] = [
  { key: "name", label: "Имя", placeholder: "напр. Ахмед Аль-Мансури" },
  { key: "role", label: "Роль / должность", placeholder: "напр. CEO, Head of Growth" },
  { key: "website", label: "Личный сайт", placeholder: "напр. ahmed.dev" },
  {
    key: "links",
    label: "Соцсети",
    hint: "По одной в строке — LinkedIn, X, Telegram, Instagram…",
    placeholder: "https://linkedin.com/in/…",
    type: "textarea",
    full: true,
  },
  {
    key: "bio",
    label: "О человеке / характеристики",
    placeholder: "Кто это, бэкграунд, что для него важно, особенности…",
    type: "textarea",
    full: true,
  },
  {
    key: "additionalInfo",
    label: "Доп. информация",
    placeholder: "Что ещё важно знать (интересы, тон общения, связи)…",
    type: "textarea",
    full: true,
  },
]

interface PersonFormProps {
  /** When provided, the form edits this person via PUT instead of creating a new one. */
  personId?: string
  /** Initial field values (defaults to an empty person). */
  initial?: PersonInput
}

export function PersonForm({ personId, initial }: PersonFormProps) {
  const router = useRouter()
  const isEdit = Boolean(personId)
  const [input, setInput] = useState<PersonInput>(initial ?? EMPTY_PERSON_INPUT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(key: keyof PersonInput, value: string) {
    setInput((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(isEdit ? `/api/people/${personId}` : "/api/people", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      })
      if (!res.ok) throw new Error("Request failed")
      const data = (await res.json()) as { person: { id: string } }
      router.push(`/people/${data.person.id}`)
      router.refresh()
    } catch {
      setError(
        isEdit
          ? "Не удалось сохранить изменения. Попробуй ещё раз."
          : "Не удалось сохранить человека. Попробуй ещё раз.",
      )
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-muted/40 p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <FieldCell
            key={f.key}
            id={f.key}
            label={f.label}
            value={input[f.key]}
            onValueChange={(v) => update(f.key, v)}
            placeholder={f.placeholder}
            hint={f.hint}
            type={f.type}
            full={f.full}
          />
        ))}
      </div>

      {error ? <p className="mt-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent-foreground">{error}</p> : null}

      <button
        type="submit"
        disabled={saving || !input.name.trim()}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Сохраняю…
          </>
        ) : isEdit ? (
          <>
            <Save className="h-4 w-4" aria-hidden="true" />
            Сохранить изменения
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Создать человека
          </>
        )}
      </button>
    </form>
  )
}
