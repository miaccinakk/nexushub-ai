"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Loader2,
  Wand2,
  Ban,
  ListFilter,
  Languages,
  Sparkles,
  Globe,
  Layers,
  MapPin,
  Building2,
  User,
  Briefcase,
  Check,
} from "lucide-react"
import {
  ANALYSIS_SECTIONS,
  EMPTY_ANALYSIS_CONFIG,
  LANGUAGES,
  buildPromptInput,
  type AnalysisConfig,
  type AnalysisResult,
  type Company,
  type Person,
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

export function AnalysisCreator({
  companies,
  people,
  preselectedCompanyId,
  preselectedPersonId,
}: {
  companies: Company[]
  people: Person[]
  preselectedCompanyId?: string
  preselectedPersonId?: string
}) {
  const router = useRouter()
  const [companyId, setCompanyId] = useState<string>(
    preselectedCompanyId && companies.some((c) => c.id === preselectedCompanyId)
      ? preselectedCompanyId
      : companies[0]?.id ?? "",
  )
  const [personIds, setPersonIds] = useState<string[]>(
    preselectedPersonId && people.some((p) => p.id === preselectedPersonId) ? [preselectedPersonId] : [],
  )
  const [config, setConfig] = useState<AnalysisConfig>(EMPTY_ANALYSIS_CONFIG)
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID)
  const [result, setResult] = useState<Partial<AnalysisResult>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const company = useMemo(() => companies.find((c) => c.id === companyId), [companies, companyId])
  const selectedPeople = useMemo(
    () => people.filter((p) => personIds.includes(p.id)),
    [people, personIds],
  )

  function update(key: keyof AnalysisConfig, value: string) {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  function togglePerson(id: string) {
    setPersonIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  async function runAnalysis() {
    if (!company) return
    setLoading(true)
    setError(null)
    setResult({})

    const input = buildPromptInput(company, selectedPeople, config)

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
        body: JSON.stringify({ companyId: company.id, personIds, config, result: fullResult }),
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

  if (companies.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <p className="text-sm font-medium text-foreground">Сначала создай компанию</p>
        <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
          Анализ строится на компании — без неё не с чем работать.
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

  return (
    <div className="flex flex-col gap-6">
      {/* Company selector */}
      <section className="flex flex-col gap-2">
        <label htmlFor="analysis-company" className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
          <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
          Компания
        </label>
        <select
          id="analysis-company"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className={inputClass}
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.industry ? ` — ${c.industry}` : ""}
            </option>
          ))}
        </select>
        {company ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border bg-muted/40 px-3.5 py-2.5 text-xs text-muted-foreground">
            {company.website ? (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" aria-hidden="true" />
                {company.website}
              </span>
            ) : null}
            {company.industry ? (
              <span className="flex items-center gap-1">
                <Layers className="h-3 w-3" aria-hidden="true" />
                {company.industry}
              </span>
            ) : null}
            {company.targetMarket ? (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-accent" aria-hidden="true" />
                {company.targetMarket}
              </span>
            ) : null}
          </div>
        ) : null}
      </section>

      {/* People multi-select */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
            <User className="h-4 w-4 text-primary" aria-hidden="true" />
            Люди
            <span className="rounded-full bg-border/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              {personIds.length}
            </span>
          </span>
          <Link
            href="/people/new"
            className="text-xs font-medium text-primary transition-colors hover:opacity-80"
          >
            + Новый человек
          </Link>
        </div>

        {people.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-card/50 px-3.5 py-4 text-center text-sm text-muted-foreground">
            Людей пока нет. Можно собрать анализ и без них, но лучше{" "}
            <Link href="/people/new" className="text-primary hover:opacity-80">
              добавить человека
            </Link>
            .
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {people.map((p) => {
              const active = personIds.includes(p.id)
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => togglePerson(p.id)}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        active ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"
                      }`}
                    >
                      {active ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-card-foreground">{p.name}</span>
                      {p.role ? (
                        <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <Briefcase className="h-3 w-3" aria-hidden="true" />
                          {p.role}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
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
          disabled={loading || !company}
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
