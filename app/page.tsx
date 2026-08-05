import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

const STEPS = [
  { title: "Компания и человек", text: "Вводишь лид, ЛПР, этап и канал — минимальный ввод." },
  { title: "Сигналы с источниками", text: "Факты со ссылками; всё без источника помечается гипотезой." },
  { title: "Приоритет и текст", text: "Приоритет со стоп-факторами и готовое сообщение под канал." },
]

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto flex max-w-5xl flex-col px-4 sm:px-6">
        <section className="flex min-h-[70dvh] flex-col justify-center py-16">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Lead Research Agent</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
            Разбор лида, который менеджер{" "}
            <span className="text-primary">реально возьмёт в работу</span>.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
            Одна компания — один разбор: сигналы с источниками, приоритет со стоп-факторами и готовый текст под этап и
            канал. Решение и отправка остаются за человеком.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/analysis/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              Создать анализ
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <span className="text-xs text-muted-foreground">Нет факта — нет вывода.</span>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col gap-2 bg-card p-6">
              <span className="font-mono text-xs text-accent-foreground/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="text-sm font-semibold tracking-tight">{step.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{step.text}</p>
            </div>
          ))}
        </section>
        <div className="h-16" />
      </main>
    </div>
  )
}
