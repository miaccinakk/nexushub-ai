import { NextResponse } from "next/server"
import { readAnalyses, saveAnalysis } from "@/lib/analyses-store"
import type { AnalysisResult, CompanyInput, SavedAnalysis } from "@/lib/types"

export async function GET() {
  const analyses = await readAnalyses()
  return NextResponse.json({ analyses })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      input: CompanyInput
      result: AnalysisResult
    }

    if (!body?.input || !body?.result) {
      return NextResponse.json({ error: "Missing input or result." }, { status: 400 })
    }

    const analysis: SavedAnalysis = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      name: body.input.name?.trim() || "Без названия",
      website: body.input.website?.trim() || "",
      industry: body.input.industry?.trim() || "",
      targetMarket: body.input.targetMarket?.trim() || "",
      input: body.input,
      result: body.result,
    }

    await saveAnalysis(analysis)
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("[v0] /api/analyses error:", error)
    return NextResponse.json({ error: "Failed to save analysis." }, { status: 500 })
  }
}
