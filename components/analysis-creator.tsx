"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Wand2, Ban, ListFilter, Languages, Sparkles, Globe, Building2, MapPin, Users } from "lucide-react"
import {
  ANALYSIS_SECTIONS,
  EMPTY_ANALYSIS_CONFIG,
  LANGUAGES,
  buildPromptInput,
  type AnalysisConfig,
  type AnalysisResult,
  type Lead,
} from "@/lib/types"
import { DEFAULT_MODEL_ID } from "@/lib/models"
import { FieldCell, inputClass } from "./field-cell"
import { AnalysisResults } from "./analysis-results"
import { ModelSelector } from "./model-selector"

interface ConfigField {
  key: keyof AnalysisConfig
  label: string
  placeholder: string
  hint?: string
  type?: "input" | "textarea"
  full?: boolean
}

const EXCLUSION_FIELDS: ConfigField[] = [
  { key: "excludeIndustries", label: "Отрасли не берём", placeholder: "напр. гемблинг, оружие, крипто-скам" },
  { key: "excludeRegions", label: "Регионы не берём", placeholder: "напр. РФ, СНГ, санкционные страны" },
  { key: "excludeSizes", label: "Размеры не берём", placeholder: "напр. <10 сотрудников, enterprise 5000+" },
  {
    key: "stopFactors",
    label: "Стоп-факторы",
    hint: "Если встречается — лид отбраковывается до расчёта приоритета.",
    placeholder: "напр. нет бюджета, уже наш клиент, банкротство…",
    type: "textarea",
    full: true,
  },
]

const PRIORITY_FIELDS: ConfigField[] = [
  {
    key: "mustHaveSignals",
    label: "Обязательные сигналы",
    hint: "Без них высокий приоритет невозможен.",
    placeholder: "напр. недавний раунд, найм в продажи, новый рынок…",
    type: "textarea",
    full: true,
  },
  {
    key: "priorityCriteria",
    label: "Что повышает приоритет",
    placeholder: "напр. совпадение с ICP, боль в открытых источниках…",
    type: "textarea",
    full: true,
  },
  {
    key: "priorityThreshold",
    label: "Порог приоритета",
    placeholder: "напр. ≥ 3 подтверждённых сигнала для «высокого»",
  },
]

export function AnalysisCreator({ leads, preselectedLeadId }: { leads: Lead[]; preselectedLeadId?: string }) {
  const router = useRouter()
  const [leadId, setLeadId] = useState<string>(
    preselectedLeadId && leads.some((l) => l.id === preselectedLeadId) ? preselectedLeadId : leads[0]?.id ?? "",
  )
  const [config, setConfig] = useState<AnalysisConfig>(EMPTY_ANALYSIS_CONFIG)
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID)
  const [result, setResult] = useState<Partial<AnalysisResult>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lead = useMemo(() => leads.find((l) => l.id === leadId), [leads, leadId])

  function update(key: keyof AnalysisConfig, value: string) {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  async function runAnalysis() {
    if (!lead) return
    setLoading(true)
    setError(null)
    setResult({})

    const input = buildPromptInput(lead, config)

    try {
      const responses = await Promise.all(
        ANALYSIS_SECTIONS.map(async (section) => {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind: "section", task: section.task, input, modelId }),
          })
          if (!res.ok) throw new Error("Request failed")
          const data = (await res.json()) as { text: string }
          return [section.key, data.text] as const
        }),
      )
      const fullResult = Object.fromEntries(responses) as AnalysisResult
      setResult(fullResult)

      const saveRes = await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id, config, result: fullResult }),
      })
      if (!saveRes.ok) throw new Error("Save failed")
      const saved = (await saveRes.json()) as { analysis: { id: string } }
      router.push(`/analyses/${saved.analysis.id}`)
      router.refresh()
    } catch {
      setError("Не удалось собрать анализ. Попробуй ещё раз.")
      setLoading(false)
    }
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <p className="text-sm font-medium text-foreground">Сначала создай лид</p>
        <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
          Анализ строится на данных лида — без него не с чем работать.
        </p>
        <Link
          href="/leads/new"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
        >
          <Users className="h-4 w-4" aria-hidden="true" />
          Создать лид
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Lead selector */}
      <section className="flex flex-col gap-2">
        <label htmlFor="analysis-lead" className="text-sm font-semibold tracking-tight">
          Лид для анализа
        </label>
        <select
          id="analysis-lead"
          value={leadId}
          onChange={(e) => setLeadId(e.target.value)}
          className={inputClass}
        >
          {leads.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
              {l.industry ? ` — ${l.industry}` : ""}
            </option>
          ))}
        </select>
        {lead ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border bg-muted/40 px-3.5 py-2.5 text-xs text-muted-foreground">
            {lead.website ? (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" aria-hidden="true" />
                {lead.website}
              </span>
            ) : null}
            {lead.industry ? (
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" aria-hidden="true" />
                {lead.industry}
              </span>
            ) : null}
            {lead.targetMarket ? (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-accent" aria-hidden="true" />
                {lead.targetMarket}
              </span>
            ) : null}
          </div>
        ) : null}
      </section>

      <ModelSelector value={modelId} onChange={setModelId} />

      {/* Config */}
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-4 sm:p-5">
        <div className="rounded-lg border-l-2 border-accent bg-accent/10 p-3.5">
          <div className="mb-3 flex items-start gap-2">
            <Ban className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" aria-hidden="true" />
            <p className="text-xs font-semibold text-accent-foreground">
              Исключения — режутся до расчёта приоритета
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {EXCLUSION_FIELDS.map((f) => (
              <FieldCell
                key={f.key}
                id={f.key}
                label={f.label}
                value={config[f.key]}
                onValueChange={(v) => update(f.key, v)}
                placeholder={f.placeholder}
                hint={f.hint}
                type={f.type}
                full={f.full}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-primary" aria-hidden="true" />
            <p className="text-xs font-semibold text-foreground">Приоритизация</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PRIORITY_FIELDS.map((f) => (
              <FieldCell
                key={f.key}
                id={f.key}
                label={f.label}
                value={config[f.key]}
                onValueChange={(v) => update(f.key, v)}
                placeholder={f.placeholder}
                hint={f.hint}
                type={f.type}
                full={f.full}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-lg border border-primary/25 bg-primary/5 p-3.5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="analysis-language" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Languages className="h-3.5 w-3.5" aria-hidden="true" />
              Язык ответа
            </label>
            <select
              id="analysis-language"
              value={config.language}
              onChange={(e) => update("language", e.target.value)}
              className={inputClass}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === "Auto" ? "Авто (по вводу)" : lang}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="analysis-guidance" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Инструкция агенту
            </label>
            <textarea
              id="analysis-guidance"
              value={config.guidance}
              onChange={(e) => update("guidance", e.target.value)}
              placeholder="напр. Деловой тон. Фокус на боли ЛПР. Нет факта — помечай гипотезой."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={runAnalysis}
          disabled={loading || !lead}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Собираю разбор…
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" aria-hidden="true" />
              Создать анализ
            </>
          )}
        </button>
      </section>

      {error ? <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent-foreground">{error}</p> : null}

      {loading || Object.keys(result).length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold tracking-tight">Разбор лида</h2>
          <AnalysisResults result={result} loading={loading} />
        </section>
      ) : null}
    </div>
  )
}
