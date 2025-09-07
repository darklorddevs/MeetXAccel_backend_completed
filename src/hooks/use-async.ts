/**
 * Async Hook
 * 
 * Custom hook for managing async operations with loading, error, and success states.
 */

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseAsyncState<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

interface UseAsyncReturn<T> extends UseAsyncState<T> {
  execute: (...args: any[]) => Promise<T>
  reset: () => void
}

export function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate: boolean = false
): UseAsyncReturn<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  })

  const mountedRef = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        isSuccess: false,
        isError: false,
      }))

      try {
        const data = await asyncFunction(...args)
        
        if (mountedRef.current) {
          setState({
            data,
            error: null,
            isLoading: false,
            isSuccess: true,
            isError: false,
          })
        }
        
        return data
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error))
        
        if (mountedRef.current) {
          setState({
            data: null,
            error: errorObj,
            isLoading: false,
            isSuccess: false,
            isError: true,
          })
        }
        
        throw errorObj
      }
    },
    [asyncFunction]
  )

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    })
  }, [])

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return {
    ...state,
    execute,
    reset,
  }
}

// Hook for async operations with automatic retry
export function useAsyncWithRetry<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
) {
  const [retryCount, setRetryCount] = useState(0)
  const { execute: baseExecute, ...state } = useAsync(asyncFunction)

  const executeWithRetry = useCallback(
    async (...args: any[]): Promise<T> => {
      let lastError: Error

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const result = await baseExecute(...args)
          setRetryCount(0) // Reset retry count on success
          return result
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error))
          
          if (attempt < maxRetries) {
            setRetryCount(attempt + 1)
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)))
          }
        }
      }

      throw lastError!
    },
    [baseExecute, maxRetries, retryDelay]
  )

  return {
    ...state,
    execute: executeWithRetry,
    retryCount,
    reset: () => {
      state.reset()
      setRetryCount(0)
    },
  }
}