import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-16 pb-20 md:pb-16">
        <div className="text-center max-w-md">
          <p className="text-[11px] font-mono uppercase tracking-widest text-text-muted mb-4">
            Fehler 404
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-text-primary mb-3">
            Seite nicht gefunden
          </h1>
          <p className="text-sm text-text-muted mb-8">
            Die angeforderte Seite existiert nicht oder wurde verschoben.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 py-3 px-8 bg-text-primary text-bg-primary font-medium hover:bg-accent-primary transition-colors uppercase tracking-wider text-[13px]"
          >
            Zur Startseite
          </Link>
        </div>
      </main>
      <BottomNav />
    </>
  )
}
