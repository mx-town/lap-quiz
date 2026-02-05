export const modeConfig = {
  blitz: {
    color: 'cyan',
    gradient: 'from-cyan-500',
    gradientFull: 'bg-gradient-to-br from-cyan-500/10 to-bg-surface',
    angle: 45,
    border: 'border-cyan-500/30',
    hoverBorder: 'hover:border-cyan-500/50',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    shadow: 'shadow-glow-cyan',
  },
  exam: {
    color: 'blue',
    gradient: 'from-blue-500',
    gradientFull: 'bg-gradient-to-br from-blue-950/50 to-bg-surface',
    angle: 135,
    border: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-500/50',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    shadow: 'shadow-glow-blue',
  },
  scenario: {
    color: 'amber',
    gradient: 'from-amber-500',
    gradientFull: 'bg-gradient-to-br from-amber-500/5 to-bg-surface',
    angle: 180,
    border: 'border-amber-500/30',
    hoverBorder: 'hover:border-amber-500/50',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    shadow: 'shadow-glow-warning',
  },
  chapter: {
    color: 'violet',
    gradient: 'from-violet-500',
    gradientFull: 'bg-gradient-to-br from-violet-500/10 to-bg-surface',
    angle: 90,
    border: 'border-violet-500/30',
    hoverBorder: 'hover:border-violet-500/50',
    text: 'text-violet-400',
    bg: 'bg-violet-500/10',
    shadow: 'shadow-glow-primary',
  },
  custom: {
    color: 'green',
    gradient: 'from-green-500',
    gradientFull: 'bg-gradient-to-br from-green-500/10 to-bg-surface',
    angle: 225,
    border: 'border-green-500/30',
    hoverBorder: 'hover:border-green-500/50',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    shadow: 'shadow-glow-success',
  },
} as const

export type QuizMode = keyof typeof modeConfig

export function getModeBg(mode: QuizMode): string {
  return modeConfig[mode].bg
}

export function getModeColor(mode: QuizMode): string {
  return modeConfig[mode].text
}

export function getModeBorder(mode: QuizMode): string {
  return modeConfig[mode].border
}

export function getModeGradient(mode: QuizMode): string {
  return modeConfig[mode].gradientFull
}

export function getModeShadow(mode: QuizMode): string {
  return modeConfig[mode].shadow
}
