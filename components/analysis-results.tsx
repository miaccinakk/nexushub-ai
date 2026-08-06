import { BarChart3, Users, Crosshair, MessageSquareQuote, TrendingUp, Lightbulb, Loader2 } from "lucide-react"
import { ANALYSIS_SECTIONS, type AnalysisResult, type AnalysisSectionKey } from "@/lib/types"
import { FormattedText } from "./formatted-text"
import { CopyButton } from "./copy-button"

const ICONS: Record<AnalysisSectionKey, typeof BarChart3> = {
  "market-overview": BarChart3,
  icp: Crosshair,
  audience: Users,
  messaging: MessageSquareQuote,
  "sales-angles": TrendingUp,
  "content-ideas": Lightbulb,
}

interface AnalysisResultsProps {
  result: Partial<AnalysisResult>
  loading: boolean
}

export function AnalysisResults({ result, loading }: AnalysisResultsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {ANALYSIS_SECTIONS.map((section, index) => {
        const Icon = ICONS[section.key]
        const content = result[section.key]
        const isPending = loading && !content

        return (
          <section
            key={section.key}
            className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                </span>
                <h3 className="text-sm font-semibold tracking-tight text-card-foreground">
                  <span className="mr-1.5 text-muted-foreground">{index + 1}.</span>
                  {section.title}
                </h3>
              </div>
              {content ? <CopyButton text={content} /> : null}
            </div>

            {isPending ? (
              <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Analyzing…
              </div>
            ) : content ? (
              <FormattedText text={content} />
            ) : (
              <p className="py-6 text-sm text-muted-foreground">Waiting to generate.</p>
            )}
          </section>
        )
      })}
    </div>
  )
}
