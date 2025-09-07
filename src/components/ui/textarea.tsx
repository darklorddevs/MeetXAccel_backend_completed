/**
 * Textarea Component
 * 
 * A flexible textarea component with validation states and Subtle Slate theming.
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const textareaVariants = cva(
  // Base styles
  'flex w-full rounded-lg border bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none',
  {
    variants: {
      variant: {
        default: 'border-primary-300 focus:border-accent-blue focus:ring-accent-blue',
        error: 'border-error-500 focus:border-error-500 focus:ring-error-500',
        success: 'border-success-500 focus:border-success-500 focus:ring-success-500',
      },
      size: {
        sm: 'min-h-[80px] px-2 py-1 text-xs',
        md: 'min-h-[100px] px-3 py-2 text-sm',
        lg: 'min-h-[120px] px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  label?: string
  error?: string
  helperText?: string
  maxLength?: number
  showCharCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant, 
    size, 
    label, 
    error, 
    helperText, 
    maxLength,
    showCharCount = false,
    id,
    value,
    ...props 
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!error
    const finalVariant = hasError ? 'error' : variant
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <textarea
            className={cn(textareaVariants({ variant: finalVariant, size }), className)}
            ref={ref}
            id={textareaId}
            maxLength={maxLength}
            value={value}
            {...props}
          />
          
          {/* Character count */}
          {(showCharCount || maxLength) && (
            <div className="absolute bottom-2 right-2 text-xs text-neutral-500">
              {maxLength ? `${currentLength}/${maxLength}` : currentLength}
            </div>
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <p className="mt-1 text-sm text-error-500 flex items-center">
            <span className="mr-1">⚠</span>
            {error}
          </p>
        )}
        
        {/* Helper text */}
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-600">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }