/**
 * Badge Component
 * 
 * Small status indicators and labels with various styles and colors.
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-100 text-primary-700 hover:bg-primary-200',
        secondary: 'border-transparent bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
        success: 'border-transparent bg-success-50 text-success-700 border-success-200',
        error: 'border-transparent bg-error-50 text-error-700 border-error-200',
        warning: 'border-transparent bg-warning-50 text-warning-700 border-warning-200',
        info: 'border-transparent bg-info-50 text-info-700 border-info-200',
        outline: 'text-neutral-700 border-primary-300 hover:bg-primary-50',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode
}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

// Status Badge Component for common status indicators
interface StatusBadgeProps {
  status: string
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getVariant = (status: string) => {
    const statusLower = status.toLowerCase()
    
    if (['confirmed', 'active', 'healthy', 'completed', 'succeeded'].includes(statusLower)) {
      return 'success'
    }
    if (['cancelled', 'failed', 'error', 'unhealthy', 'suspended'].includes(statusLower)) {
      return 'error'
    }
    if (['pending', 'warning', 'degraded', 'expired'].includes(statusLower)) {
      return 'warning'
    }
    if (['info', 'rescheduled'].includes(statusLower)) {
      return 'info'
    }
    
    return 'default'
  }

  return (
    <Badge variant={getVariant(status)} className={className}>
      {status}
    </Badge>
  )
}

export { Badge, badgeVariants }