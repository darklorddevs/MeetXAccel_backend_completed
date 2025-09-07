/**
 * Loading Components
 * 
 * Various loading indicators and skeleton components for the Monkai theme.
 */

import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

// Basic spinner component
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin text-accent-blue',
        sizeClasses[size],
        className
      )} 
    />
  )
}

// Full page loading component
interface PageLoadingProps {
  message?: string
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-50">
      <Spinner size="xl" />
      <p className="mt-4 text-neutral-600 text-lg">{message}</p>
    </div>
  )
}

// Inline loading component
interface InlineLoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({ 
  message = 'Loading...', 
  size = 'md',
  className 
}) => {
  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <Spinner size={size} />
      {message && (
        <span className="ml-3 text-neutral-600">{message}</span>
      )}
    </div>
  )
}

// Skeleton loading components
interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-primary-200',
        className
      )}
    >
      {children}
    </div>
  )
}

// Card skeleton
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-neutral-50 border border-primary-300 rounded-lg p-6 space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

// Table skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="bg-neutral-50 border border-primary-300 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-primary-200 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-primary-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Form skeleton
export const FormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Form fields */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      
      {/* Buttons */}
      <div className="flex space-x-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}

// Calendar skeleton
export const CalendarSkeleton: React.FC = () => {
  return (
    <div className="bg-neutral-50 border border-primary-300 rounded-lg p-6">
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
        
        {/* Calendar days */}
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  )
}

// Loading overlay for forms
interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  children: React.ReactNode
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  children,
}) => {
  return (
    <div className="relative">
      {children}
      
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
          <div className="bg-neutral-50 border border-primary-300 rounded-lg p-6 shadow-slate-lg">
            <div className="flex items-center space-x-3">
              <Spinner size="md" />
              <span className="text-neutral-700 font-medium">{message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}