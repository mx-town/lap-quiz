import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-bg-tertiary",
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-bg-surface border border-border-subtle p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-1.5 w-full" />
    </div>
  )
}

export function ProgressBarSkeleton() {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-1.5 w-full" />
    </div>
  )
}

export function QuestionCardSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-bg-surface border border-border-subtle p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-14" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-bg-surface border border-border-subtle p-6">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-10 h-10" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-16 mb-1" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export function ChapterCardSkeleton() {
  return (
    <div className="bg-bg-surface border border-border-subtle p-4 flex items-center gap-4">
      <Skeleton className="w-6 h-4" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-1.5 w-full" />
      </div>
      <Skeleton className="h-4 w-8" />
    </div>
  )
}
