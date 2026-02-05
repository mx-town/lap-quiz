# LAP Quiz — Mechatronik Prüfungsvorbereitung

Quiz-Webanwendung zur Vorbereitung auf die Lehrabschlussprüfung (LAP) für Mechatroniker in Österreich.

## Quiz-Modi

| Modus | Beschreibung |
|-------|-------------|
| **Prüfungssimulation** | 20 Fragen, 30 Min, alle Kapitel — wie die echte LAP |
| **Kapitelweises Lernen** | Gezielt ein Kapitel vertiefen mit sofortigem Feedback |
| **Blitzrunde** | Richtig/Falsch unter Zeitdruck, Streak-System |
| **Praxisszenario** | Fehlersuche und Anlagenanalyse |
| **Mein Fachbereich** | 9 Berufsprofile — Schwerpunkt + Querfragen |

## Berufsprofile

Schaltschrankbau, SPS-Programmierung, Instandhaltung, SMT-Fertigung, Robotik, Gebäudetechnik, Brandschutz, Pneumatik, Fertigung/Mechanik

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (PostgreSQL + Auth)
- Anthropic API (KI-Erklärungen)

## Setup

```bash
# Dependencies installieren
bun install

# Umgebungsvariablen konfigurieren
cp .env.local.example .env.local
# → Supabase + Anthropic Keys eintragen

# Datenbank-Schema anwenden
# → supabase/migrations/001_initial_schema.sql im Supabase SQL Editor ausführen

# Entwicklungsserver starten
bun run dev
```

## Deployment

```bash
vercel
```

Umgebungsvariablen in Vercel-Projekteinstellungen hinterlegen.

## Ergänzung zum LAP-Dashboard

Diese App ergänzt das [LAP-Dashboard](https://lap-dashboard.vercel.app) — das Nachschlagewerk für alle 11 Kapitel.
