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
    { href: "/quiz/custom", label: "Fachbereich" },
    { href: "/stats", label: "Statistik" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-bg-primary border-b border-border-subtle">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-semibold text-base tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
        >
          <span className="text-accent-primary font-bold">LAP</span>
          <span className="text-text-muted">Quiz</span>
        </Link>

        <nav className="hidden md:flex items-center gap-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 text-[13px] uppercase tracking-wider font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
                pathname === link.href
                  ? "text-accent-primary"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://lap-dashboard.vercel.app"}
          target="_blank"
          className="text-[13px] font-medium uppercase tracking-wider text-text-secondary hover:text-accent-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
        >
          Dashboard
        </Link>
      </div>
    </header>
  )
}
