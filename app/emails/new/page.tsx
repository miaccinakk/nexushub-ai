import { SiteHeader } from "@/components/site-header"
import { PageHeader } from "@/components/page-header"
import { EmailCreator } from "@/components/email-creator"
import { readCompanies } from "@/lib/companies-store"
import { readPeople } from "@/lib/people-store"
import { readAnalyses } from "@/lib/analyses-store"

export const dynamic = "force-dynamic"

export default async function NewEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string; analysisId?: string }>
}) {
  const [{ companyId, analysisId }, companies, people, analyses] = await Promise.all([
    searchParams,
    readCompanies(),
    readPeople(),
    readAnalyses(),
  ])

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
        <PageHeader
          title="Новое письмо"
          subtitle="Выбери компанию и, при желании, анализ и человека. Дальше — формат, инструкции и генерация."
          backHref="/emails"
          backLabel="К письмам"
        />
        <EmailCreator
          companies={companies}
          people={people}
          analyses={analyses}
          preselectedCompanyId={companyId}
          preselectedAnalysisId={analysisId}
        />
      </main>
    </div>
  )
}
