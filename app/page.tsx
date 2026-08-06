import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SavedAnalyses } from "@/components/saved-analyses"
import { readAnalyses } from "@/lib/analyses-store"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const analyses = await readAnalyses()

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto flex max-w-5xl flex-col px-4 sm:px-6">
        <section className="flex flex-col items-center py-20 text-center sm:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Lead Research Agent</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
            Разбор лида, который менеджер <span className="text-primary">реально возьмёт в работу</span>.
          </h1>
          <Link
            href="/analysis/new"
            className="mt-10 inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 sm:text-lg"
          >
            Создать анализ
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </section>

        <section className="flex flex-col gap-4 pb-20">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-tight">Ранее разобранные лиды</h2>
            {analyses.length > 0 ? (
              <span className="font-mono text-xs text-muted-foreground">{analyses.length}</span>
            ) : null}
          </div>
          <SavedAnalyses analyses={analyses} />
        </section>
      </main>
    </div>
  )
}
