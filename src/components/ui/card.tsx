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
        default: 'bg-neutral-50 border-primary-300 shadow-slate',
        secondary: 'bg-primary-100 border-primary-300',
        outline: 'bg-transparent border-primary-400',
        ghost: 'bg-transparent border-transparent',
        gradient: 'bg-gradient-to-br from-neutral-50 to-primary-100 border-primary-300 shadow-slate-md',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hover: {
        none: '',
        lift: 'hover:shadow-slate-lg hover:-translate-y-1',
        glow: 'hover:shadow-slate-xl hover:border-accent-blue/50',
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
        <p className="text-sm text-neutral-600">
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
    className={cn('flex items-center pt-4 border-t border-primary-200', className)}
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
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  'text-xs font-medium',
                  change.type === 'increase' ? 'text-accent-emerald' : 'text-accent-red'
                )}
              >
                {change.type === 'increase' ? '↗' : '↘'} {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-neutral-500 ml-1">
                vs {change.period}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="text-accent-blue opacity-80">
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
    active: 'border-accent-emerald',
    inactive: 'border-neutral-400',
    coming_soon: 'border-accent-orange',
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
            status === 'active' && 'bg-success-50 text-success-700 border border-success-200',
            status === 'inactive' && 'bg-neutral-100 text-neutral-600 border border-neutral-300',
            status === 'coming_soon' && 'bg-warning-50 text-warning-700 border border-warning-200'
          )}
        >
          {statusLabels[status]}
        </span>
      </div>

      <div className="flex items-start space-x-4">
        {icon && (
          <div className="flex-shrink-0 text-accent-blue">
            {icon}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            {title}
          </h3>
          
          <p className="text-neutral-600 mb-4">
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
        <div className="flex justify-center mb-4 text-neutral-400">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-neutral-700 mb-2">
        {title}
      </h3>
      
      <p className="text-neutral-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {action && (
        <div>{action}</div>
      )}
    </Card>
  )
}

export { Card, CardHeader, CardContent, CardFooter, cardVariants }