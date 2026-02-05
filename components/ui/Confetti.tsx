"use client"

import { useEffect, useState } from "react"

interface ConfettiProps {
  trigger: boolean
  duration?: number
}

interface Particle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  scale: number
  velocity: { x: number; y: number }
}

const COLORS = [
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#10b981", // green
  "#f59e0b", // amber
  "#3b82f6", // blue
  "#ec4899", // pink
  "#f97316", // orange
]

export function Confetti({ trigger, duration = 3000 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (!trigger) return

    setIsActive(true)

    // Create particles
    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20, // Center with some spread
      y: 30,
      rotation: Math.random() * 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      scale: 0.5 + Math.random() * 0.5,
      velocity: {
        x: (Math.random() - 0.5) * 15,
        y: -10 - Math.random() * 10,
      },
    }))

    setParticles(newParticles)

    // Cleanup after duration
    const timeout = setTimeout(() => {
      setIsActive(false)
      setParticles([])
    }, duration)

    return () => clearTimeout(timeout)
  }, [trigger, duration])

  if (!isActive || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
            animation: `confetti-fall ${1.5 + Math.random()}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.3}s`,
            ["--vx" as string]: `${particle.velocity.x}vw`,
            ["--vy" as string]: `${particle.velocity.y}vh`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--vx)) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// Simple celebration burst for smaller celebrations
export function CelebrationBurst({ trigger }: { trigger: boolean }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (trigger) {
      setShow(true)
      const timeout = setTimeout(() => setShow(false), 600)
      return () => clearTimeout(timeout)
    }
  }, [trigger])

  if (!show) return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-accent-warning"
          style={{
            animation: "burst 0.6s ease-out forwards",
            animationDelay: `${i * 0.02}s`,
            ["--angle" as string]: `${i * 45}deg`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes burst {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-40px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
