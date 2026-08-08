import Link from "next/link"
import { Building2, Plus, Globe, Layers, Clock, ArrowUpRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { PageHeader } from "@/components/page-header"
import { readCompanies } from "@/lib/companies-store"
import { formatDate } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function CompaniesPage() {
  const companies = await readCompanies()

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <PageHeader
          title="Компании"
          subtitle="Карточки компаний: сайт, отрасль, продукт и особенности. В анализе к ним подключаются люди."
          action={
            <Link
              href="/companies/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Новая компания
            </Link>
          }
        />

        {companies.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-medium text-foreground">Пока нет ни одной компании</p>
            <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
              Создай компанию — а в анализе объединишь её с нужными людьми.
            </p>
            <Link
              href="/companies/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Создать компанию
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {companies.map((company) => (
              <li key={company.id}>
                <Link
                  href={`/companies/${company.id}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="truncate text-sm font-semibold tracking-tight text-card-foreground">
                        {company.name}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {company.website ? (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" aria-hidden="true" />
                            {company.website}
                          </span>
                        ) : null}
                        {company.industry ? (
                          <span className="flex items-center gap-1">
                            <Layers className="h-3 w-3" aria-hidden="true" />
                            {company.industry}
                          </span>
                        ) : null}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {formatDate(company.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
