/**
 * Enhanced API Client
 * 
 * Comprehensive API client with advanced error handling, retry logic,
 * and request/response interceptors.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { toast } from '@/components/ui/toast'

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: any,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Request metadata interface
interface RequestMetadata {
  startTime: Date
  retryCount?: number
}

// Enhanced Axios config with metadata
interface EnhancedAxiosRequestConfig extends AxiosRequestConfig {
  metadata?: RequestMetadata
  skipAuth?: boolean
  skipErrorToast?: boolean
  retryCount?: number
}

// Create enhanced API client
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  }) as AxiosInstance

  // Request interceptor
  client.interceptors.request.use(
    (config: EnhancedAxiosRequestConfig) => {
      // Add authentication token
      if (!config.skipAuth) {
        const token = getAuthToken()
        if (token) {
          config.headers = config.headers || {}
          config.headers.Authorization = `Token ${token}`
        }
      }

      // Add request metadata
      config.metadata = {
        startTime: new Date(),
        retryCount: config.retryCount || 0,
      }

      // Add request ID for tracking
      config.headers = config.headers || {}
      config.headers['X-Request-ID'] = generateRequestId()

      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response time in development
      if (process.env.NODE_ENV === 'development' && response.config.metadata) {
        const duration = new Date().getTime() - response.config.metadata.startTime.getTime()
        console.log(`🌐 ${response.config.method?.toUpperCase()} ${response.config.url}: ${duration}ms`)
      }

      return response
    },
    async (error: AxiosError) => {
      const config = error.config as EnhancedAxiosRequestConfig

      // Handle network errors
      if (!error.response) {
        const apiError = new ApiError(
          0,
          'Network error. Please check your connection and try again.',
          null,
          'NETWORK_ERROR'
        )
        
        if (!config?.skipErrorToast) {
          toast.error(apiError.message)
        }
        
        return Promise.reject(apiError)
      }

      const { status, data } = error.response

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect
          clearAuthToken()
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
          throw new ApiError(401, 'Your session has expired. Please sign in again.', data, 'UNAUTHORIZED')

        case 403:
          throw new ApiError(403, 'You do not have permission to perform this action.', data, 'FORBIDDEN')

        case 404:
          throw new ApiError(404, 'The requested resource was not found.', data, 'NOT_FOUND')

        case 422:
          // Validation errors
          const validationMessage = data?.message || 'Please check your input and try again.'
          throw new ApiError(422, validationMessage, data, 'VALIDATION_ERROR')

        case 429:
          // Rate limiting
          const retryAfter = error.response.headers['retry-after'] || '60'
          throw new ApiError(429, `Too many requests. Please try again in ${retryAfter} seconds.`, data, 'RATE_LIMITED')

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors - attempt retry for GET requests
          if (config?.method === 'get' && (config.retryCount || 0) < 2) {
            const retryConfig = {
              ...config,
              retryCount: (config.retryCount || 0) + 1,
            }
            
            // Exponential backoff
            const delay = Math.pow(2, retryConfig.retryCount) * 1000
            await new Promise(resolve => setTimeout(resolve, delay))
            
            return client.request(retryConfig)
          }
          
          throw new ApiError(status, 'Server error. Please try again later.', data, 'SERVER_ERROR')

        default:
          throw new ApiError(status, data?.message || 'An unexpected error occurred.', data, 'UNKNOWN_ERROR')
      }
    }
  )

  return client
}

// Utility functions
const generateRequestId = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('auth_token', token)
}

export const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('auth_token')
}

// Create the API client instance
export const apiClient = createApiClient()

// Generic API methods with enhanced error handling
export const api = {
  get: async <T = any>(url: string, config?: EnhancedAxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config)
    return response.data
  },

  post: async <T = any>(url: string, data?: any, config?: EnhancedAxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config)
    return response.data
  },

  put: async <T = any>(url: string, data?: any, config?: EnhancedAxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config)
    return response.data
  },

  patch: async <T = any>(url: string, data?: any, config?: EnhancedAxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config)
    return response.data
  },

  delete: async <T = any>(url: string, config?: EnhancedAxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config)
    return response.data
  },

  // File upload with progress tracking
  upload: async <T = any>(
    url: string, 
    file: File, 
    onProgress?: (progress: number) => void,
    config?: EnhancedAxiosRequestConfig
  ): Promise<T> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    return response.data
  },
}

// API endpoints configuration
export const endpoints = {
  auth: {
    login: '/users/login/',
    register: '/users/register/',
    logout: '/users/logout/',
    profile: '/users/profile/',
    changePassword: '/users/change-password/',
    forcePasswordChange: '/users/force-password-change/',
    requestPasswordReset: '/users/request-password-reset/',
    confirmPasswordReset: '/users/confirm-password-reset/',
    verifyEmail: '/users/verify-email/',
    resendVerification: '/users/resend-verification/',
  },
  users: {
    list: '/users/',
    detail: (id: string) => `/users/${id}/`,
    sessions: '/users/sessions/',
    auditLogs: '/users/audit-logs/',
    roles: '/users/roles/',
    permissions: '/users/permissions/',
    invitations: '/users/invitations/',
    mfa: {
      devices: '/users/mfa/devices/',
      setup: '/users/mfa/setup/',
      verify: '/users/mfa/verify/',
      disable: '/users/mfa/disable/',
    },
    sso: {
      saml: '/users/sso/saml/',
      oidc: '/users/sso/oidc/',
      initiate: '/users/sso/initiate/',
      discovery: '/users/sso/discovery/',
      sessions: '/users/sso/sessions/',
    },
  },
  eventTypes: {
    list: '/events/event-types/',
    create: '/events/event-types/',
    detail: (id: string) => `/events/event-types/${id}/`,
    public: (organizerSlug: string) => `/events/public/${organizerSlug}/`,
    publicEventType: (organizerSlug: string, eventSlug: string) => 
      `/events/public/${organizerSlug}/${eventSlug}/`,
  },
  bookings: {
    list: '/events/bookings/',
    create: '/events/bookings/create/',
    detail: (id: string) => `/events/bookings/${id}/`,
    cancel: (id: string) => `/events/bookings/${id}/cancel/`,
    manage: (token: string) => `/events/booking/${token}/manage/`,
    analytics: '/events/analytics/',
    auditLogs: (id: string) => `/events/bookings/${id}/audit/`,
    addAttendee: (id: string) => `/events/bookings/${id}/attendees/add/`,
    removeAttendee: (bookingId: string, attendeeId: string) => 
      `/events/bookings/${bookingId}/attendees/${attendeeId}/remove/`,
  },
  availability: {
    rules: '/availability/rules/',
    overrides: '/availability/overrides/',
    blockedTimes: '/availability/blocked/',
    recurringBlocks: '/availability/recurring-blocks/',
    bufferSettings: '/availability/buffer/',
    calculatedSlots: (organizerSlug: string) => `/availability/calculated-slots/${organizerSlug}/`,
    stats: '/availability/stats/',
    clearCache: '/availability/cache/clear/',
    precomputeCache: '/availability/cache/precompute/',
  },
  integrations: {
    calendar: '/integrations/calendar/',
    video: '/integrations/video/',
    webhooks: '/integrations/webhooks/',
    logs: '/integrations/logs/',
    oauth: {
      initiate: '/integrations/oauth/initiate/',
      callback: '/integrations/oauth/callback/',
    },
    health: '/integrations/health/',
    conflicts: '/integrations/calendar/conflicts/',
  },
  workflows: {
    list: '/workflows/',
    create: '/workflows/',
    detail: (id: string) => `/workflows/${id}/`,
    test: (id: string) => `/workflows/${id}/test/`,
    validate: (id: string) => `/workflows/${id}/validate/`,
    duplicate: (id: string) => `/workflows/${id}/duplicate/`,
    actions: (workflowId: string) => `/workflows/${workflowId}/actions/`,
    actionDetail: (id: string) => `/workflows/actions/${id}/`,
    executions: '/workflows/executions/',
    templates: '/workflows/templates/',
    createFromTemplate: '/workflows/templates/create-from/',
    performanceStats: '/workflows/performance-stats/',
  },
  notifications: {
    templates: '/notifications/templates/',
    preferences: '/notifications/preferences/',
    logs: '/notifications/logs/',
    send: '/notifications/send/',
    stats: '/notifications/stats/',
    health: '/notifications/health/',
    testTemplate: (id: string) => `/notifications/templates/${id}/test/`,
    resend: (id: string) => `/notifications/${id}/resend/`,
  },
  contacts: {
    list: '/contacts/',
    create: '/contacts/',
    detail: (id: string) => `/contacts/${id}/`,
    groups: '/contacts/groups/',
    stats: '/contacts/stats/',
    import: '/contacts/import/',
    export: '/contacts/export/',
    merge: '/contacts/merge/',
    interactions: (contactId: string) => `/contacts/${contactId}/interactions/`,
  },
} as const

export type ApiEndpoints = typeof endpoints