import { NextResponse } from "next/server"
import { readEmails, saveEmail } from "@/lib/emails-store"
import { getCompany } from "@/lib/companies-store"
import { getPerson } from "@/lib/people-store"
import { CONTENT_TYPES, type ContentTypeKey, type Email } from "@/lib/types"

export async function GET() {
  const emails = await readEmails()
  return NextResponse.json({ emails })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      companyId: string
      personId?: string
      analysisId?: string
      contentType: ContentTypeKey
      instructions?: string
      language?: string
      guidance?: string
      text: string
    }

    if (!body?.companyId || !body?.text || !body?.contentType) {
      return NextResponse.json({ error: "Missing companyId, contentType or text." }, { status: 400 })
    }

    const company = await getCompany(body.companyId)
    if (!company) {
      return NextResponse.json({ error: "Company not found." }, { status: 404 })
    }

    const person = body.personId ? await getPerson(body.personId) : null

    const contentLabel = CONTENT_TYPES.find((t) => t.key === body.contentType)?.label ?? body.contentType

    const email: Email = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      companyId: company.id,
      companyName: company.name,
      personId: person?.id,
      personName: person?.name,
      analysisId: body.analysisId || undefined,
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
