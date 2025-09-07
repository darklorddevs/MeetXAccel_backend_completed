/**
 * API Hooks
 * 
 * Custom hooks for API operations using TanStack Query.
 * These hooks provide caching, loading states, and error handling.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'
import { errorUtils } from '@/lib/utils'

// Query keys for consistent caching
export const queryKeys = {
  // User queries
  currentUser: ['user', 'current'] as const,
  userProfile: ['user', 'profile'] as const,
  userSessions: ['user', 'sessions'] as const,
  userAuditLogs: ['user', 'audit-logs'] as const,
  
  // Event type queries
  eventTypes: (filters?: any) => ['event-types', filters] as const,
  eventType: (id: string) => ['event-types', id] as const,
  
  // Booking queries
  bookings: (filters?: any) => ['bookings', filters] as const,
  booking: (id: string) => ['bookings', id] as const,
  
  // Availability queries
  availabilityRules: ['availability', 'rules'] as const,
  availabilityOverrides: ['availability', 'overrides'] as const,
  blockedTimes: ['availability', 'blocked'] as const,
  availableSlots: (organizerSlug: string, eventSlug: string, params?: any) => 
    ['availability', 'slots', organizerSlug, eventSlug, params] as const,
  
  // Integration queries
  calendarIntegrations: ['integrations', 'calendar'] as const,
  videoIntegrations: ['integrations', 'video'] as const,
  webhookIntegrations: ['integrations', 'webhooks'] as const,
  integrationHealth: ['integrations', 'health'] as const,
  
  // Workflow queries
  workflows: (filters?: any) => ['workflows', filters] as const,
  workflow: (id: string) => ['workflows', id] as const,
  workflowExecutions: (workflowId?: string) => ['workflows', 'executions', workflowId] as const,
  
  // Notification queries
  notificationTemplates: ['notifications', 'templates'] as const,
  notificationPreferences: ['notifications', 'preferences'] as const,
  notificationLogs: ['notifications', 'logs'] as const,
  
  // Contact queries
  contacts: (filters?: any) => ['contacts', filters] as const,
  contact: (id: string) => ['contacts', id] as const,
  contactGroups: ['contacts', 'groups'] as const,
  
  // Analytics queries
  analytics: (type: string, params?: any) => ['analytics', type, params] as const,
} as const

// Generic hooks for common operations
export const useApiQuery = <T = any>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean
    staleTime?: number
    cacheTime?: number
    refetchOnWindowFocus?: boolean
  }
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...options,
  })
}

export const useApiMutation = <TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void
    onError?: (error: any, variables: TVariables) => void
    invalidateQueries?: readonly unknown[][]
    showSuccessToast?: boolean
    showErrorToast?: boolean
    successMessage?: string
  }
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      // Invalidate related queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey })
        })
      }

      // Show success toast
      if (options?.showSuccessToast !== false) {
        toast.success(options?.successMessage || 'Operation completed successfully')
      }

      // Call custom success handler
      options?.onSuccess?.(data, variables)
    },
    onError: (error, variables) => {
      // Show error toast
      if (options?.showErrorToast !== false) {
        const errorMessage = errorUtils.getErrorMessage(error)
        toast.error(errorMessage)
      }

      // Call custom error handler
      options?.onError?.(error, variables)
    },
  })
}

// Specific API hooks will be added in subsequent phases
// For now, here are some basic examples:

// User hooks
export const useCurrentUser = () => {
  return useApiQuery(
    queryKeys.currentUser,
    () => api.get('/users/profile/'),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  )
}

export const useUserSessions = () => {
  return useApiQuery(
    queryKeys.userSessions,
    () => api.get('/users/sessions/')
  )
}

// Event type hooks
export const useEventTypes = (filters?: any) => {
  return useApiQuery(
    queryKeys.eventTypes(filters),
    () => api.get('/events/event-types/', { params: filters })
  )
}

export const useEventType = (id: string) => {
  return useApiQuery(
    queryKeys.eventType(id),
    () => api.get(`/events/event-types/${id}/`),
    {
      enabled: !!id,
    }
  )
}

// Booking hooks
export const useBookings = (filters?: any) => {
  return useApiQuery(
    queryKeys.bookings(filters),
    () => api.get('/events/bookings/', { params: filters })
  )
}

export const useCreateBooking = () => {
  return useApiMutation(
    (data: any) => api.post('/events/bookings/create/', data),
    {
      invalidateQueries: [queryKeys.bookings()],
      successMessage: 'Booking created successfully!',
    }
  )
}

// Availability hooks
export const useAvailableSlots = (
  organizerSlug: string, 
  eventSlug: string, 
  params?: any
) => {
  return useApiQuery(
    queryKeys.availableSlots(organizerSlug, eventSlug, params),
    () => api.get(`/events/slots/${organizerSlug}/${eventSlug}/`, { params }),
    {
      enabled: !!(organizerSlug && eventSlug),
      staleTime: 2 * 60 * 1000, // 2 minutes for availability data
    }
  )
}

// Integration hooks
export const useCalendarIntegrations = () => {
  return useApiQuery(
    queryKeys.calendarIntegrations,
    () => api.get('/integrations/calendar/')
  )
}

export const useVideoIntegrations = () => {
  return useApiQuery(
    queryKeys.videoIntegrations,
    () => api.get('/integrations/video/')
  )
}

// Workflow hooks
export const useWorkflows = (filters?: any) => {
  return useApiQuery(
    queryKeys.workflows(filters),
    () => api.get('/workflows/', { params: filters })
  )
}

// Notification hooks
export const useNotificationTemplates = () => {
  return useApiQuery(
    queryKeys.notificationTemplates,
    () => api.get('/notifications/templates/')
  )
}

export const useNotificationPreferences = () => {
  return useApiQuery(
    queryKeys.notificationPreferences,
    () => api.get('/notifications/preferences/')
  )
}

// Contact hooks
export const useContacts = (filters?: any) => {
  return useApiQuery(
    queryKeys.contacts(filters),
    () => api.get('/contacts/', { params: filters })
  )
}

// Utility hooks for common patterns
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => queryClient.invalidateQueries(),
    invalidateUser: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
    invalidateEventTypes: () => queryClient.invalidateQueries({ queryKey: ['event-types'] }),
    invalidateBookings: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
    invalidateAvailability: () => queryClient.invalidateQueries({ queryKey: ['availability'] }),
    invalidateIntegrations: () => queryClient.invalidateQueries({ queryKey: ['integrations'] }),
    invalidateWorkflows: () => queryClient.invalidateQueries({ queryKey: ['workflows'] }),
    invalidateNotifications: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    invalidateContacts: () => queryClient.invalidateQueries({ queryKey: ['contacts'] }),
  }
}

// Hook for optimistic updates
export const useOptimisticUpdate = <T>(
  queryKey: readonly unknown[],
  updateFn: (oldData: T | undefined, newData: any) => T
) => {
  const queryClient = useQueryClient()

  return {
    updateOptimistically: (newData: any) => {
      queryClient.setQueryData(queryKey, (oldData: T | undefined) => 
        updateFn(oldData, newData)
      )
    },
    revertOptimisticUpdate: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  }
}