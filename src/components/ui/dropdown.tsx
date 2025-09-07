/**
 * Dropdown Component
 * 
 * A flexible dropdown menu component using Headless UI.
 */

import React from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDown, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

export interface DropdownItem {
  id: string
  label: string
  icon?: React.ComponentType<any>
  onClick?: () => void
  href?: string
  disabled?: boolean
  danger?: boolean
  separator?: boolean
}

interface DropdownProps {
  items: DropdownItem[]
  trigger?: React.ReactNode
  triggerClassName?: string
  menuClassName?: string
  align?: 'left' | 'right'
  disabled?: boolean
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  trigger,
  triggerClassName,
  menuClassName,
  align = 'right',
  disabled = false,
}) => {
  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className={triggerClassName}
      disabled={disabled}
    >
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  )

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={React.Fragment}>
        {trigger || defaultTrigger}
      </Menu.Button>

      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute z-10 mt-2 w-56 origin-top-right rounded-lg bg-neutral-50 border border-primary-300 shadow-slate-lg focus:outline-none',
            align === 'left' && 'origin-top-left left-0',
            align === 'right' && 'origin-top-right right-0',
            menuClassName
          )}
        >
          <div className="p-1">
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                {item.separator && index > 0 && (
                  <div className="my-1 border-t border-primary-200" />
                )}
                
                <Menu.Item disabled={item.disabled}>
                  {({ active }) => {
                    const itemContent = (
                      <div
                        className={cn(
                          'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                          active && !item.disabled ? 'bg-primary-100 text-neutral-900' : 'text-neutral-700',
                          item.disabled && 'opacity-50 cursor-not-allowed',
                          item.danger && !item.disabled && 'text-error-600 hover:bg-error-50'
                        )}
                      >
                        {item.icon && (
                          <item.icon className="h-4 w-4 mr-3" />
                        )}
                        {item.label}
                      </div>
                    )

                    if (item.href) {
                      return (
                        <a href={item.href} className="block">
                          {itemContent}
                        </a>
                      )
                    }

                    return (
                      <button
                        onClick={item.onClick}
                        disabled={item.disabled}
                        className="w-full text-left"
                      >
                        {itemContent}
                      </button>
                    )
                  }}
                </Menu.Item>
              </React.Fragment>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

// Select Dropdown Component
interface SelectDropdownProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option',
  disabled = false,
  className,
}) => {
  const selectedOption = options.find(option => option.value === value)

  const dropdownItems: DropdownItem[] = options.map(option => ({
    id: option.value,
    label: option.label,
    onClick: () => onChange(option.value),
  }))

  const trigger = (
    <Button
      variant="outline"
      className={cn('justify-between', className)}
      disabled={disabled}
    >
      <span>{selectedOption?.label || placeholder}</span>
      <ChevronDown className="h-4 w-4 ml-2" />
    </Button>
  )

  return (
    <Dropdown
      items={dropdownItems}
      trigger={trigger}
      disabled={disabled}
    />
  )
}