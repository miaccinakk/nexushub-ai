import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { AnalysisWorkspace } from "@/components/analysis-workspace"
import { getCompanies, getCompanyById } from "@/lib/companies"
import type { CompanyInput } from "@/lib/types"

export function generateStaticParams() {
  return getCompanies().map((company) => ({ id: company.id }))
}

export default async function CompanyAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = getCompanyById(id)

  if (!company) {
    notFound()
  }

  const initialInput: CompanyInput = {
    name: company.name,
    website: company.website,
    industry: company.industry,
    targetMarket: company.targetMarket,
    productDescription: company.productDescription,
    businessGoals: company.businessGoals,
    additionalInfo: company.additionalInfo,
    links: company.website ? `https://${company.website}` : "",
    guidance: "",
    language: "Auto",
  }

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <AnalysisWorkspace initialInput={initialInput} />
      </main>
    </div>
  )
}
