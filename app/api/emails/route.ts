import { NextResponse } from "next/server"
import { readEmails, saveEmail } from "@/lib/emails-store"
import { getLead } from "@/lib/leads-store"
import { CONTENT_TYPES, type ContentTypeKey, type Email } from "@/lib/types"

export async function GET() {
  const emails = await readEmails()
  return NextResponse.json({ emails })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      leadId: string
      analysisId?: string
      contentType: ContentTypeKey
      instructions?: string
      language?: string
      guidance?: string
      text: string
    }

    if (!body?.leadId || !body?.text || !body?.contentType) {
      return NextResponse.json({ error: "Missing leadId, contentType or text." }, { status: 400 })
    }

    const lead = await getLead(body.leadId)
    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 })
    }

    const contentLabel = CONTENT_TYPES.find((t) => t.key === body.contentType)?.label ?? body.contentType

    const email: Email = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      leadId: lead.id,
      analysisId: body.analysisId || undefined,
      createdAt: new Date().toISOString(),
      leadName: lead.name,
      contentType: body.contentType,
      contentLabel,
      instructions: body.instructions || "",
      language: body.language || "Auto",
      guidance: body.guidance || "",
      text: body.text,
    }

    await saveEmail(email)
    return NextResponse.json({ email })
  } catch (error) {
    console.error("[v0] /api/emails error:", error)
    return NextResponse.json({ error: "Failed to save email." }, { status: 500 })
  }
}
