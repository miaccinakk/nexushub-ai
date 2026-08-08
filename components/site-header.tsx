"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building2, Users, LineChart, Mail, FileText } from "lucide-react"
import { LogoutButton } from "./logout-button"

const NAV = [
  { href: "/", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/companies", label: "Компании", icon: Building2 },
  { href: "/people", label: "Люди", icon: Users },
  { href: "/analyses", label: "Анализы", icon: LineChart },
  { href: "/emails", label: "Письма", icon: Mail },
  { href: "/templates", label: "Шаблоны", icon: FileText },
]

export function SiteHeader() {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">Nexus Opener</span>
            <span className="text-[11px] text-muted-foreground">Outreach workspace</span>
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1">
          {NAV.map((item) => {
            const active = isActive(item.href, item.exact)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
          <div className="ml-1 border-l border-border pl-1">
            <LogoutButton />
          </div>
        </nav>
      </div>
    </header>
  )
}
