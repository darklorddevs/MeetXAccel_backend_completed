/**
 * Select Component
 * 
 * A flexible select component with search, multi-select, and custom options.
 */

import React from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  description?: string
  icon?: React.ComponentType<any>
}

interface SelectProps<T = string> {
  options: SelectOption<T>[]
  value?: T | T[]
  onChange: (value: T | T[]) => void
  placeholder?: string
  label?: string
  error?: string
  helperText?: string
  multiple?: boolean
  searchable?: boolean
  disabled?: boolean
  required?: boolean
  className?: string
}

export function Select<T = string>({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  helperText,
  multiple = false,
  searchable = false,
  disabled = false,
  required = false,
  className,
}: SelectProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('')

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchQuery) return options
    
    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery, searchable])

  // Get display value
  const getDisplayValue = () => {
    if (multiple) {
      const selectedOptions = options.filter(option => 
        Array.isArray(value) && value.includes(option.value)
      )
      return selectedOptions.length > 0 
        ? `${selectedOptions.length} selected`
        : placeholder
    } else {
      const selectedOption = options.find(option => option.value === value)
      return selectedOption?.label || placeholder
    }
  }

  // Handle selection
  const handleSelect = (selectedValue: T) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : []
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter(v => v !== selectedValue)
        : [...currentValues, selectedValue]
      onChange(newValues)
    } else {
      onChange(selectedValue)
    }
  }

  // Remove item (for multiple select)
  const removeItem = (itemValue: T) => {
    if (multiple && Array.isArray(value)) {
      onChange(value.filter(v => v !== itemValue))
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <Listbox
        value={value}
        onChange={onChange}
        multiple={multiple}
        disabled={disabled}
      >
        <div className="relative">
          {/* Selected values (for multiple) */}
          {multiple && Array.isArray(value) && value.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {value.map(selectedValue => {
                const option = options.find(opt => opt.value === selectedValue)
                if (!option) return null
                
                return (
                  <span
                    key={String(selectedValue)}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-accent-blue text-white"
                  >
                    {option.label}
                    <button
                      type="button"
                      onClick={() => removeItem(selectedValue)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )
              })}
            </div>
          )}

          <Listbox.Button
            className={cn(
              'relative w-full cursor-pointer rounded-lg border bg-neutral-50 py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-primary-50',
              error ? 'border-error-500' : 'border-primary-300',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span className="block truncate text-sm text-neutral-900">
              {getDisplayValue()}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-4 w-4 text-neutral-500" />
            </span>
          </Listbox.Button>

          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-neutral-50 border border-primary-300 shadow-slate-lg focus:outline-none">
              {searchable && (
                <div className="p-2 border-b border-primary-200">
                  <input
                    type="text"
                    placeholder="Search options..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  />
                </div>
              )}

              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-neutral-500">
                  {searchQuery ? 'No options found' : 'No options available'}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <Listbox.Option
                    key={String(option.value)}
                    value={option.value}
                    disabled={option.disabled}
                    className={({ active, selected }) =>
                      cn(
                        'relative cursor-pointer select-none py-2 pl-3 pr-9 text-sm',
                        active ? 'bg-accent-blue text-white' : 'text-neutral-900',
                        option.disabled && 'opacity-50 cursor-not-allowed'
                      )
                    }
                    onClick={() => handleSelect(option.value)}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          {option.icon && (
                            <option.icon className="h-4 w-4 mr-2" />
                          )}
                          <div>
                            <span className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}>
                              {option.label}
                            </span>
                            {option.description && (
                              <span className={cn('block text-xs', active ? 'text-white/80' : 'text-neutral-500')}>
                                {option.description}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {selected && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

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