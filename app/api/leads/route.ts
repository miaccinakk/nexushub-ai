import { NextResponse } from "next/server"
import { readLeads, saveLead } from "@/lib/leads-store"
import type { Lead, LeadInput } from "@/lib/types"

export async function GET() {
  const leads = await readLeads()
  return NextResponse.json({ leads })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { input: LeadInput }

    if (!body?.input?.name?.trim()) {
      return NextResponse.json({ error: "Lead name is required." }, { status: 400 })
    }

    const input = body.input
    const lead: Lead = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      name: input.name.trim(),
      website: input.website?.trim() || "",
      industry: input.industry?.trim() || "",
      targetMarket: input.targetMarket?.trim() || "",
      productDescription: input.productDescription?.trim() || "",
      businessGoals: input.businessGoals?.trim() || "",
      additionalInfo: input.additionalInfo?.trim() || "",
      links: input.links?.trim() || "",
    }

    await saveLead(lead)
    return NextResponse.json({ lead })
  } catch (error) {
    console.error("[v0] /api/leads error:", error)
    return NextResponse.json({ error: "Failed to save lead." }, { status: 500 })
  }
}
