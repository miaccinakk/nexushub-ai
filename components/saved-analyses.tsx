"use client"

import { useState } from "react"
import { ChevronDown, Globe, Building2, MapPin, Clock } from "lucide-react"
import { ANALYSIS_SECTIONS, type SavedAnalysis } from "@/lib/types"
import { FormattedText } from "./formatted-text"
import { CopyButton } from "./copy-button"

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

function AnalysisCard({ analysis }: { analysis: SavedAnalysis }) {
  const [open, setOpen] = useState(false)

  return (
    <li className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="truncate text-sm font-semibold tracking-tight text-card-foreground">{analysis.name}</span>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {analysis.website ? (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" aria-hidden="true" />
                {analysis.website}
              </span>
            ) : null}
            {analysis.industry ? (
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" aria-hidden="true" />
                {analysis.industry}
              </span>
            ) : null}
            {analysis.targetMarket ? (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-accent" aria-hidden="true" />
                {analysis.targetMarket}
              </span>
            ) : null}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {formatDate(analysis.createdAt)}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="grid grid-cols-1 gap-4 border-t border-border bg-muted/30 p-5 lg:grid-cols-2">
          {ANALYSIS_SECTIONS.map((section, index) => {
            const content = analysis.result[section.key]
            if (!content) return null
            return (
              <section key={section.key} className="flex flex-col rounded-lg border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold tracking-tight text-card-foreground">
                    <span className="mr-1.5 text-muted-foreground">{index + 1}.</span>
                    {section.title}
                  </h4>
                  <CopyButton text={content} />
                </div>
                <FormattedText text={content} />
              </section>
            )
          })}
        </div>
      ) : null}
    </li>
  )
}

export function SavedAnalyses({ analyses }: { analyses: SavedAnalysis[] }) {
  if (analyses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <p className="text-sm font-medium text-foreground">Пока нет сохранённых разборов</p>
        <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
          Создай первый анализ — он автоматически сохранится сюда.
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {analyses.map((analysis) => (
        <AnalysisCard key={analysis.id} analysis={analysis} />
      ))}
    </ul>
  )
}
