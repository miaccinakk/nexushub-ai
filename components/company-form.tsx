"use client"

import { Loader2, Wand2, Sparkles } from "lucide-react"
import type { CompanyInput } from "@/lib/types"

interface Field {
  key: keyof CompanyInput
  label: string
  placeholder: string
  type?: "input" | "textarea"
  full?: boolean
}

const FIELDS: Field[] = [
  { key: "name", label: "Company name", placeholder: "e.g. MedHealth AI" },
  { key: "website", label: "Website", placeholder: "e.g. medhealth.ai" },
  { key: "industry", label: "Industry", placeholder: "e.g. Healthcare AI" },
  { key: "targetMarket", label: "Target market", placeholder: "e.g. UAE / MENA" },
  {
    key: "productDescription",
    label: "Product description",
    placeholder: "What does the product do and who is it for?",
    type: "textarea",
    full: true,
  },
  {
    key: "businessGoals",
    label: "Business goals",
    placeholder: "What is the company trying to achieve?",
    type: "textarea",
    full: true,
  },
  {
    key: "links",
    label: "Business links (optional)",
    placeholder: "One per line — website, LinkedIn, X, deck, press, docs…",
    type: "textarea",
    full: true,
  },
  {
    key: "additionalInfo",
    label: "Additional information",
    placeholder: "Anything else worth knowing (funding, competitors, tone)…",
    type: "textarea",
    full: true,
  },
]

interface CompanyFormProps {
  input: CompanyInput
  onChange: (input: CompanyInput) => void
  onSubmit: () => void
  loading: boolean
}

export function CompanyForm({ input, onChange, onSubmit, loading }: CompanyFormProps) {
  function update(key: keyof CompanyInput, value: string) {
    onChange({ ...input, [key]: value })
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key} className={`flex flex-col gap-1.5 ${field.full ? "sm:col-span-2" : ""}`}>
            <label htmlFor={field.key} className="text-xs font-medium text-muted-foreground">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.key}
                value={input[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            ) : (
              <input
                id={field.key}
                value={input[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-primary/25 bg-primary/5 p-4">
        <label htmlFor="guidance" className="flex items-center gap-1.5 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          AI assistant prompt
        </label>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Steer the assistant: set tone, language, audience, angle or anything it must follow.
        </p>
        <textarea
          id="guidance"
          value={input.guidance}
          onChange={(e) => update("guidance", e.target.value)}
          placeholder="e.g. Confident, premium tone for founders & investors. Write in English. Focus on AI-first positioning and avoid hype."
          rows={3}
          className={`mt-2 ${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !input.name.trim()}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Generating analysis…
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" aria-hidden="true" />
            Generate AI Analysis
          </>
        )}
      </button>
    </form>
  )
}
