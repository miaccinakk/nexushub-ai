import { NextResponse } from "next/server"
import { readAnalyses, saveAnalysis } from "@/lib/analyses-store"
import { getCompany } from "@/lib/companies-store"
import { getPeopleByIds } from "@/lib/people-store"
import { EMPTY_ANALYSIS_CONFIG, type Analysis, type AnalysisConfig, type AnalysisResult } from "@/lib/types"

export async function GET() {
  const analyses = await readAnalyses()
  return NextResponse.json({ analyses })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      companyId: string
      personIds?: string[]
      config: AnalysisConfig
      result: AnalysisResult
    }

    if (!body?.companyId || !body?.result) {
      return NextResponse.json({ error: "Missing companyId or result." }, { status: 400 })
    }

    const company = await getCompany(body.companyId)
    if (!company) {
      return NextResponse.json({ error: "Company not found." }, { status: 404 })
    }

    const personIds = Array.isArray(body.personIds) ? body.personIds : []
    const people = await getPeopleByIds(personIds)

    const analysis: Analysis = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      companyId: company.id,
      companyName: company.name,
      personIds: people.map((p) => p.id),
      personNames: people.map((p) => p.name),
      config: { ...EMPTY_ANALYSIS_CONFIG, ...body.config },
      result: body.result,
    }

    await saveAnalysis(analysis)
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("[v0] /api/analyses error:", error)
    return NextResponse.json({ error: "Failed to save analysis." }, { status: 500 })
  }
}
