import Link from "next/link"
import { ArrowRight, Globe, MapPin } from "lucide-react"
import type { Company } from "@/lib/types"
import { StatusBadge } from "./status-badge"

export function CompanyCard({ company }: { company: Company }) {
  return (
    <article className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <h3 className="text-base font-semibold tracking-tight text-card-foreground">{company.name}</h3>
          <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" aria-hidden="true" />
            {company.website}
          </span>
        </div>
        <StatusBadge status={company.status} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{company.description}</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
        <div>
          <dt className="text-muted-foreground">Industry</dt>
          <dd className="mt-0.5 font-medium text-card-foreground">{company.industry}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Target market</dt>
          <dd className="mt-0.5 flex items-center gap-1 font-medium text-card-foreground">
            <MapPin className="h-3 w-3 text-accent" aria-hidden="true" />
            {company.targetMarket}
          </dd>
        </div>
      </dl>

      <Link
        href={`/analysis/${company.id}`}
        className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-dark px-4 py-2 text-sm font-medium text-dark-foreground transition-all hover:opacity-90"
      >
        Open Analysis
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </article>
  )
}
