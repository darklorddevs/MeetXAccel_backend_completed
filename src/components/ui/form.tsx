/**
 * Form Components
 * 
 * Reusable form components and layouts for consistent form styling.
 */

import React from 'react'
import { cn } from '@/lib/utils'

// Form Container
interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

export const Form: React.FC<FormProps> = ({ className, children, ...props }) => {
  return (
    <form className={cn('space-y-6', className)} {...props}>
      {children}
    </form>
  )
}

// Form Section
interface FormSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="border-b border-primary-200 pb-4">
          {title && (
            <h3 className="text-lg font-semibold text-neutral-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-neutral-600 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

// Form Field
interface FormFieldProps {
  children: React.ReactNode
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({ children, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  )
}

// Form Grid
interface FormGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export const FormGrid: React.FC<FormGridProps> = ({
  children,
  columns = 2,
  className,
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', gridClasses[columns], className)}>
      {children}
    </div>
  )
}

// Form Actions
interface FormActionsProps {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  className?: string
}

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  align = 'right',
  className,
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  return (
    <div className={cn(
      'flex flex-col sm:flex-row gap-3 pt-6 border-t border-primary-200',
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  )
}

// Form Error Summary
interface FormErrorSummaryProps {
  errors: Record<string, string>
  className?: string
}

export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({
  errors,
  className,
}) => {
  const errorEntries = Object.entries(errors)
  
  if (errorEntries.length === 0) return null

  return (
    <div className={cn(
      'bg-error-50 border border-error-200 rounded-lg p-4',
      className
    )}>
      <h4 className="text-sm font-medium text-error-700 mb-2">
        Please fix the following errors:
      </h4>
      
      <ul className="text-sm text-error-600 space-y-1">
        {errorEntries.map(([field, message]) => (
          <li key={field} className="flex items-center">
            <span className="w-1 h-1 bg-error-500 rounded-full mr-2" />
            <span className="font-medium capitalize">{field.replace('_', ' ')}:</span>
            <span className="ml-1">{message}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}