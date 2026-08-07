"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, UserPlus, Save } from "lucide-react"
import { EMPTY_LEAD_INPUT, type LeadInput } from "@/lib/types"
import { FieldCell } from "./field-cell"

interface FieldDef {
  key: keyof LeadInput
  label: string
  placeholder: string
  hint?: string
  type?: "input" | "textarea"
  full?: boolean
}

const FIELDS: FieldDef[] = [
  { key: "name", label: "Компания", placeholder: "напр. MedHealth AI" },
  { key: "website", label: "Сайт", placeholder: "напр. medhealth.ai" },
  { key: "industry", label: "Отрасль", placeholder: "напр. Healthcare AI" },
  { key: "targetMarket", label: "Целевой рынок", placeholder: "напр. ОАЭ / MENA" },
  {
    key: "productDescription",
    label: "Что продаём",
    placeholder: "Что делает продукт и для кого?",
    type: "textarea",
    full: true,
  },
  {
    key: "businessGoals",
    label: "Цель захода",
    placeholder: "Чего компания пытается достичь этим лидом?",
    type: "textarea",
    full: true,
  },
  {
    key: "links",
    label: "Ссылки (по желанию)",
    hint: "По одной в строке — сайт, LinkedIn, X, дек, пресса, доки…",
    placeholder: "https://…",
    type: "textarea",
    full: true,
  },
  {
    key: "additionalInfo",
    label: "Доп. информация",
    placeholder: "Что ещё важно знать (раунды, конкуренты, тон)…",
    type: "textarea",
    full: true,
  },
]

interface LeadFormProps {
  /** When provided, the form edits this lead via PUT instead of creating a new one. */
  leadId?: string
  /** Initial field values (defaults to an empty lead). */
  initial?: LeadInput
}

export function LeadForm({ leadId, initial }: LeadFormProps) {
  const router = useRouter()
  const isEdit = Boolean(leadId)
  const [input, setInput] = useState<LeadInput>(initial ?? EMPTY_LEAD_INPUT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(key: keyof LeadInput, value: string) {
    setInput((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(isEdit ? `/api/leads/${leadId}` : "/api/leads", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      })
      if (!res.ok) throw new Error("Request failed")
      const data = (await res.json()) as { lead: { id: string } }
      router.push(`/leads/${data.lead.id}`)
      router.refresh()
    } catch {
      setError(
        isEdit
          ? "Не удалось сохранить изменения. Попробуй ещё раз."
          : "Не удалось сохранить лид. Попробуй ещё раз.",
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
            Создать лид
          </>
        )}
      </button>
    </form>
  )
}
