/**
 * App Layout Component
 * 
 * Main layout wrapper for authenticated pages with header and sidebar.
 */

'use client'

import React, { useState } from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
  className?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, className }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header 
          onMenuToggle={() => setSidebarOpen(true)}
          showMenuButton={true}
        />

        {/* Page content */}
        <main className={cn('flex-1', className)}>
          {children}
        </main>
      </div>
    </div>
  )
}