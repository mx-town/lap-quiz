import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://lap-quiz.vercel.app"),
  title: "LAP Quiz — Mechatronik Prüfungsvorbereitung",
  description: "Quiz-App zur Vorbereitung auf die Lehrabschlussprüfung (LAP) für Mechatroniker. 4 Quiz-Modi, 12 Kapitel, über 200 Fragen.",
  openGraph: {
    title: "LAP Quiz — Mechatronik Prüfungsvorbereitung",
    description: "Quiz-App zur Vorbereitung auf die Lehrabschlussprüfung (LAP) für Mechatroniker.",
    type: "website",
    locale: "de_AT",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "LAP Quiz — Mechatronik Prüfungsvorbereitung",
    description: "Quiz-App zur Vorbereitung auf die Lehrabschlussprüfung (LAP) für Mechatroniker.",
  },
  icons: {
    apple: "/icon-192.svg",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
