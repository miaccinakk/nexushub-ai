import { SiteHeader } from "@/components/site-header"
import { PageHeader } from "@/components/page-header"
import { NewLeadForm } from "@/components/new-lead-form"

export default function NewLeadPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
        <PageHeader
          title="Новый лид"
          subtitle="Заполни данные компании. Это первый уровень — анализ и письма создаются на его основе."
          backHref="/leads"
          backLabel="К лидам"
        />
        <NewLeadForm />
      </main>
    </div>
  )
}
