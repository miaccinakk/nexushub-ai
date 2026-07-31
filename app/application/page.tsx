import type { Metadata } from "next"
import { ApplicationDocument } from "@/components/application/application-document"
import { PrintButton } from "@/components/application/print-button"

export const metadata: Metadata = {
  title: "Руслан Моцин — отклик на вакансию Head of Content, Legends",
  description:
    "Отклик на вакансию Head of Content в Legends: живой прототип content-factory, AI-стек, портфолио и план на первый месяц.",
}

export default function ApplicationPage() {
  return (
    <main>
      <PrintButton />
      <ApplicationDocument />
    </main>
  )
}
