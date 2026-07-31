"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Globe, MapPin, Building2 } from "lucide-react"
import { ANALYSIS_SECTIONS, type AnalysisResult, type CompanyInput } from "@/lib/types"
import { CompanyForm } from "./company-form"
import { AnalysisResults } from "./analysis-results"
import { ContentGenerator } from "./content-generator"

const EMPTY_INPUT: CompanyInput = {
  name: "",
  website: "",
  industry: "",
  targetMarket: "",
  productDescription: "",
  businessGoals: "",
  additionalInfo: "",
  links: "",
  guidance: "",
}

export function AnalysisWorkspace({ initialInput }: { initialInput?: CompanyInput }) {
  const [input, setInput] = useState<CompanyInput>(initialInput ?? EMPTY_INPUT)
  const [result, setResult] = useState<Partial<AnalysisResult>>({})
  const [loading, setLoading] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function runAnalysis() {
    setLoading(true)
    setHasRun(true)
    setError(null)
    setResult({})

    try {
      const responses = await Promise.all(
        ANALYSIS_SECTIONS.map(async (section) => {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind: "section", task: section.task, input }),
          })
          if (!res.ok) throw new Error("Request failed")
          const data = (await res.json()) as { text: string }
          return [section.key, data.text] as const
        }),
      )
      setResult(Object.fromEntries(responses) as AnalysisResult)
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
          Back to companies
        </Link>
        <div className="mt-3 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {input.name ? input.name : "New Company Analysis"}
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
              Fill in the company details below and let AI build the full go-to-market analysis.
            </p>
          )}
        </div>
      </div>

      <CompanyForm input={input} onChange={setInput} onSubmit={runAnalysis} loading={loading} />

      {error ? <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p> : null}

      {hasRun ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold tracking-tight">AI Analysis</h2>
          <AnalysisResults result={result} loading={loading} />
        </section>
      ) : null}

      {hasRun && !loading && Object.keys(result).length > 0 ? <ContentGenerator input={input} /> : null}
    </div>
  )
}
