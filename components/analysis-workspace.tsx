"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Globe, MapPin, Building2, Check } from "lucide-react"
import { ANALYSIS_SECTIONS, type AnalysisResult, type CompanyInput } from "@/lib/types"
import { DEFAULT_MODEL_ID } from "@/lib/models"
import { CompanyForm } from "./company-form"
import { AnalysisResults } from "./analysis-results"
import { ContentGenerator } from "./content-generator"
import { ModelSelector } from "./model-selector"

const EMPTY_INPUT: CompanyInput = {
  name: "",
  website: "",
  industry: "",
  targetMarket: "",
  productDescription: "",
  businessGoals: "",
  additionalInfo: "",
  links: "",
  excludeIndustries: "",
  excludeRegions: "",
  excludeSizes: "",
  stopFactors: "",
  mustHaveSignals: "",
  priorityCriteria: "",
  priorityThreshold: "",
  guidance: "",
  language: "Auto",
}

export function AnalysisWorkspace({ initialInput }: { initialInput?: CompanyInput }) {
  const [input, setInput] = useState<CompanyInput>(initialInput ?? EMPTY_INPUT)
  const [result, setResult] = useState<Partial<AnalysisResult>>({})
  const [loading, setLoading] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID)

  async function runAnalysis() {
    setLoading(true)
    setHasRun(true)
    setError(null)
    setSaved(false)
    setResult({})

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

      // Persist the completed analysis to data/analyses.json.
      try {
        await fetch("/api/analyses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input, result: fullResult }),
        })
        setSaved(true)
      } catch {
        // Non-blocking: analysis still shows even if saving fails.
      }
    } catch {
      setError("Failed to generate the analysis. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          На главную
        </Link>
        <div className="mt-3 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {input.name ? input.name : "Новый анализ лида"}
          </h1>
          {input.name ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {input.website ? (
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                  {input.website}
                </span>
              ) : null}
              {input.industry ? (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {input.industry}
                </span>
              ) : null}
              {input.targetMarket ? (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  {input.targetMarket}
                </span>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-pretty">
              Заполни данные лида по вкладкам ниже — агент соберёт разбор с сигналами, приоритетом и текстом.
            </p>
          )}
        </div>
      </div>

      <ModelSelector value={modelId} onChange={setModelId} />

      <CompanyForm input={input} onChange={setInput} onSubmit={runAnalysis} loading={loading} />

      {error ? <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p> : null}

      {hasRun ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-tight">Разбор лида</h2>
            {saved ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <Check className="h-3 w-3" aria-hidden="true" />
                Сохранено на главной
              </span>
            ) : null}
          </div>
          <AnalysisResults result={result} loading={loading} />
        </section>
      ) : null}

      {hasRun && !loading && Object.keys(result).length > 0 ? (
        <ContentGenerator input={input} modelId={modelId} />
      ) : null}
    </div>
  )
}
