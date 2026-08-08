import { SiteHeader } from "@/components/site-header"
import { PageHeader } from "@/components/page-header"
import { TemplateForm } from "@/components/template-form"

export default function NewTemplatePage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
        <PageHeader
          title="Новый шаблон"
          subtitle="Название и текст шаблона. Плейсхолдеры вроде [имя] или [компания] AI подставит при генерации письма."
          backHref="/templates"
          backLabel="К шаблонам"
        />
        <TemplateForm />
      </main>
    </div>
  )
}
