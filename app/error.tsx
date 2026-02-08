"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-16 pb-20 md:pb-16">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-accent-primary" />
          </div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-text-muted mb-4">
            Fehler
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-3">
            Etwas ist schiefgelaufen
          </h1>
          <p className="text-sm text-text-muted mb-8">
            Ein unerwarteter Fehler ist aufgetreten. Versuche es erneut.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 py-3 px-8 bg-text-primary text-bg-primary font-medium hover:bg-accent-primary transition-colors uppercase tracking-wider text-[13px]"
          >
            Erneut versuchen
          </button>
        </div>
      </main>
      <BottomNav />
    </>
  )
}
