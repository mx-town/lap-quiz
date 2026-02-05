import { Navbar } from "@/components/layout/Navbar"
import { ModeSelector } from "@/components/layout/ModeSelector"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-accent-primary">LAP</span> Quiz
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Mechatronik-Prüfungsvorbereitung — 5 Quiz-Modi, 11 Kapitel, KI-gestützte Erklärungen
          </p>
        </div>

        <ModeSelector />

        <div className="mt-16 text-center">
          <p className="text-text-muted text-sm">
            Ergänzung zum{" "}
            <a
              href="https://lap-dashboard.vercel.app"
              target="_blank"
              className="text-accent-primary hover:underline"
            >
              LAP-Dashboard
            </a>{" "}
            — Nachschlagewerk für alle Kapitel
          </p>
        </div>
      </main>
    </>
  )
}
