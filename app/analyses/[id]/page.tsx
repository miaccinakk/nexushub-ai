import Link from "next/link"
import { notFound } from "next/navigation"
import { Mail, Building2, User, Clock } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { PageHeader } from "@/components/page-header"
import { AnalysisResults } from "@/components/analysis-results"
import { getAnalysis } from "@/lib/analyses-store"
import { formatDate } from "@/lib/format"
import type { AnalysisConfig } from "@/lib/types"

export const dynamic = "force-dynamic"

const CONFIG_FIELDS: { key: keyof AnalysisConfig; label: string }[] = [
  { key: "excludeIndustries", label: "Отрасли не берём" },
  { key: "excludeRegions", label: "Регионы не берём" },
  { key: "excludeSizes", label: "Размеры не берём" },
  { key: "stopFactors", label: "Стоп-факторы" },
  { key: "mustHaveSignals", label: "Обязательные сигналы" },
  { key: "priorityCriteria", label: "Что повышает приоритет" },
  { key: "priorityThreshold", label: "Порог приоритета" },
  { key: "guidance", label: "Инструкция агенту" },
]

export default async function AnalysisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const analysis = await getAnalysis(id)
  if (!analysis) notFound()

  const activeConfig = CONFIG_FIELDS.filter((f) => analysis.config[f.key]?.trim())

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        <PageHeader
          title={`Анализ: ${analysis.companyName}`}
          backHref="/analyses"
          backLabel="К анализам"
          action={
            <Link
              href={`/emails/new?companyId=${analysis.companyId}&analysisId=${analysis.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Письмо на основе анализа
            </Link>
          }
        />

        {/* Lead composition: company + people */}
        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            <Link
              href={`/companies/${analysis.companyId}`}
              className="inline-flex items-center gap-1.5 text-primary transition-colors hover:opacity-80"
            >
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              {analysis.companyName}
            </Link>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDate(analysis.createdAt)}
            </span>
            {analysis.config.language && analysis.config.language !== "Auto" ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {analysis.config.language}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold tracking-tight text-foreground">
              Люди в лиде ({analysis.personIds.length})
            </span>
            {analysis.personIds.length === 0 ? (
              <p className="text-sm text-muted-foreground">Анализ собран без людей — только по компании.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {analysis.personIds.map((pid, i) => (
                  <li key={pid}>
                    <Link
                      href={`/people/${pid}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <User className="h-3 w-3" aria-hidden="true" />
                      {analysis.personNames[i] ?? "Человек"}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {activeConfig.length > 0 ? (
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold tracking-tight">Настройки разбора</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {activeConfig.map((f) => (
                <div key={f.key} className="flex flex-col gap-1">
                  <dt className="text-xs font-semibold tracking-tight text-foreground">{f.label}</dt>
                  <dd className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {analysis.config[f.key]}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold tracking-tight">Разбор лида</h2>
          <AnalysisResults result={analysis.result} loading={false} />
        </section>
      </main>
    </div>
  )
}
