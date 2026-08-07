import { SiteHeader } from "@/components/site-header"
import { PageHeader } from "@/components/page-header"
import { EmailCreator } from "@/components/email-creator"
import { readLeads } from "@/lib/leads-store"
import { readAnalyses } from "@/lib/analyses-store"

export const dynamic = "force-dynamic"

export default async function NewEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string; analysisId?: string }>
}) {
  const [{ leadId, analysisId }, leads, analyses] = await Promise.all([
    searchParams,
    readLeads(),
    readAnalyses(),
  ])

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
        <PageHeader
          title="Новое письмо"
          subtitle="Выбери лид и, при желании, его анализ. Дальше — формат, инструкции и генерация."
          backHref="/emails"
          backLabel="К письмам"
        />
        <EmailCreator
          leads={leads}
          analyses={analyses}
          preselectedLeadId={leadId}
          preselectedAnalysisId={analysisId}
        />
      </main>
    </div>
  )
}
