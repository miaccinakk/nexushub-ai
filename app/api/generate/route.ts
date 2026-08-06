import { NextResponse } from "next/server"
import { generateAIResponse } from "@/lib/ai"
import { buildContentPrompt, buildSectionPrompt } from "@/lib/prompts"
import type { CompanyInput } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      kind: "section" | "content"
      task: string
      input: CompanyInput
      instructions?: string
      modelId?: string
    }

    if (!body?.task || !body?.input) {
      return NextResponse.json({ error: "Missing task or input." }, { status: 400 })
    }

    const prompt =
      body.kind === "content"
        ? buildContentPrompt(body.input, body.task, body.instructions)
        : buildSectionPrompt(body.input, body.task)

    const text = await generateAIResponse(prompt, body.modelId)
    return NextResponse.json({ text })
  } catch (error) {
    console.error("[v0] /api/generate error:", error)
    return NextResponse.json({ error: "Failed to generate AI response." }, { status: 500 })
  }
}
