/**
 * Global Loading Component
 * 
 * Default loading UI for pages and route transitions.
 */

import React from 'react'
import { PageLoading } from '@/components/ui/loading'

export default function Loading() {
  return <PageLoading message="Loading..." />
}