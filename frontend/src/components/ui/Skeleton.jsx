import React from 'react'
import { cn } from '../../utils/formatters'

// Generic skeleton block
export const Skeleton = ({ className, ...props }) => (
  <div
    className={cn('animate-pulse rounded-lg bg-[var(--color-surface-2)]', className)}
    {...props}
  />
)

// Stat card skeleton
export const StatCardSkeleton = () => (
  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
    <div className="flex justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-3 w-20" />
  </div>
)

// Timeline card skeleton
export const TimelineCardSkeleton = () => (
  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex gap-4">
    <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-full" />
    </div>
  </div>
)

// Avatar skeleton
export const AvatarSkeleton = ({ size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16', xl: 'w-24 h-24' }
  return <Skeleton className={cn(sizes[size], 'rounded-full flex-shrink-0')} />
}

// List skeleton
export const ListSkeleton = ({ count = 4, ItemComponent = TimelineCardSkeleton }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <ItemComponent key={i} />
    ))}
  </div>
)

// Dashboard skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
    </div>
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-64 w-full" />
        <ListSkeleton count={3} />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  </div>
)
