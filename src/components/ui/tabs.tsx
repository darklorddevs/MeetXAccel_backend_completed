/**
 * Tabs Component
 * 
 * A flexible tabs component for organizing content into sections.
 */

import React from 'react'
import { Tab } from '@headlessui/react'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
  badge?: string | number
  icon?: React.ComponentType<any>
}

interface TabsProps {
  tabs: TabItem[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  className?: string
  variant?: 'default' | 'pills' | 'underline'
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  className,
  variant = 'default',
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(() => {
    if (defaultTab) {
      const index = tabs.findIndex(tab => tab.id === defaultTab)
      return index >= 0 ? index : 0
    }
    return 0
  })

  const handleTabChange = (index: number) => {
    setSelectedIndex(index)
    if (onChange) {
      onChange(tabs[index].id)
    }
  }

  const getTabListClasses = () => {
    switch (variant) {
      case 'pills':
        return 'flex space-x-1 rounded-lg bg-primary-100 p-1'
      case 'underline':
        return 'flex space-x-8 border-b border-primary-200'
      default:
        return 'flex space-x-1 rounded-lg bg-primary-100 p-1'
    }
  }

  const getTabClasses = (selected: boolean, disabled: boolean) => {
    const baseClasses = 'flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2'
    
    switch (variant) {
      case 'pills':
        return cn(
          baseClasses,
          'rounded-md',
          selected
            ? 'bg-neutral-50 text-accent-blue shadow-sm'
            : 'text-neutral-600 hover:text-neutral-700 hover:bg-primary-50',
          disabled && 'opacity-50 cursor-not-allowed'
        )
      case 'underline':
        return cn(
          baseClasses,
          'border-b-2 pb-2',
          selected
            ? 'border-accent-blue text-accent-blue'
            : 'border-transparent text-neutral-600 hover:text-neutral-700 hover:border-primary-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )
      default:
        return cn(
          baseClasses,
          'rounded-md',
          selected
            ? 'bg-neutral-50 text-accent-blue shadow-sm'
            : 'text-neutral-600 hover:text-neutral-700 hover:bg-primary-50',
          disabled && 'opacity-50 cursor-not-allowed'
        )
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
        <Tab.List className={getTabListClasses()}>
          {tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              disabled={tab.disabled}
              className={({ selected }) => getTabClasses(selected, !!tab.disabled)}
            >
              {tab.icon && <tab.icon className="h-4 w-4 mr-2" />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-accent-blue rounded-full">
                  {tab.badge}
                </span>
              )}
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels className="mt-6">
          {tabs.map((tab) => (
            <Tab.Panel
              key={tab.id}
              className="focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 rounded-lg"
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}