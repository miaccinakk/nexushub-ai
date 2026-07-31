import Link from "next/link"
import { Plus, Building2, Target, FileText } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CompanyCard } from "@/components/company-card"
import { getCompanies } from "@/lib/companies"

export default function DashboardPage() {
  const companies = getCompanies()

  const stats = [
    { label: "Companies tracked", value: companies.length, icon: Building2 },
    { label: "Markets covered", value: new Set(companies.map((c) => c.targetMarket)).size, icon: Target },
    { label: "Analyses ready", value: companies.filter((c) => c.status === "Analyzed").length, icon: FileText },
  ]

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-medium uppercase tracking-wider text-accent">AI Business Intelligence</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">
                Turn company data into ready-to-send B2B outreach
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                Analyze target accounts, build ideal customer profiles, and generate personalized content in seconds.
              </p>
            </div>
            <Link
              href="/analysis/new"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New company
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <stat.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xl font-semibold tracking-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight">Companies</h2>
            <span className="text-xs text-muted-foreground">{companies.length} total</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
