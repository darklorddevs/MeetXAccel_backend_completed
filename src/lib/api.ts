/**
 * API Client Configuration
 * 
 * This file sets up the Axios instance and provides wrapper functions
 * for making API calls to the Django backend. It includes authentication,
 * error handling, and request/response interceptors.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiError, ApiResponse } from '@/types/api'

// Create Axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor - Add authentication token
  client.interceptors.request.use(
    (config) => {
      // Get token from localStorage or wherever it's stored
      const token = getAuthToken()
      if (token) {
        config.headers.Authorization = `Token ${token}`
      }
      
      // Add request timestamp for debugging
      config.metadata = { startTime: new Date() }
      
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor - Handle responses and errors
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response time in development
      if (process.env.NODE_ENV === 'development' && response.config.metadata) {
        const endTime = new Date()
        const duration = endTime.getTime() - response.config.metadata.startTime.getTime()
        console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url}: ${duration}ms`)
      }
      
      return response
    },
    async (error) => {
      const originalRequest = error.config

      // Handle different error scenarios
      if (error.response) {
        const { status, data } = error.response

        switch (status) {
          case 401:
            // Unauthorized - clear auth and redirect to login
            clearAuthToken()
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            break

          case 403:
            // Forbidden - user doesn't have permission
            throw new ApiError(403, 'You do not have permission to perform this action', data)

          case 404:
            // Not found
            throw new ApiError(404, 'The requested resource was not found', data)

          case 422:
            // Validation error
            throw new ApiError(422, 'Validation failed', data)

          case 429:
            // Rate limit exceeded
            const retryAfter = error.response.headers['retry-after']
            throw new ApiError(429, `Rate limit exceeded. Try again in ${retryAfter || 60} seconds`, data)

          case 500:
            // Internal server error
            throw new ApiError(500, 'An internal server error occurred. Please try again later.', data)

          default:
            throw new ApiError(status, data?.message || 'An unexpected error occurred', data)
        }
      } else if (error.request) {
        // Network error
        throw new ApiError(0, 'Network error. Please check your connection and try again.')
      } else {
        // Other error
        throw new ApiError(0, error.message || 'An unexpected error occurred')
      }
    }
  )

  return client
}

// Create the API client instance
export const apiClient = createApiClient()

// Custom ApiError class
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Authentication token management
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

// Generic API wrapper functions
export const api = {
  // Generic HTTP methods
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config)
    return response.data
  },

  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config)
    return response.data
  },

  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config)
    return response.data
  },

  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config)
    return response.data
  },

  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config)
    return response.data
  },

  // File upload helper
  upload: async <T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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

// API endpoint helpers - these will be expanded in subsequent phases
export const endpoints = {
  // Authentication
  auth: {
    login: '/users/login/',
    register: '/users/register/',
    logout: '/users/logout/',
    profile: '/users/profile/',
    changePassword: '/users/change-password/',
    requestPasswordReset: '/users/request-password-reset/',
    confirmPasswordReset: '/users/confirm-password-reset/',
    verifyEmail: '/users/verify-email/',
    resendVerification: '/users/resend-verification/',
  },

  // Users
  users: {
    sessions: '/users/sessions/',
    auditLogs: '/users/audit-logs/',
    mfa: {
      devices: '/users/mfa/devices/',
      setup: '/users/mfa/setup/',
      verify: '/users/mfa/verify/',
      disable: '/users/mfa/disable/',
    },
  },

  // Event Types
  eventTypes: {
    list: '/events/event-types/',
    detail: (id: string) => `/events/event-types/${id}/`,
  },

  // Bookings
  bookings: {
    list: '/events/bookings/',
    create: '/events/bookings/create/',
    detail: (id: string) => `/events/bookings/${id}/`,
    manage: (token: string) => `/events/booking/${token}/manage/`,
  },

  // Availability
  availability: {
    rules: '/availability/rules/',
    overrides: '/availability/overrides/',
    blocked: '/availability/blocked/',
    calculatedSlots: (organizerSlug: string) => `/availability/calculated-slots/${organizerSlug}/`,
  },

  // Integrations
  integrations: {
    calendar: '/integrations/calendar/',
    video: '/integrations/video/',
    webhooks: '/integrations/webhooks/',
    oauth: {
      initiate: '/integrations/oauth/initiate/',
      callback: '/integrations/oauth/callback/',
    },
  },

  // Workflows
  workflows: {
    list: '/workflows/',
    detail: (id: string) => `/workflows/${id}/`,
    test: (id: string) => `/workflows/${id}/test/`,
    validate: (id: string) => `/workflows/${id}/validate/`,
  },

  // Notifications
  notifications: {
    templates: '/notifications/templates/',
    preferences: '/notifications/preferences/',
    logs: '/notifications/logs/',
  },

  // Contacts
  contacts: {
    list: '/contacts/',
    detail: (id: string) => `/contacts/${id}/`,
    groups: '/contacts/groups/',
    stats: '/contacts/stats/',
  },

  // Public endpoints
  public: {
    organizer: (slug: string) => `/events/public/${slug}/`,
    eventType: (organizerSlug: string, eventSlug: string) => 
      `/events/public/${organizerSlug}/${eventSlug}/`,
    availableSlots: (organizerSlug: string, eventSlug: string) => 
      `/events/slots/${organizerSlug}/${eventSlug}/`,
  },
} as const

// Type-safe API client methods will be added in subsequent phases
export type ApiEndpoints = typeof endpoints