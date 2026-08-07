import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { PageHeader } from "@/components/page-header"
import { LeadForm } from "@/components/lead-form"
import { getLead } from "@/lib/leads-store"
import type { LeadInput } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await getLead(id)
  if (!lead) notFound()

  const initial: LeadInput = {
    name: lead.name,
    website: lead.website,
    industry: lead.industry,
    targetMarket: lead.targetMarket,
    productDescription: lead.productDescription,
    businessGoals: lead.businessGoals,
    additionalInfo: lead.additionalInfo,
    links: lead.links,
  }

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
        <PageHeader
          title="Редактировать лид"
          subtitle="Измени данные компании. Уже созданные анализы и письма не меняются."
          backHref={`/leads/${lead.id}`}
          backLabel="К лиду"
        />
        <LeadForm leadId={lead.id} initial={initial} />
      </main>
    </div>
  )
}
