import { NextResponse } from "next/server"
import { readAnalyses, saveAnalysis } from "@/lib/analyses-store"
import { getLead } from "@/lib/leads-store"
import { EMPTY_ANALYSIS_CONFIG, type Analysis, type AnalysisConfig, type AnalysisResult } from "@/lib/types"

export async function GET() {
  const analyses = await readAnalyses()
  return NextResponse.json({ analyses })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      leadId: string
      config: AnalysisConfig
      result: AnalysisResult
    }

    if (!body?.leadId || !body?.result) {
      return NextResponse.json({ error: "Missing leadId or result." }, { status: 400 })
    }

    const lead = await getLead(body.leadId)
    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 })
    }

    const analysis: Analysis = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      leadId: lead.id,
      createdAt: new Date().toISOString(),
      leadName: lead.name,
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
