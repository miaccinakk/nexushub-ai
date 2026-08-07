import Link from "next/link"
import { Users, LineChart, Mail } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { DashboardFeed } from "@/components/dashboard-feed"
import { readLeads } from "@/lib/leads-store"
import { readAnalyses } from "@/lib/analyses-store"
import { readEmails } from "@/lib/emails-store"

export const dynamic = "force-dynamic"

const QUICK_ACTIONS = [
  { href: "/leads/new", label: "Новый лид", icon: Users },
  { href: "/analyses/new", label: "Новый анализ", icon: LineChart },
  { href: "/emails/new", label: "Новое письмо", icon: Mail },
]

export default async function HomePage() {
  const [leads, analyses, emails] = await Promise.all([readLeads(), readAnalyses(), readEmails()])

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-tight text-balance">Дашборд</h1>
            <p className="text-sm text-muted-foreground text-pretty">
              Лиды, их анализ и письма — всё в одном месте.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon
              return (
                <Link
                  key={a.href}
                  href={a.href}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted"
                >
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  {a.label}
                </Link>
              )
            })}
          </div>
        </section>

        <DashboardFeed leads={leads} analyses={analyses} emails={emails} />
      </main>
    </div>
  )
}
