import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "LAP Quiz — Mechatronik Prüfungsvorbereitung",
  description: "Quiz-App zur Vorbereitung auf die Lehrabschlussprüfung (LAP) für Mechatroniker",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
