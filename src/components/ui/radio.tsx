/**
 * Radio Component
 * 
 * Radio button component for single selection from multiple options.
 */

import React from 'react'
import { RadioGroup } from '@headlessui/react'
import { cn } from '@/lib/utils'

interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface RadioProps {
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  disabled?: boolean
  orientation?: 'vertical' | 'horizontal'
  className?: string
}

export const Radio: React.FC<RadioProps> = ({
  options,
  value,
  onChange,
  label,
  error,
  disabled = false,
  orientation = 'vertical',
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          {label}
        </label>
      )}

      <RadioGroup value={value} onChange={onChange} disabled={disabled}>
        <div className={cn(
          'space-y-2',
          orientation === 'horizontal' && 'flex space-x-4 space-y-0'
        )}>
          {options.map((option) => (
            <RadioGroup.Option
              key={option.value}
              value={option.value}
              disabled={option.disabled || disabled}
              className={({ active, checked, disabled: optionDisabled }) =>
                cn(
                  'relative flex cursor-pointer rounded-lg px-4 py-3 border transition-all duration-200 focus:outline-none',
                  checked
                    ? 'bg-accent-blue/5 border-accent-blue text-accent-blue'
                    : 'bg-neutral-50 border-primary-300 hover:border-primary-400',
                  active && 'ring-2 ring-accent-blue ring-offset-2 ring-offset-primary-50',
                  optionDisabled && 'opacity-50 cursor-not-allowed'
                )
              }
            >
              {({ checked }) => (
                <>
                  <div className="flex items-center h-5">
                    <div
                      className={cn(
                        'h-4 w-4 rounded-full border-2 transition-all duration-200',
                        checked
                          ? 'border-accent-blue bg-accent-blue'
                          : 'border-primary-400 bg-neutral-50'
                      )}
                    >
                      {checked && (
                        <div className="h-full w-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-3">
                    <RadioGroup.Label
                      as="p"
                      className="text-sm font-medium text-neutral-900"
                    >
                      {option.label}
                    </RadioGroup.Label>
                    
                    {option.description && (
                      <RadioGroup.Description
                        as="span"
                        className="text-sm text-neutral-600"
                      >
                        {option.description}
                      </RadioGroup.Description>
                    )}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>

      {error && (
        <p className="mt-2 text-sm text-error-500 flex items-center">
          <span className="mr-1">⚠</span>
          {error}
        </p>
      )}
    </div>
  )
}