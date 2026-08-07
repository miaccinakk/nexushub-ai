"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Users, LineChart, Mail, Globe, Building2, Clock, ArrowUpRight } from "lucide-react"
import type { Analysis, Email, EntityType, Lead } from "@/lib/types"
import { formatDate } from "@/lib/format"

interface FeedItem {
  id: string
  type: EntityType
  title: string
  subtitle: string
  meta?: string
  createdAt: string
  href: string
}

const TYPE_META: Record<EntityType, { label: string; icon: typeof Users; className: string }> = {
  lead: { label: "Лид", icon: Users, className: "bg-primary/10 text-primary" },
  analysis: { label: "Анализ", icon: LineChart, className: "bg-accent/20 text-accent-foreground" },
  email: { label: "Письмо", icon: Mail, className: "bg-dark/10 text-dark" },
}

const FILTERS: { key: EntityType | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "lead", label: "Лиды" },
  { key: "analysis", label: "Анализы" },
  { key: "email", label: "Письма" },
]

export function DashboardFeed({
  leads,
  analyses,
  emails,
}: {
  leads: Lead[]
  analyses: Analysis[]
  emails: Email[]
}) {
  const [filter, setFilter] = useState<EntityType | "all">("all")

  const items = useMemo<FeedItem[]>(() => {
    const leadItems: FeedItem[] = leads.map((l) => ({
      id: l.id,
      type: "lead",
      title: l.name,
      subtitle: l.website || l.industry || "Лид",
      meta: l.industry || undefined,
      createdAt: l.createdAt,
      href: `/leads/${l.id}`,
    }))
    const analysisItems: FeedItem[] = analyses.map((a) => ({
      id: a.id,
      type: "analysis",
      title: a.leadName,
      subtitle: "Анализ лида",
      createdAt: a.createdAt,
      href: `/analyses/${a.id}`,
    }))
    const emailItems: FeedItem[] = emails.map((e) => ({
      id: e.id,
      type: "email",
      title: e.leadName,
      subtitle: e.contentLabel,
      createdAt: e.createdAt,
      href: `/emails/${e.id}`,
    }))
    return [...leadItems, ...analysisItems, ...emailItems].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    )
  }, [leads, analyses, emails])

  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter)

  const counts = {
    all: items.length,
    lead: leads.length,
    analysis: analyses.length,
    email: emails.length,
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
        {FILTERS.map((f) => {
          const active = filter === f.key
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                  active ? "bg-primary/10 text-primary" : "bg-border/60 text-muted-foreground"
                }`}
              >
                {counts[f.key]}
              </span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-foreground">Пока пусто</p>
          <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
            Начни с создания лида — на его основе появятся анализы и письма.
          </p>
          <Link
            href="/leads/new"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            Создать лид
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {filtered.map((item) => {
            const meta = TYPE_META[item.type]
            const Icon = meta.icon
            return (
              <li key={`${item.type}-${item.id}`}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.className}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold tracking-tight text-card-foreground">
                          {item.title}
                        </span>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.className}`}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {item.type === "lead" ? (
                            <Globe className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <Building2 className="h-3 w-3" aria-hidden="true" />
                          )}
                          {item.subtitle}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {formatDate(item.createdAt)}
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
            )
          })}
        </ul>
      )}
    </section>
  )
}
