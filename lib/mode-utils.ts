export const modeConfig = {
  blitz: {
    color: 'cyan',
    border: 'border-cyan-500/30',
    hoverBorder: 'hover:border-cyan-400',
    text: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-100 dark:bg-cyan-500/10',
  },
  exam: {
    color: 'blue',
    border: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-400',
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-500/10',
  },
  chapter: {
    color: 'violet',
    border: 'border-violet-500/30',
    hoverBorder: 'hover:border-violet-400',
    text: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-100 dark:bg-violet-500/10',
  },
  custom: {
    color: 'green',
    border: 'border-green-500/30',
    hoverBorder: 'hover:border-green-400',
    text: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-500/10',
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
