/**
 * Switch Component
 * 
 * Toggle switch component for boolean settings.
 */

import React from 'react'
import { Switch as HeadlessSwitch } from '@headlessui/react'
import { cn } from '@/lib/utils'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: {
      switch: 'h-4 w-7',
      thumb: 'h-3 w-3',
      translate: 'translate-x-3',
    },
    md: {
      switch: 'h-5 w-9',
      thumb: 'h-4 w-4',
      translate: 'translate-x-4',
    },
    lg: {
      switch: 'h-6 w-11',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5',
    },
  }

  const { switch: switchClass, thumb: thumbClass, translate: translateClass } = sizeClasses[size]

  return (
    <HeadlessSwitch.Group>
      <div className={cn('flex items-center', className)}>
        <HeadlessSwitch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-primary-50',
            switchClass,
            checked ? 'bg-accent-blue' : 'bg-primary-300',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block rounded-full bg-white shadow-lg transform ring-0 transition duration-200 ease-in-out',
              thumbClass,
              checked ? translateClass : 'translate-x-0'
            )}
          />
        </HeadlessSwitch>
        
        {(label || description) && (
          <HeadlessSwitch.Label className="ml-3 cursor-pointer">
            <div>
              {label && (
                <span className="text-sm font-medium text-neutral-900">
                  {label}
                </span>
              )}
              {description && (
                <span className="text-sm text-neutral-600 block">
                  {description}
                </span>
              )}
            </div>
          </HeadlessSwitch.Label>
        )}
      </div>
    </HeadlessSwitch.Group>
  )
}