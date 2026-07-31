import companiesData from "@/data/companies.json"
import type { Company } from "./types"

export function getCompanies(): Company[] {
  return companiesData as Company[]
}

export function getCompanyById(id: string): Company | undefined {
  return getCompanies().find((company) => company.id === id)
}
