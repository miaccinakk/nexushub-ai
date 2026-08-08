import { SiteHeader } from "@/components/site-header"
import { PageHeader } from "@/components/page-header"
import { CompanyForm } from "@/components/company-form"

export default function NewCompanyPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
        <PageHeader
          title="Новая компания"
          subtitle="Заполни данные компании. В анализе ты объединишь её с нужными людьми."
          backHref="/companies"
          backLabel="К компаниям"
        />
        <CompanyForm />
      </main>
    </div>
  )
}
