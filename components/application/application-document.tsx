import type React from "react"
import {
  ArrowUpRight,
  Sparkles,
  Cpu,
  Layers,
  CalendarRange,
  Workflow,
  Video,
  BarChart3,
  Mail,
  Send,
  Linkedin,
  Phone,
  Globe,
} from "lucide-react"

// Замените на реальный домен после публикации (Publish → Vercel).
const PROTOTYPE_URL = "https://nexushub-ai.vercel.app"
const PROTOTYPE_LABEL = "nexushub-ai.vercel.app"

function SectionTitle({
  icon,
  kicker,
  title,
}: {
  icon: React.ReactNode
  kicker: string
  title: string
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
      >
        {icon}
      </span>
      <div className="flex flex-col">
        <span
          className="text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: "var(--accent)" }}
        >
          {kicker}
        </span>
        <h2 className="font-serif text-xl leading-tight" style={{ color: "var(--ink)" }}>
          {title}
        </h2>
      </div>
    </div>
  )
}

function Automation({
  title,
  task,
  solution,
  output,
}: {
  title: string
  task: string
  solution: string
  output: string
}) {
  return (
    <div
      className="doc-break-avoid rounded-xl border p-5"
      style={{ borderColor: "var(--hairline)", backgroundColor: "#fff" }}
    >
      <h3 className="font-serif text-lg" style={{ color: "var(--ink)" }}>
        {title}
      </h3>
      <dl className="mt-3 grid gap-2 text-sm leading-relaxed">
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-medium" style={{ color: "var(--accent)" }}>
            Задача
          </dt>
          <dd style={{ color: "var(--ink-soft)" }}>{task}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-medium" style={{ color: "var(--accent)" }}>
            Решение
          </dt>
          <dd style={{ color: "var(--ink-soft)" }}>{solution}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-medium" style={{ color: "var(--accent)" }}>
            Output
          </dt>
          <dd style={{ color: "var(--ink-soft)" }}>{output}</dd>
        </div>
      </dl>
    </div>
  )
}

function PortfolioItem({
  name,
  url,
  label,
  stack,
  description,
}: {
  name: string
  url: string
  label: string
  stack: string
  description: string
}) {
  return (
    <div
      className="doc-break-avoid border-b py-4 last:border-b-0"
      style={{ borderColor: "var(--hairline)" }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-serif text-lg" style={{ color: "var(--ink)" }}>
          {name}
        </h3>
        <a href={url} className="doc-link text-sm" target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      </div>
      <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        {description}
      </p>
      <p className="mt-1.5 text-xs" style={{ color: "var(--muted)" }}>
        {stack}
      </p>
    </div>
  )
}

function PlanWeek({
  week,
  title,
  points,
}: {
  week: string
  title: string
  points: string[]
}) {
  return (
    <div className="doc-break-avoid flex gap-4">
      <div className="flex flex-col items-center">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-serif text-sm"
          style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {week}
        </span>
        <span className="mt-1 w-px flex-1" style={{ backgroundColor: "var(--hairline)" }} />
      </div>
      <div className="pb-5">
        <h3 className="font-serif text-base" style={{ color: "var(--ink)" }}>
          {title}
        </h3>
        <ul className="mt-1.5 grid gap-1 text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          {points.map((p) => (
            <li key={p} className="flex gap-2">
              <span style={{ color: "var(--accent)" }}>—</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function ApplicationDocument() {
  return (
    <div className="app-doc min-h-screen w-full px-4 py-10 font-sans">
      <article
        className="doc-sheet rounded-2xl px-8 py-10 shadow-xl sm:px-12 sm:py-14"
        style={{ boxShadow: "0 20px 60px rgba(26,22,19,0.12)" }}
      >
        {/* Header */}
        <header className="doc-break-avoid">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p
                className="text-[11px] font-medium uppercase tracking-[0.22em]"
                style={{ color: "var(--accent)" }}
              >
                Отклик на вакансию · Legends
              </p>
              <h1 className="mt-2 font-serif text-4xl leading-none" style={{ color: "var(--ink)" }}>
                Руслан Моцин
              </h1>
              <p className="mt-2 text-base" style={{ color: "var(--ink-soft)" }}>
                Head of Content / AI Content Systems
              </p>
              <p className="mt-1 font-serif text-sm italic" style={{ color: "var(--muted)" }}>
                Building AI content systems end-to-end — not just using the tools.
              </p>
            </div>
            <ul className="grid gap-1.5 text-sm" style={{ color: "var(--ink-soft)" }}>
              <li className="flex items-center gap-2">
                <Send className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} aria-hidden="true" />
                <span>@monkrizi</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} aria-hidden="true" />
                <span>krizis12@mail.ru</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} aria-hidden="true" />
                <span>+375 29 896-60-76</span>
              </li>
              <li className="flex items-center gap-2">
                <Linkedin className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} aria-hidden="true" />
                <a
                  href="https://www.linkedin.com/in/ruslan-motsin-407086271/"
                  className="doc-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  in/ruslan-motsin
                </a>
              </li>
            </ul>
          </div>
        </header>

        <div className="my-8 h-px w-full" style={{ backgroundColor: "var(--hairline)" }} />

        {/* Hero — Live prototype */}
        <section
          className="doc-break-avoid overflow-hidden rounded-2xl"
          style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
        >
          <div className="px-7 py-8 sm:px-9 sm:py-9">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" style={{ color: "#e6b56a" }} aria-hidden="true" />
              <span
                className="text-[11px] font-medium uppercase tracking-[0.2em]"
                style={{ color: "#e6b56a" }}
              >
                Живой прототип · собран под эту вакансию
              </span>
            </div>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-balance">
              NexusHub AI — рабочий прототип content-factory
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "#cfc8bd" }}>
              Небольшой, но полностью рабочий пример того, что можно построить внутри Legends.
              Выбираете компанию → система анализирует её → генерирует контент (сейчас — посты) на
              нужном языке. Это ядро, вокруг которого дальше собирается вся фабрика контента.
            </p>

            <a
              href={PROTOTYPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 rounded-full px-6 py-3 text-base font-semibold transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: "#e6b56a", color: "#1a1613" }}
            >
              Открыть прототип
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </a>
            <p className="mt-3 text-sm" style={{ color: "#e6b56a" }}>
              {PROTOTYPE_LABEL}
            </p>

            <div
              className="mt-6 rounded-xl border px-5 py-4 text-sm leading-relaxed"
              style={{ borderColor: "rgba(230,181,106,0.3)", color: "#cfc8bd" }}
            >
              <span className="font-medium" style={{ color: "var(--paper)" }}>
                Куда это масштабируется:{" "}
              </span>
              video/image-пайплайны (Sora, Runway, Higgsfield), автопостинг по каналам,
              персонализированная генерация под спикера и — на перспективу — внутренняя LLM,
              дообученная под бренд и tone of voice Legends.
            </div>
          </div>
        </section>

        {/* Positioning */}
        <section className="doc-break-avoid mt-9">
          <SectionTitle
            icon={<Cpu className="h-4 w-4" aria-hidden="true" />}
            kicker="Почему я"
            title="Строю системы, а не просто произвожу контент"
          />
          <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
            Я — full-stack разработчик с опытом 9+ лет, который последние 2 года строит AI-продукты
            и автоматизации. Для роли Head of Content это значит редкое сочетание: content factory я
            могу собрать технически под ключ — от пайплайнов генерации и автопостинга до дашбордов
            аналитики — и одновременно дирижировать этим как системой, постоянно её улучшая. Не
            «пользовался ChatGPT», а shipped-продукты с AI внутри, в проде, с реальными пользователями.
          </p>
        </section>

        {/* AI stack + automations */}
        <section className="mt-9">
          <SectionTitle
            icon={<Workflow className="h-4 w-4" aria-hidden="true" />}
            kicker="AI-стек и автоматизации"
            title="Инструменты и shipped-примеры"
          />

          <div
            className="doc-break-avoid mb-5 rounded-xl border p-4 text-sm leading-relaxed"
            style={{ borderColor: "var(--hairline)", backgroundColor: "var(--accent-soft)" }}
          >
            <span className="font-medium" style={{ color: "var(--ink)" }}>
              Стек:{" "}
            </span>
            <span style={{ color: "var(--ink-soft)" }}>
              LLM — Claude, GPT · видео/фото — Sora, Runway, Higgsfield · голос — ElevenLabs ·
              автоматизация — n8n, Zapier, кастомные API-пайплайны · разработка — Cursor, Next.js,
              Node.js, PostgreSQL.
            </span>
          </div>

          <div className="grid gap-4">
            <Automation
              title="NexusHub AI — пайплайн «анализ компании → контент» (этот прототип)"
              task="Убрать ручной ресёрч и написание постов под каждую компанию."
              solution="Ввод данных о компании → анализ → генерация постов через LLM с выбором языка."
              output="Готовый пост за секунды вместо часа ручной работы; от ввода до результата — без участия человека."
            />
            <Automation
              title="AI4Car — AI-диагностика с биллингом и лимитами"
              task="Масштабируемая AI-функциональность с автономными лимитами и подписками."
              solution="AI Helper, расшифровка ошибок, live quota tracking, SSE-уведомления, подписки, крипто-платежи."
              output="Usage limits и subscription logic работают полностью автономно 24/7, без ручного контроля."
            />
            <Automation
              title="Автодор — авто-генерация документов + Data Mapper"
              task="Убрать ручное создание документов и нормализацию данных в CRM."
              solution="Workflow генерации/редактирования документов + инструмент нормализации данных в PostgreSQL."
              output="Документы и миграция данных собираются процессом, а не руками."
            />
          </div>
        </section>

        {/* Portfolio */}
        <section className="mt-9">
          <SectionTitle
            icon={<Layers className="h-4 w-4" aria-hidden="true" />}
            kicker="Портфолио"
            title="Shipped-работы с контекстом"
          />
          <div>
            <PortfolioItem
              name="AI4Car"
              url="https://ai4car.app/"
              label="ai4car.app"
              stack="React · React Native · Node.js · PostgreSQL · REST API"
              description="AI-платформа диагностики авто: полный цикл frontend/backend, AI-функционал, биллинг, admin-панель. Роль: Fullstack."
            />
            <PortfolioItem
              name="OHI-S"
              url="https://ru.ohi-s.com/"
              label="ru.ohi-s.com"
              stack="Международная образовательная платформа"
              description="Международный продукт с мультиязычной аудиторией — релевантный опыт для international / B2B-контекста Legends."
            />
            <PortfolioItem
              name="Автодор (Росавтодор)"
              url="https://newnto.rosavtodor.ru/"
              label="newnto.rosavtodor.ru"
              stack="Nuxt 3 · REST API · PostgreSQL"
              description="Платформа поиска и аналитики отраслевой документации: сложные фильтры, внутренняя CRM с генерацией документов, Data Mapper. Роль: Frontend + internal tools."
            />
            <PortfolioItem
              name="Profiterm"
              url="https://profiterm.by/"
              label="profiterm.by"
              stack="Nuxt 3 · Node.js · MongoDB · REST API"
              description="Корпоративный сайт под ключ: адаптивный UI, backend, система заявок, SEO-оптимизация и production-деплой. Роль: Fullstack."
            />
            <PortfolioItem
              name="Полное портфолио"
              url="https://ctrlcat.my/"
              label="ctrlcat.my"
              stack="Все проекты и кейсы"
              description="Витрина работ и кейсов с контекстом по каждому проекту."
            />
          </div>
        </section>

        {/* Plan — new page in print */}
        <section className="doc-page-break mt-9">
          <SectionTitle
            icon={<CalendarRange className="h-4 w-4" aria-hidden="true" />}
            kicker="План на первый месяц в Legends"
            title="Сначала система и повторяемость — потом объём"
          />

          <div className="mt-2">
            <PlanWeek
              week="W1"
              title="Аудит и фундамент"
              points={[
                "Разбор текущих каналов: LinkedIn (founders + brand), X, YouTube, Instagram — tone of voice, конкуренты.",
                "Фиксирую базовые метрики: охваты, engagement, точки роста.",
                "Собираю контент-репозиторий и первую библиотеку промптов.",
              ]}
            />
            <PlanWeek
              week="W2"
              title="Текстовые пайплайны и автопостинг"
              points={[
                "Разворачиваю AI-пайплайны для постов founders на LinkedIn / X: авто-ресёрч + черновики через LLM.",
                "Настраиваю автопостинг и расписание через n8n / Zapier.",
                "Документирую промпты как reproducible-процессы, а не одноразовые скрипты.",
              ]}
            />
            <PlanWeek
              week="W3"
              title="Видео и визуал"
              points={[
                "Запускаю AI-video пайплайн: welcome-видео и аватары, промо мероприятий.",
                "Шаблоны баннеров и презентаций под еженедельные Speaker events.",
                "Собираю первый повторяемый процесс упаковки спикеров под Demo Day (питч, промо, aftermovie).",
              ]}
            />
            <PlanWeek
              week="W4"
              title="Дистрибуция, метрики, команда"
              points={[
                "Регулярный поток по всем каналам + кросс-канальная координация.",
                "Дашборд метрик: охват / engagement / рост, еженедельное ретро.",
                "План найма под-команды: AI-специалист и community / social manager.",
              ]}
            />
          </div>

          <div
            className="doc-break-avoid mt-4 grid gap-4 rounded-xl border p-5 sm:grid-cols-3"
            style={{ borderColor: "var(--hairline)", backgroundColor: "#fff" }}
          >
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <Send className="h-4 w-4" style={{ color: "var(--accent)" }} aria-hidden="true" />
                <h3 className="font-serif text-sm" style={{ color: "var(--ink)" }}>
                  Приоритет каналов
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                LinkedIn (personal founders + brand) — №1, далее X и YouTube.
              </p>
            </div>
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <Video className="h-4 w-4" style={{ color: "var(--accent)" }} aria-hidden="true" />
                <h3 className="font-serif text-sm" style={{ color: "var(--ink)" }}>
                  Типы контента
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                Короткие экспертные посты, AI-видео и аватары, упаковка спикеров и Demo Days.
              </p>
            </div>
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" style={{ color: "var(--accent)" }} aria-hidden="true" />
                <h3 className="font-serif text-sm" style={{ color: "var(--ink)" }}>
                  Как измеряю
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                Охват и engagement по каналам, скорость и объём output пайплайнов.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="doc-break-avoid mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-6"
          style={{ borderColor: "var(--hairline)" }}
        >
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-soft)" }}>
            <Globe className="h-4 w-4" style={{ color: "var(--accent)" }} aria-hidden="true" />
            <span>Прототип:</span>
            <a href={PROTOTYPE_URL} className="doc-link" target="_blank" rel="noopener noreferrer">
              {PROTOTYPE_LABEL}
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--ink-soft)" }}>
            <span>Telegram @monkrizi</span>
            <span>krizis12@mail.ru</span>
            <a href="https://ctrlcat.my/" className="doc-link" target="_blank" rel="noopener noreferrer">
              ctrlcat.my
            </a>
          </div>
        </footer>
      </article>
    </div>
  )
}
