"use client"

import { useState } from "react"
import { Loader2, Wand2, Sparkles, Languages, Info, Ban, ListFilter } from "lucide-react"
import { LANGUAGES, type CompanyInput } from "@/lib/types"

interface Field {
  key: keyof CompanyInput
  label: string
  hint?: string
  placeholder: string
  type?: "input" | "textarea"
  full?: boolean
}

type TabKey = "main" | "exclusions" | "priority"

const TABS: { key: TabKey; label: string; icon: typeof Info }[] = [
  { key: "main", label: "Основное", icon: Info },
  { key: "exclusions", label: "Исключения", icon: Ban },
  { key: "priority", label: "Приоритизация", icon: ListFilter },
]

const MAIN_FIELDS: Field[] = [
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

const EXCLUSION_FIELDS: Field[] = [
  { key: "excludeIndustries", label: "Отрасли не берём", placeholder: "напр. гемблинг, оружие, крипто-скам" },
  { key: "excludeRegions", label: "Регионы не берём", placeholder: "напр. РФ, СНГ, страны с санкциями" },
  { key: "excludeSizes", label: "Размеры не берём", placeholder: "напр. <10 сотрудников, enterprise 5000+" },
  {
    key: "stopFactors",
    label: "Стоп-факторы",
    hint: "Если встречается — лид сразу отбраковывается, приоритет не считаем.",
    placeholder: "напр. нет бюджета, уже наш клиент, банкротство, судебные иски…",
    type: "textarea",
    full: true,
  },
]

const PRIORITY_FIELDS: Field[] = [
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
    placeholder: "напр. совпадение с ICP, боль в открытых источниках, кейс из профиля…",
    type: "textarea",
    full: true,
  },
  {
    key: "priorityThreshold",
    label: "Порог приоритета",
    hint: "Настройка, а не константа в коде.",
    placeholder: "напр. ≥ 3 подтверждённых сигнала для «высокого»",
  },
]

interface CompanyFormProps {
  input: CompanyInput
  onChange: (input: CompanyInput) => void
  onSubmit: () => void
  loading: boolean
}

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"

export function CompanyForm({ input, onChange, onSubmit, loading }: CompanyFormProps) {
  const [tab, setTab] = useState<TabKey>("main")

  function update(key: keyof CompanyInput, value: string) {
    onChange({ ...input, [key]: value })
  }

  function Cell({ field }: { field: Field }) {
    return (
      <div className={`flex flex-col gap-1.5 rounded-lg border border-border bg-card p-3.5 ${field.full ? "sm:col-span-2" : ""}`}>
        <label htmlFor={field.key} className="text-xs font-semibold tracking-tight text-foreground">
          {field.label}
        </label>
        {field.hint ? <p className="-mt-1 text-[11px] leading-snug text-muted-foreground">{field.hint}</p> : null}
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
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="rounded-xl border border-border bg-muted/40 p-4 sm:p-5"
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
        {TABS.map((t) => {
          const active = tab === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-current={active}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <t.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Panels */}
      <div className="mt-4">
        {tab === "main" ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {MAIN_FIELDS.map((f) => (
              <Cell key={f.key} field={f} />
            ))}
          </div>
        ) : null}

        {tab === "exclusions" ? (
          <div className="rounded-lg border-l-2 border-accent bg-accent/10 p-3.5">
            <div className="mb-3 flex items-start gap-2">
              <Ban className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" aria-hidden="true" />
              <p className="text-xs leading-snug text-accent-foreground">
                <span className="font-semibold">Фильтры исключения.</span> Самый важный блок: то, что сюда попало, режется
                до расчёта приоритета — агент не тратит на это разбор.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {EXCLUSION_FIELDS.map((f) => (
                <Cell key={f.key} field={f} />
              ))}
            </div>
          </div>
        ) : null}

        {tab === "priority" ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PRIORITY_FIELDS.map((f) => (
              <Cell key={f.key} field={f} />
            ))}
          </div>
        ) : null}
      </div>

      {/* Language + guidance (always visible) */}
      <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg border border-primary/25 bg-primary/5 p-3.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="language" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Languages className="h-3.5 w-3.5" aria-hidden="true" />
            Язык ответа
          </label>
          <select
            id="language"
            value={input.language}
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
          <label htmlFor="guidance" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Инструкция агенту
          </label>
          <textarea
            id="guidance"
            value={input.guidance}
            onChange={(e) => update("guidance", e.target.value)}
            placeholder="напр. Уверенный, деловой тон. Фокус на боли ЛПР, без хайпа. Нет факта — помечай гипотезой."
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !input.name.trim()}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
    </form>
  )
}
