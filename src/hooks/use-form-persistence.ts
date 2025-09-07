/**
 * Form Persistence Hook
 * 
 * Custom hook for persisting form data to localStorage during editing.
 */

import { useEffect } from 'react'
import { useLocalStorage } from './use-local-storage'

interface UseFormPersistenceOptions {
  key: string
  data: Record<string, any>
  enabled?: boolean
  exclude?: string[]
}

export function useFormPersistence({
  key,
  data,
  enabled = true,
  exclude = [],
}: UseFormPersistenceOptions) {
  const [persistedData, setPersistedData, clearPersistedData] = useLocalStorage(
    `form_draft_${key}`,
    {}
  )

  // Save form data to localStorage
  useEffect(() => {
    if (!enabled) return

    const filteredData = Object.entries(data).reduce((acc, [field, value]) => {
      if (!exclude.includes(field) && value !== undefined && value !== '') {
        acc[field] = value
      }
      return acc
    }, {} as Record<string, any>)

    // Only save if there's meaningful data
    if (Object.keys(filteredData).length > 0) {
      setPersistedData(filteredData)
    }
  }, [data, enabled, exclude, key, setPersistedData])

  // Get persisted data
  const getPersistedData = () => {
    return enabled ? persistedData : {}
  }

  // Clear persisted data
  const clearDraft = () => {
    clearPersistedData()
  }

  // Check if there's a draft
  const hasDraft = () => {
    return enabled && Object.keys(persistedData).length > 0
  }

  return {
    getPersistedData,
    clearDraft,
    hasDraft,
  }
}

// Hook for auto-saving form drafts
export function useAutoSave<T extends Record<string, any>>(
  key: string,
  data: T,
  options?: {
    delay?: number
    enabled?: boolean
    exclude?: string[]
  }
) {
  const { delay = 1000, enabled = true, exclude = [] } = options || {}
  
  const [lastSaved, setLastSaved] = useLocalStorage(`${key}_last_saved`, null)
  const [isDirty, setIsDirty] = useLocalStorage(`${key}_dirty`, false)

  const { getPersistedData, clearDraft } = useFormPersistence({
    key,
    data,
    enabled,
    exclude,
  })

  // Mark as dirty when data changes
  useEffect(() => {
    if (enabled) {
      setIsDirty(true)
    }
  }, [data, enabled, setIsDirty])

  // Auto-save with debounce
  useEffect(() => {
    if (!enabled || !isDirty) return

    const timeoutId = setTimeout(() => {
      setLastSaved(new Date().toISOString())
      setIsDirty(false)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [data, delay, enabled, isDirty, setLastSaved, setIsDirty])

  return {
    lastSaved,
    isDirty,
    getPersistedData,
    clearDraft,
  }
}