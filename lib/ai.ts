/**
 * =============================================================================
 *  AI INTEGRATION POINT
 * =============================================================================
 *
 *  This is the single place where the app talks to a language model.
 *  Right now it ships with a MOCK implementation so the prototype works
 *  end-to-end without any API keys.
 *
 *  To connect a real model (OpenAI / Claude / GPT / Gemini / etc.), replace the
 *  body of `generateAIResponse` with a real API call. Example with OpenAI:
 *
 *    import OpenAI from "openai"
 *    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
 *
 *    export async function generateAIResponse(prompt: string): Promise<string> {
 *      const res = await client.chat.completions.create({
 *        model: "gpt-4o-mini",
 *        messages: [
 *          { role: "system", content: "You are a senior B2B go-to-market strategist." },
 *          { role: "user", content: prompt },
 *        ],
 *        temperature: 0.7,
 *      })
 *      return res.choices[0].message.content ?? ""
 *    }
 *
 *  The rest of the app only depends on this function signature:
 *      generateAIResponse(prompt: string) => Promise<string>
 * =============================================================================
 */

// Simulated latency so the UI loading states feel realistic in the demo.
const MOCK_LATENCY_MS = 700

function extractField(prompt: string, label: string): string {
  const re = new RegExp(`${label}:\\s*(.+)`, "i")
  const match = prompt.match(re)
  return match ? match[1].trim() : ""
}

/**
 * MOCK response generator.
 * It inspects a lightweight [TASK: ...] marker embedded in each prompt and
 * returns realistic demo copy. A real model would simply read the full prompt.
 */
function buildMockResponse(prompt: string): string {
  const task = (prompt.match(/\[TASK:\s*([^\]]+)\]/i)?.[1] ?? "").trim().toLowerCase()
  const company = extractField(prompt, "Company") || "the company"
  const industry = extractField(prompt, "Industry") || "its industry"
  const market = extractField(prompt, "Target market") || "its target market"

  switch (task) {
    case "market overview":
      return [
        `The ${industry} space serving ${market} is expanding rapidly, driven by digital transformation budgets and pressure to prove measurable ROI.`,
        `Buyers are consolidating vendors and favor platforms that integrate cleanly with existing systems rather than point solutions.`,
        `Regulatory expectations and data-privacy requirements are rising, making trust and compliance a competitive differentiator for ${company}.`,
        `Incumbents are slow to modernize, leaving a clear window for a focused, outcome-driven challenger.`,
      ].join("\n\n")

    case "ideal customer profile":
      return [
        `Company size: 200–2,000 employees with a dedicated operations or transformation budget.`,
        `Geography: primarily ${market}, with expansion-minded leadership.`,
        `Industry fit: ${industry} and adjacent verticals with similar workflows.`,
        `Buying triggers: a recent funding round, a new VP/Director hire, a compliance deadline, or a failed legacy implementation.`,
        `Tech maturity: already using cloud tooling and open to API-first integrations.`,
      ].join("\n")

    case "target audience":
      return [
        `Economic buyer: VP of Operations / Chief Transformation Officer — cares about ROI, risk reduction, and time-to-value.`,
        `Champion: Head of Department or Senior Manager — cares about ease of adoption and their team's daily workflow.`,
        `Technical evaluator: IT / Security lead — cares about integrations, data handling, and compliance.`,
        `Blocker to disarm: Finance / Procurement — needs a clear business case and predictable pricing.`,
      ].join("\n")

    case "key messaging":
      return [
        `Core promise: "${company} turns ${industry} complexity into measurable outcomes — without ripping out what already works."`,
        `Value pillar 1 — Speed: See impact in weeks, not quarters.`,
        `Value pillar 2 — Trust: Enterprise-grade security and compliance built for ${market}.`,
        `Value pillar 3 — Integration: Works with your existing stack through an open API.`,
        `Proof approach: lead with a quantified case study and a low-risk pilot offer.`,
      ].join("\n")

    case "sales angles":
      return [
        `1. ROI angle — quantify the cost of the status quo (wasted hours, errors, churn) and contrast with pilot results.`,
        `2. Risk-reduction angle — position around compliance and reliability for ${market} buyers.`,
        `3. Competitive-displacement angle — target teams frustrated with slow legacy vendors.`,
        `4. Land-and-expand angle — start with one team, prove value, expand across departments.`,
        `5. Timing angle — tie outreach to a trigger event (funding, new hire, regulation).`,
      ].join("\n")

    case "content ideas":
      return [
        `- Data report: "The State of ${industry} in ${market}" with original benchmarks.`,
        `- Customer story: a before/after breakdown with hard numbers.`,
        `- Comparison guide: "Modern platform vs. legacy tooling" for evaluators.`,
        `- Webinar: a live teardown of a common ${industry} workflow.`,
        `- LinkedIn carousel: 5 signals it's time to replace your current solution.`,
        `- Short video: a 60-second product-in-action demo.`,
      ].join("\n")

    case "linkedin post":
      return [
        `Most ${industry} teams in ${market} are still fighting the same problem with tools built a decade ago.`,
        ``,
        `The result? Wasted hours, avoidable errors, and decisions made on stale data.`,
        ``,
        `At ${company}, we took a different approach — outcomes first, integration second, hype never.`,
        ``,
        `→ Impact in weeks, not quarters`,
        `→ Enterprise-grade security by default`,
        `→ Works with the stack you already run`,
        ``,
        `If your team is ready to stop patching and start improving, let's talk.`,
        ``,
        `#${industry.replace(/\s+/g, "")} #B2B #Innovation`,
      ].join("\n")

    case "email outreach":
      return [
        `Subject: A faster path to results for ${company}`,
        ``,
        `Hi {{FirstName}},`,
        ``,
        `I noticed ${company} is scaling in ${market}, and teams at your stage often hit the same wall: legacy ${industry} tooling that slows everything down.`,
        ``,
        `We help companies like yours cut that friction and see measurable impact within the first few weeks — without a rip-and-replace project.`,
        ``,
        `Would a short 15-minute call next week be worth exploring? I can share a quick example relevant to ${industry}.`,
        ``,
        `Best,`,
        `{{YourName}}`,
      ].join("\n")

    case "event invitation":
      return [
        `Subject: You're invited — exclusive ${industry} roundtable in ${market}`,
        ``,
        `Hi {{FirstName}},`,
        ``,
        `We're hosting a small, invite-only roundtable for ${industry} leaders in ${market} to share what's actually working right now — no pitches, just peer insight.`,
        ``,
        `Details:`,
        `- Format: 90-minute discussion + networking`,
        `- Who: 12 senior operators and decision-makers`,
        `- Hosted by: ${company}`,
        ``,
        `Seats are limited. Can I reserve one for you?`,
        ``,
        `Warm regards,`,
        `{{YourName}}`,
      ].join("\n")

    case "twitter post":
      return [
        `Legacy ${industry} tools are quietly costing ${market} teams hours every week.`,
        ``,
        `${company} flips it: outcomes in weeks, not quarters. API-first. Secure by default.`,
        ``,
        `Stop patching. Start improving. 🧵👇`,
      ].join("\n")

    case "video / avatar script":
      return [
        `[HOOK — 0:00-0:03]`,
        `"${industry} teams in ${market} are losing hours every week — and most don't even see it."`,
        ``,
        `[PROBLEM — 0:03-0:12]`,
        `Legacy tooling is slow, disconnected, and hard to trust. That means stale data and decisions made too late.`,
        ``,
        `[SOLUTION — 0:12-0:25]`,
        `That's why we built ${company}: outcomes in weeks not quarters, enterprise-grade security by default, and it plugs into the stack you already run.`,
        ``,
        `[PROOF — 0:25-0:32]`,
        `Early teams saw measurable impact inside the first month — no rip-and-replace.`,
        ``,
        `[CTA — 0:32-0:35]`,
        `"Want to see it on your workflow? Link's below."`,
        ``,
        `On-screen text: ${company} · outcomes, not overhead. B-roll: dashboard in action, happy team.`,
      ].join("\n")

    default:
      return `AI response for ${company} in the ${industry} sector targeting ${market}. Replace lib/ai.ts with a real model to generate live output.`
  }
}

/**
 * Pulls the user's custom instructions out of the prompt so the MOCK can
 * visibly acknowledge them. A real model would simply obey them inline and
 * this helper would no longer be needed.
 */
function extractInstructions(prompt: string): string {
  const marker = "[CUSTOM INSTRUCTIONS — follow these closely]"
  const idx = prompt.indexOf(marker)
  if (idx === -1) return ""
  return prompt.slice(idx + marker.length).trim()
}

export async function generateAIResponse(prompt: string): Promise<string> {
  // Simulated network/model latency for a realistic demo experience.
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))

  const base = buildMockResponse(prompt)
  const instructions = extractInstructions(prompt)
  if (!instructions) return base

  // Demo-only: show that the custom prompt was received and applied.
  // A real model bakes these instructions directly into `base`.
  return `${base}\n\n— Applied your instructions: ${instructions.replace(/\s*\n\s*/g, " ")}`
}
