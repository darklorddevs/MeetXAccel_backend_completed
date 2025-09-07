/**
 * Dashboard Layout
 * 
 * Layout for all authenticated dashboard pages.
 */

'use client'

import React from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { useRequireAuth } from '@/hooks/use-auth'
import { PageLoading } from '@/components/ui/loading'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useRequireAuth()

  // Show loading while checking authentication
  if (isLoading) {
    return <PageLoading message="Loading dashboard..." />
  }

  // Show nothing if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null
  }

  return <AppLayout>{children}</AppLayout>
}