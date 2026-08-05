import { SiteHeader } from "@/components/site-header"
import { AnalysisWorkspace } from "@/components/analysis-workspace"

export default function NewAnalysisPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <AnalysisWorkspace />
      </main>
    </div>
  )
}
