# 📝 LAP Quiz — Mechatronics Exam Preparation

[![Live Demo](https://img.shields.io/badge/Live-lap--quiz.vercel.app-000?logo=vercel)](https://lap-quiz.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Interactive web application for preparing for the Austrian final apprenticeship exam (Lehrabschlussprüfung / LAP) in mechatronics. Built as a companion to the [LAP Dashboard](https://github.com/mx-town/lap-dashboard) lexicon.

**🔗 [Try it live → lap-quiz.vercel.app](https://lap-quiz.vercel.app)**

---

## Features

### Quiz Modes

| Mode | Description |
|------|-------------|
| **Exam Simulation** | 20 questions, 30 min timer, all chapters — mirrors the real LAP |
| **Chapter Learning** | Focus on a specific chapter with immediate feedback |
| **Blitz Round** | Right/wrong under time pressure with a streak system |
| **Practice Scenario** | Troubleshooting and system analysis exercises |
| **My Specialization** | 9 job profiles with focused + cross-topic questions |

### Job Profiles

Covers 9 mechatronics specializations: switchgear assembly, PLC programming, maintenance, SMT manufacturing, robotics, building services, fire protection, pneumatics, and production/mechanics.

### Other Features

- **Stats tracking** — average score, best streak, session count, chapter progress (stored locally)
- **Responsive design** — works on desktop and mobile
- **Animated UI** — smooth transitions with Framer Motion
- **Offline-capable** — all data stored in localStorage, no account needed

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | App Router, SSR |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| localStorage | Stats persistence |

---

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Related

- **[LAP Dashboard](https://github.com/mx-town/lap-dashboard)** — Structured lexicon with 10 categories of electrical engineering terms

---

## License

MIT — built for apprenticeship exam preparation in Austria.
