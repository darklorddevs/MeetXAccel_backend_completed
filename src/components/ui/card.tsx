/**
 * Card Component
 * 
 * A flexible card component for displaying content with Monkai theme styling.
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  // Base styles
  'rounded-lg border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-primary-800 border-primary-700 shadow-monkai',
        secondary: 'bg-primary-900 border-primary-800',
        outline: 'bg-transparent border-primary-600',
        ghost: 'bg-transparent border-transparent',
        gradient: 'bg-gradient-to-br from-primary-800 to-primary-900 border-primary-700 shadow-monkai-lg',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hover: {
        none: '',
        lift: 'hover:shadow-monkai-lg hover:-translate-y-1',
        glow: 'hover:shadow-monkai-xl hover:border-accent-pink/50',
        scale: 'hover:scale-105',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hover: 'none',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, hover, className }))}
      {...props}
    />
  )
)
Card.displayName = 'Card'

// Card Header Component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: React.ReactNode
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, action, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5', className)}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-semibold text-neutral-100">
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      
      {description && (
        <p className="text-sm text-neutral-400">
          {description}
        </p>
      )}
      
      {children}
    </div>
  )
)
CardHeader.displayName = 'CardHeader'

// Card Content Component
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
))
CardContent.displayName = 'CardContent'

// Card Footer Component
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4 border-t border-primary-700', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

// Stats Card Component
interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period: string
  }
  icon?: React.ReactNode
  className?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  className,
}) => {
  return (
    <Card variant="gradient" hover="lift" className={className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-400">{title}</p>
          <p className="text-2xl font-bold text-neutral-100 mt-1">{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  'text-xs font-medium',
                  change.type === 'increase' ? 'text-success-500' : 'text-error-500'
                )}
              >
                {change.type === 'increase' ? '↗' : '↘'} {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-neutral-400 ml-1">
                vs {change.period}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="text-accent-pink opacity-80">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

// Feature Card Component
interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: React.ReactNode
  status?: 'active' | 'inactive' | 'coming_soon'
  className?: string
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  action,
  status = 'active',
  className,
}) => {
  const statusColors = {
    active: 'border-success-500',
    inactive: 'border-neutral-600',
    coming_soon: 'border-warning-500',
  }

  const statusLabels = {
    active: 'Active',
    inactive: 'Inactive',
    coming_soon: 'Coming Soon',
  }

  return (
    <Card 
      variant="default" 
      hover="glow" 
      className={cn('relative', statusColors[status], className)}
    >
      {/* Status badge */}
      <div className="absolute top-4 right-4">
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            status === 'active' && 'bg-success-500/20 text-success-500',
            status === 'inactive' && 'bg-neutral-600/20 text-neutral-400',
            status === 'coming_soon' && 'bg-warning-500/20 text-warning-500'
          )}
        >
          {statusLabels[status]}
        </span>
      </div>

      <div className="flex items-start space-x-4">
        {icon && (
          <div className="flex-shrink-0 text-accent-pink">
            {icon}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-neutral-100 mb-2">
            {title}
          </h3>
          
          <p className="text-neutral-300 mb-4">
            {description}
          </p>
          
          {action && (
            <div>{action}</div>
          )}
        </div>
      </div>
    </Card>
  )
}

// Empty state component
interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <Card variant="ghost" className={cn('text-center py-12', className)}>
      {icon && (
        <div className="flex justify-center mb-4 text-neutral-500">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-neutral-200 mb-2">
        {title}
      </h3>
      
      <p className="text-neutral-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {action && (
        <div>{action}</div>
      )}
    </Card>
  )
}

export { Card, CardHeader, CardContent, CardFooter, cardVariants }