"use client"

import { cn } from "@/lib/utils"

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  label?: string
  showValue?: boolean
  className?: string
}

export function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  showValue = true,
  className,
}: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-3">
          {label && (
            <label className="text-sm text-text-muted">{label}</label>
          )}
          {showValue && (
            <span className="text-sm font-medium text-accent-primary">
              {value}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        {/* Track background */}
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          {/* Filled track */}
          <div
            className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-150"
            style={{ width: `${percent}%` }}
          />
        </div>
        {/* Native input (invisible but functional) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {/* Custom thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-accent-primary pointer-events-none transition-all duration-150 hover:scale-110"
          style={{ left: `calc(${percent}% - 10px)` }}
        />
      </div>
      {/* Min/Max labels */}
      <div className="flex justify-between text-xs text-text-muted mt-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
