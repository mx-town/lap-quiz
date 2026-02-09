"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Target, Zap, BookOpen, SlidersHorizontal, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/", label: "Start", icon: Home },
  { href: "/quiz/exam", label: "Prüfung", icon: Target },
  { href: "/quiz/blitz", label: "Blitz", icon: Zap },
  { href: "/quiz/chapter", label: "Kapitel", icon: BookOpen },
  { href: "/quiz/custom", label: "Fachbereich", icon: SlidersHorizontal },
  { href: "/stats", label: "Statistik", icon: BarChart3 },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-bg-primary border-t border-border-subtle pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-14">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                isActive ? "text-accent-primary" : "text-text-muted"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
