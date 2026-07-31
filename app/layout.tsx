import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Fraunces } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
})

export const metadata: Metadata = {
  title: "Nexus Hub AI — Business Intelligence Assistant",
  description:
    "AI-powered B2B intelligence: analyze companies, build ideal customer profiles, and generate personalized outreach content in seconds.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`bg-background ${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
