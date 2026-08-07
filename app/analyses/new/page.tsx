import { SiteHeader } from "@/components/site-header"
import { PageHeader } from "@/components/page-header"
import { AnalysisCreator } from "@/components/analysis-creator"
import { readLeads } from "@/lib/leads-store"

export const dynamic = "force-dynamic"

export default async function NewAnalysisPage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string }>
}) {
  const [{ leadId }, leads] = await Promise.all([searchParams, readLeads()])

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        <PageHeader
          title="Новый анализ"
          subtitle="Выбери лид и настрой исключения, приоритеты и агента — разбор соберётся на данных лида."
          backHref="/analyses"
          backLabel="К анализам"
        />
        <AnalysisCreator leads={leads} preselectedLeadId={leadId} />
      </main>
    </div>
  )
}
