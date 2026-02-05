"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Start" },
    { href: "/quiz/exam", label: "Prüfung" },
    { href: "/quiz/chapter", label: "Kapitel" },
    { href: "/quiz/blitz", label: "Blitz" },
    { href: "/quiz/scenario", label: "Szenario" },
    { href: "/quiz/custom", label: "Fachbereich" },
    { href: "/stats", label: "Statistik" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-bg-secondary/80 backdrop-blur-xl border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary rounded-lg"
        >
          <span className="text-accent-primary font-display">LAP</span>
          <span className="text-text-secondary">Quiz</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-3 py-2 rounded-lg text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary",
                "after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:bg-accent-primary after:transition-all after:duration-300",
                pathname === link.href
                  ? "bg-accent-primary/10 text-accent-primary after:opacity-100"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary after:opacity-0 hover:after:opacity-50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://lap-dashboard.vercel.app"}
          target="_blank"
          className="text-xs text-text-muted hover:text-accent-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary rounded"
        >
          Dashboard →
        </Link>
      </div>
    </header>
  )
}
