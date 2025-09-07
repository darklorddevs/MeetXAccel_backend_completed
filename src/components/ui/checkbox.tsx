/**
 * Checkbox Component
 * 
 * Accessible checkbox component with label and description support.
 */

import React from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  indeterminate?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  id?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  indeterminate = false,
  size = 'md',
  className,
  id,
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const iconSizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  }

  return (
    <div className={cn('flex items-start', className)}>
      <div className="flex items-center h-5">
        <button
          type="button"
          role="checkbox"
          aria-checked={indeterminate ? 'mixed' : checked}
          aria-labelledby={label ? `${checkboxId}-label` : undefined}
          aria-describedby={description ? `${checkboxId}-description` : undefined}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={cn(
            'relative rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-primary-50',
            sizeClasses[size],
            checked || indeterminate
              ? 'bg-accent-blue border-accent-blue text-white'
              : 'bg-neutral-50 border-primary-300 hover:border-primary-400',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {(checked || indeterminate) && (
            <span className="absolute inset-0 flex items-center justify-center">
              {indeterminate ? (
                <Minus className={iconSizeClasses[size]} />
              ) : (
                <Check className={iconSizeClasses[size]} />
              )}
            </span>
          )}
        </button>
      </div>
      
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label
              id={`${checkboxId}-label`}
              htmlFor={checkboxId}
              className="text-sm font-medium text-neutral-900 cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={`${checkboxId}-description`}
              className="text-sm text-neutral-600"
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Checkbox Group Component
interface CheckboxGroupProps {
  options: Array<{
    value: string
    label: string
    description?: string
    disabled?: boolean
  }>
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  error?: string
  className?: string
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  value,
  onChange,
  label,
  error,
  className,
}) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue])
    } else {
      onChange(value.filter(v => v !== optionValue))
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      
      <div className="space-y-2">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            checked={value.includes(option.value)}
            onChange={(checked) => handleChange(option.value, checked)}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
          />
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-error-500 flex items-center">
          <span className="mr-1">⚠</span>
          {error}
        </p>
      )}
    </div>
  )
}