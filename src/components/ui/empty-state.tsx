/**
 * Empty State Component
 * 
 * Component for displaying empty states with helpful messaging and actions.
 */

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface EmptyStateProps {
  icon?: React.ComponentType<any>
  title: string
  description: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
    icon?: React.ComponentType<any>
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}) => {
  return (
    <div className={cn('text-center py-12', className)}>
      {Icon && (
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary-500" />
          </div>
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
        {title}
      </h3>
      
      <p className="text-neutral-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            <>
              {action.href ? (
                <a href={action.href}>
                  <Button leftIcon={action.icon && <action.icon className="h-4 w-4" />}>
                    {action.label}
                  </Button>
                </a>
              ) : (
                <Button
                  onClick={action.onClick}
                  leftIcon={action.icon && <action.icon className="h-4 w-4" />}
                >
                  {action.label}
                </Button>
              )}
            </>
          )}
          
          {secondaryAction && (
            <>
              {secondaryAction.href ? (
                <a href={secondaryAction.href}>
                  <Button variant="outline">
                    {secondaryAction.label}
                  </Button>
                </a>
              ) : (
                <Button
                  variant="outline"
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}