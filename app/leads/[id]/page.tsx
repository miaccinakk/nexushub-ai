import Link from "next/link"
import { notFound } from "next/navigation"
import { LineChart, Mail, Globe, Building2, MapPin, Clock, ArrowUpRight, Plus } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { PageHeader } from "@/components/page-header"
import { getLead } from "@/lib/leads-store"
import { analysesByLead } from "@/lib/analyses-store"
import { emailsByLead } from "@/lib/emails-store"
import { formatDate } from "@/lib/format"

export const dynamic = "force-dynamic"

const DETAIL_FIELDS: { key: "productDescription" | "businessGoals" | "additionalInfo" | "links"; label: string }[] = [
  { key: "productDescription", label: "Что продаём" },
  { key: "businessGoals", label: "Цель захода" },
  { key: "additionalInfo", label: "Доп. информация" },
  { key: "links", label: "Ссылки" },
]

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await getLead(id)
  if (!lead) notFound()

  const [analyses, emails] = await Promise.all([analysesByLead(id), emailsByLead(id)])

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        <PageHeader
          title={lead.name}
          backHref="/leads"
          backLabel="К лидам"
          action={
            <>
              <Link
                href={`/analyses/new?leadId=${lead.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted"
              >
                <LineChart className="h-4 w-4 text-primary" aria-hidden="true" />
                Создать анализ
              </Link>
              <Link
                href={`/emails/new?leadId=${lead.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Создать письмо
              </Link>
            </>
          }
        />

        {/* Lead facts */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            {lead.website ? (
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                {lead.website}
              </span>
            ) : null}
            {lead.industry ? (
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                {lead.industry}
              </span>
            ) : null}
            {lead.targetMarket ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                {lead.targetMarket}
              </span>
            ) : null}
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDate(lead.createdAt)}
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DETAIL_FIELDS.map((f) =>
              lead[f.key]?.trim() ? (
                <div key={f.key} className="flex flex-col gap-1">
                  <dt className="text-xs font-semibold tracking-tight text-foreground">{f.label}</dt>
                  <dd className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{lead[f.key]}</dd>
                </div>
              ) : null,
            )}
          </dl>
        </section>

        {/* Analyses */}
        <RelatedSection
          title="Анализы"
          emptyText="Ещё нет анализов для этого лида."
          createHref={`/analyses/new?leadId=${lead.id}`}
          createLabel="Создать анализ"
          icon={<LineChart className="h-4 w-4" aria-hidden="true" />}
          items={analyses.map((a) => ({
            id: a.id,
            href: `/analyses/${a.id}`,
            title: "Анализ лида",
            meta: formatDate(a.createdAt),
          }))}
        />

        {/* Emails */}
        <RelatedSection
          title="Письма"
          emptyText="Ещё нет писем для этого лида."
          createHref={`/emails/new?leadId=${lead.id}`}
          createLabel="Создать письмо"
          icon={<Mail className="h-4 w-4" aria-hidden="true" />}
          items={emails.map((e) => ({
            id: e.id,
            href: `/emails/${e.id}`,
            title: e.contentLabel,
            meta: formatDate(e.createdAt),
          }))}
        />
      </main>
    </div>
  )
}

function RelatedSection({
  title,
  emptyText,
  createHref,
  createLabel,
  icon,
  items,
}: {
  title: string
  emptyText: string
  createHref: string
  createLabel: string
  icon: React.ReactNode
  items: { id: string; href: string; title: string; meta: string }[]
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>
          {title}
          <span className="rounded-full bg-border/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {items.length}
          </span>
        </h2>
        <Link
          href={createHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:opacity-80"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          {createLabel}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-6 text-center text-sm text-muted-foreground">
          {emptyText}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-card-foreground">{item.title}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {item.meta}
                  </span>
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
    </section>
  )
}
