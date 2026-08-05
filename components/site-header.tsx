import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">Nexus</span>
            <span className="text-[11px] text-muted-foreground">Lead Research</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/analysis/new"
            className="rounded-md bg-primary px-3.5 py-1.5 font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Создать анализ
          </Link>
        </nav>
      </div>
    </header>
  )
}
