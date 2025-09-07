/**
 * Authentication Utilities
 * 
 * This file contains authentication-related helper functions,
 * token management, and user session handling.
 */

import { AuthUser, LoginCredentials, RegisterData } from '@/types/auth'
import { api, setAuthToken, clearAuthToken } from './api'

// Authentication API calls
export const authApi = {
  // User login
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/users/login/', credentials)
    
    if (response.token) {
      setAuthToken(response.token)
    }
    
    return response
  },

  // User registration
  register: async (data: RegisterData) => {
    const response = await api.post('/users/register/', data)
    
    if (response.token) {
      setAuthToken(response.token)
    }
    
    return response
  },

  // User logout
  logout: async () => {
    try {
      await api.post('/users/logout/')
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    } finally {
      clearAuthToken()
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<AuthUser> => {
    return api.get('/users/profile/')
  },

  // Verify email
  verifyEmail: async (token: string) => {
    return api.post('/users/verify-email/', { token })
  },

  // Request password reset
  requestPasswordReset: async (email: string) => {
    return api.post('/users/request-password-reset/', { email })
  },

  // Confirm password reset
  confirmPasswordReset: async (token: string, newPassword: string) => {
    return api.post('/users/confirm-password-reset/', {
      token,
      new_password: newPassword,
      new_password_confirm: newPassword,
    })
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string) => {
    return api.post('/users/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPassword,
    })
  },

  // Force password change (for expired passwords)
  forcePasswordChange: async (newPassword: string) => {
    return api.post('/users/force-password-change/', {
      new_password: newPassword,
      new_password_confirm: newPassword,
    })
  },

  // Resend verification email
  resendVerification: async (email: string) => {
    return api.post('/users/resend-verification/', { email })
  },
}

// User session management
export const sessionUtils = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getAuthToken()
  },

  // Get user from token (decode if JWT, or fetch from API)
  getCurrentUser: async (): Promise<AuthUser | null> => {
    const token = getAuthToken()
    if (!token) return null

    try {
      return await authApi.getCurrentUser()
    } catch (error) {
      // Token might be invalid, clear it
      clearAuthToken()
      return null
    }
  },

  // Check if user has specific role
  hasRole: (user: AuthUser | null, roleName: string): boolean => {
    if (!user) return false
    return user.roles.some(role => role.name === roleName)
  },

  // Check if user has specific permission
  hasPermission: (user: AuthUser | null, permissionCode: string): boolean => {
    if (!user) return false
    
    // Check all roles for the permission
    return user.roles.some(role => 
      role.role_permissions.some(permission => permission.codename === permissionCode)
    )
  },

  // Check account status
  isAccountActive: (user: AuthUser | null): boolean => {
    return user?.account_status === 'active'
  },

  // Check if password is expired
  isPasswordExpired: (user: AuthUser | null): boolean => {
    return user?.account_status === 'password_expired' || 
           user?.account_status === 'password_expired_grace_period'
  },

  // Check if email is verified
  isEmailVerified: (user: AuthUser | null): boolean => {
    return user?.is_email_verified === true
  },

  // Check if MFA is enabled
  isMfaEnabled: (user: AuthUser | null): boolean => {
    return user?.is_mfa_enabled === true
  },
}

// Route protection utilities
export const routeUtils = {
  // Check if route requires authentication
  requiresAuth: (pathname: string): boolean => {
    const publicRoutes = [
      '/',
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/verify-email',
      '/invitation',
    ]
    
    // Public booking pages (organizer_slug/event_type_slug)
    const isPublicBookingPage = /^\/[^\/]+\/[^\/]+\/?$/.test(pathname)
    
    return !publicRoutes.includes(pathname) && !isPublicBookingPage
  },

  // Check if route requires specific role
  requiresRole: (pathname: string, user: AuthUser | null, roleName: string): boolean => {
    if (!user) return false
    
    // Admin routes
    const adminRoutes = ['/admin', '/users', '/system-settings']
    const requiresAdmin = adminRoutes.some(route => pathname.startsWith(route))
    
    if (requiresAdmin) {
      return sessionUtils.hasRole(user, 'admin')
    }
    
    return true
  },

  // Get redirect URL after login
  getRedirectUrl: (user: AuthUser | null, intendedUrl?: string): string => {
    // Handle account status redirects
    if (user) {
      if (!sessionUtils.isEmailVerified(user)) {
        return '/verify-email'
      }
      
      if (sessionUtils.isPasswordExpired(user)) {
        return '/force-password-change'
      }
      
      if (!sessionUtils.isAccountActive(user)) {
        return '/account-inactive'
      }
    }
    
    // Return intended URL or default dashboard
    return intendedUrl || '/dashboard'
  },
}

// Error handling utilities
export const errorUtils = {
  // Extract error message from API error
  getErrorMessage: (error: any): string => {
    if (error instanceof ApiError) {
      return error.message
    }
    
    if (error?.response?.data?.message) {
      return error.response.data.message
    }
    
    if (error?.response?.data?.error) {
      return error.response.data.error
    }
    
    if (error?.message) {
      return error.message
    }
    
    return 'An unexpected error occurred'
  },

  // Extract field errors from validation error
  getFieldErrors: (error: any): Record<string, string[]> => {
    if (error instanceof ApiError && error.details?.errors) {
      return error.details.errors
    }
    
    if (error?.response?.data?.errors) {
      return error.response.data.errors
    }
    
    return {}
  },

  // Check if error is a specific type
  isNetworkError: (error: any): boolean => {
    return error instanceof ApiError && error.status === 0
  },

  isValidationError: (error: any): boolean => {
    return error instanceof ApiError && error.status === 422
  },

  isAuthError: (error: any): boolean => {
    return error instanceof ApiError && (error.status === 401 || error.status === 403)
  },

  isRateLimitError: (error: any): boolean => {
    return error instanceof ApiError && error.status === 429
  },
}

// Request helpers
export const requestUtils = {
  // Build query string from object
  buildQueryString: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)))
        } else {
          searchParams.append(key, String(value))
        }
      }
    })
    
    return searchParams.toString()
  },

  // Parse pagination info from response headers
  parsePaginationInfo: (response: AxiosResponse) => {
    const linkHeader = response.headers.link
    const totalCount = response.headers['x-total-count']
    
    return {
      total: totalCount ? parseInt(totalCount, 10) : 0,
      hasNext: linkHeader?.includes('rel="next"') || false,
      hasPrevious: linkHeader?.includes('rel="prev"') || false,
    }
  },
}

// Development utilities
export const devUtils = {
  // Log API calls in development
  logApiCall: (method: string, url: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🌐 API ${method.toUpperCase()} ${url}`)
      if (data) {
        console.log('Data:', data)
      }
      console.groupEnd()
    }
  },

  // Mock API delay for testing loading states
  mockDelay: (ms: number = 1000): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    return Promise.resolve()
  },
}