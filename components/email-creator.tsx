"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Loader2,
  Save,
  Sparkles,
  Languages,
  Building2,
  Linkedin,
  Mail,
  CalendarDays,
  Twitter,
  Clapperboard,
  Lightbulb,
  FileText,
} from "lucide-react"
import {
  ANALYSIS_SECTIONS,
  CONTENT_TYPES,
  LANGUAGES,
  buildPromptInput,
  type Analysis,
  type Company,
  type ContentTypeKey,
  type Person,
  type Template,
} from "@/lib/types"
import { DEFAULT_MODEL_ID } from "@/lib/models"
import { inputClass } from "./field-cell"
import { FormattedText } from "./formatted-text"
import { CopyButton } from "./copy-button"
import { ModelSelector } from "./model-selector"

const ICONS: Record<ContentTypeKey, typeof Linkedin> = {
  linkedin: Linkedin,
  email: Mail,
  event: CalendarDays,
  twitter: Twitter,
  video: Clapperboard,
  ideas: Lightbulb,
}

/** Content formats shown in the picker — the Video / Avatar script is hidden for now. */
const VISIBLE_CONTENT_TYPES = CONTENT_TYPES.filter((t) => t.key !== "video")

export function EmailCreator({
  companies,
  people,
  analyses,
  templates,
  preselectedCompanyId,
  preselectedAnalysisId,
}: {
  companies: Company[]
  people: Person[]
  analyses: Analysis[]
  templates: Template[]
  preselectedCompanyId?: string
  preselectedAnalysisId?: string
}) {
  const router = useRouter()
  const [companyId, setCompanyId] = useState<string>(
    preselectedCompanyId && companies.some((c) => c.id === preselectedCompanyId)
      ? preselectedCompanyId
      : companies[0]?.id ?? "",
  )
  const [analysisId, setAnalysisId] = useState<string>(preselectedAnalysisId ?? "")
  const [personId, setPersonId] = useState<string>("")
  const [contentType, setContentType] = useState<ContentTypeKey>("email")
  const [templateId, setTemplateId] = useState<string>("")
  const [instructions, setInstructions] = useState("")
  const [language, setLanguage] = useState<string>("Auto")
  const [guidance, setGuidance] = useState("")
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID)
  const [output, setOutput] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const company = useMemo(() => companies.find((c) => c.id === companyId), [companies, companyId])
  const companyAnalyses = useMemo(
    () => analyses.filter((a) => a.companyId === companyId),
    [analyses, companyId],
  )
  const selectedAnalysis = useMemo(
    () => companyAnalyses.find((a) => a.id === analysisId),
    [companyAnalyses, analysisId],
  )

  /* People available to target: if an analysis is selected, scope to its people;
     otherwise offer every person in the workspace. */
  const availablePeople = useMemo(() => {
    if (selectedAnalysis) return people.filter((p) => selectedAnalysis.personIds.includes(p.id))
    return people
  }, [people, selectedAnalysis])

  const selectedPerson = useMemo(
    () => availablePeople.find((p) => p.id === personId),
    [availablePeople, personId],
  )

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === templateId),
    [templates, templateId],
  )

  function onCompanyChange(nextId: string) {
    setCompanyId(nextId)
    setAnalysisId("") // analysis belongs to the previous company
    setPersonId("")
    setOutput(null)
  }

  function onAnalysisChange(nextId: string) {
    setAnalysisId(nextId)
    setPersonId("") // person selection may no longer be in scope
    setOutput(null)
  }

  async function generate() {
    if (!company) return
    setGenerating(true)
    setError(null)

    const promptPeople = selectedPerson ? [selectedPerson] : availablePeople
    const input = buildPromptInput(company, promptPeople, {
      ...(selectedAnalysis?.config ?? {}),
      language,
      guidance,
    })
    const task = CONTENT_TYPES.find((t) => t.key === contentType)?.task ?? "Email Outreach"

    const analysisDigest = selectedAnalysis
      ? ANALYSIS_SECTIONS.map((s) => `## ${s.title}\n${selectedAnalysis.result[s.key] ?? ""}`).join("\n\n")
      : ""
    const composedInstructions = [
      instructions.trim(),
      selectedTemplate
        ? `[TEMPLATE — используй как базовую структуру письма, сохрани его стиль и логику, подставь плейсхолдеры и адаптируй под компанию/человека]\n${selectedTemplate.text}`
        : "",
      analysisDigest ? `[ANALYSIS CONTEXT — build the message on this GTM analysis]\n${analysisDigest}` : "",
    ]
      .filter(Boolean)
      .join("\n\n")

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "content", task, input, instructions: composedInstructions, modelId }),
      })
      if (!res.ok) throw new Error("Request failed")
      const data = (await res.json()) as { text: string }
      setOutput(data.text)
    } catch {
      setError("Не удалось сгенерировать письмо. Попробуй ещё раз.")
    } finally {
      setGenerating(false)
    }
  }

  async function save() {
    if (!company || !output) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: company.id,
          personId: personId || undefined,
          analysisId: analysisId || undefined,
          contentType,
          instructions,
          language,
          guidance,
          text: output,
        }),
      })
      if (!res.ok) throw new Error("Save failed")
      const data = (await res.json()) as { email: { id: string } }
      router.push(`/emails/${data.email.id}`)
      router.refresh()
    } catch {
      setError("Не удалось сохранить письмо. Попробуй ещё раз.")
      setSaving(false)
    }
  }

  if (companies.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <p className="text-sm font-medium text-foreground">Сначала создай компанию</p>
        <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
          Письма пишутся на основе компании (и, по желанию, человека и анализа).
        </p>
        <Link
          href="/companies/new"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
        >
          <Building2 className="h-4 w-4" aria-hidden="true" />
          Создать компанию
        </Link>
      </div>
    )
  }

  const activeType = CONTENT_TYPES.find((t) => t.key === contentType)

  return (
    <div className="flex flex-col gap-5">
      {/* Source: company + optional analysis + optional person */}
      <section className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/40 p-4 sm:grid-cols-3 sm:p-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email-company" className="text-xs font-semibold tracking-tight text-foreground">
            Компания
          </label>
          <select
            id="email-company"
            value={companyId}
            onChange={(e) => onCompanyChange(e.target.value)}
            className={inputClass}
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.industry ? ` — ${c.industry}` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email-analysis" className="text-xs font-semibold tracking-tight text-foreground">
            Анализ <span className="font-normal text-muted-foreground">(по желанию)</span>
          </label>
          <select
            id="email-analysis"
            value={analysisId}
            onChange={(e) => onAnalysisChange(e.target.value)}
            className={inputClass}
            disabled={companyAnalyses.length === 0}
          >
            <option value="">{companyAnalyses.length === 0 ? "Нет анализов" : "Без анализа"}</option>
            {companyAnalyses.map((a) => (
              <option key={a.id} value={a.id}>
                Анализ от {new Date(a.createdAt).toLocaleDateString("ru-RU")}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email-person" className="text-xs font-semibold tracking-tight text-foreground">
            Кому <span className="font-normal text-muted-foreground">(по желанию)</span>
          </label>
          <select
            id="email-person"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            className={inputClass}
            disabled={availablePeople.length === 0}
          >
            <option value="">
              {availablePeople.length === 0 ? "Нет людей" : "Все люди лида"}
            </option>
            {availablePeople.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.role ? ` — ${p.role}` : ""}
              </option>
            ))}
          </select>
        </div>
      </section>

      <ModelSelector value={modelId} onChange={setModelId} />

      {/* Format picker */}
      <section className="flex flex-col gap-2">
        <span className="text-sm font-semibold tracking-tight">Формат</span>
        <div className="flex flex-wrap gap-2">
          {VISIBLE_CONTENT_TYPES.map((type) => {
            const Icon = ICONS[type.key]
            const active = contentType === type.key
            return (
              <button
                key={type.key}
                type="button"
                onClick={() => setContentType(type.key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  active
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {type.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Steering */}
      <section className="flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:p-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email-instructions" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Инструкция для этого письма <span className="font-normal text-muted-foreground">(по желанию)</span>
          </label>
          <textarea
            id="email-instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="напр. до 120 слов, крючок в первой строке, один чёткий CTA."
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email-template" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            Шаблон <span className="font-normal text-muted-foreground">(по желанию)</span>
          </label>
          <select
            id="email-template"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className={inputClass}
            disabled={templates.length === 0}
          >
            <option value="">{templates.length === 0 ? "Нет шаблонов" : "Без шаблона"}</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {selectedTemplate ? (
            <p className="line-clamp-3 whitespace-pre-wrap rounded-lg border border-border bg-background px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
              {selectedTemplate.text}
            </p>
          ) : (
            <p className="text-[11px] leading-snug text-muted-foreground">
              AI возьмёт шаблон за основу и адаптирует его под выбранную компанию и человека.
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email-language" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Languages className="h-3.5 w-3.5" aria-hidden="true" />
              Язык
            </label>
            <select
              id="email-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={inputClass}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === "Auto" ? "Авто (по вводу)" : lang}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email-guidance" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Тон / стиль <span className="font-normal text-muted-foreground">(по желанию)</span>
            </label>
            <input
              id="email-guidance"
              value={guidance}
              onChange={(e) => setGuidance(e.target.value)}
              placeholder="напр. деловой, без хайпа"
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={generating || !company}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Пишу…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {output ? "Сгенерировать заново" : "Сгенерировать письмо"}
            </>
          )}
        </button>
      </section>

      {error ? <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent-foreground">{error}</p> : null}

      {/* Output */}
      {generating && !output ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Готовлю {activeType?.label.toLowerCase()}…
        </div>
      ) : output ? (
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {activeType?.label}
            </span>
            <CopyButton text={output} label="Копировать" />
          </div>
          <div className="whitespace-pre-wrap">
            <FormattedText text={output} />
          </div>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Сохраняю…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" aria-hidden="true" />
                Сохранить письмо
              </>
            )}
          </button>
        </section>
      ) : null}
    </div>
  )
}
