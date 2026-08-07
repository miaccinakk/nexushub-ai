import { NextResponse } from "next/server"
import { getLead, updateLead } from "@/lib/leads-store"
import type { LeadInput } from "@/lib/types"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await getLead(id)
  if (!lead) return NextResponse.json({ error: "Lead not found." }, { status: 404 })
  return NextResponse.json({ lead })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = (await request.json()) as { input: LeadInput }

    if (!body?.input?.name?.trim()) {
      return NextResponse.json({ error: "Lead name is required." }, { status: 400 })
    }

    const input = body.input
    const lead = await updateLead(id, {
      name: input.name.trim(),
      website: input.website?.trim() || "",
      industry: input.industry?.trim() || "",
      targetMarket: input.targetMarket?.trim() || "",
      productDescription: input.productDescription?.trim() || "",
      businessGoals: input.businessGoals?.trim() || "",
      additionalInfo: input.additionalInfo?.trim() || "",
      links: input.links?.trim() || "",
    })

    if (!lead) return NextResponse.json({ error: "Lead not found." }, { status: 404 })
    return NextResponse.json({ lead })
  } catch (error) {
    console.error("[v0] /api/leads/[id] PUT error:", error)
    return NextResponse.json({ error: "Failed to update lead." }, { status: 500 })
  }
}
