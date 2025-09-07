/**
 * Authentication Context
 * 
 * This context provides authentication state and methods throughout
 * the application. It handles user login, logout, and session management.
 */

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthUser, AuthState, LoginCredentials, RegisterData } from '@/types/auth'
import { authApi, sessionUtils, routeUtils } from '@/lib/auth'
import { getAuthToken, clearAuthToken } from '@/lib/api'
import { errorUtils } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants'

interface AuthContextType extends AuthState {
  // Authentication methods
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  
  // Profile methods
  refreshUser: () => Promise<void>
  updateProfile: (data: Partial<AuthUser>) => Promise<void>
  
  // Password methods
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
  forcePasswordChange: (newPassword: string) => Promise<void>
  
  // Email verification
  verifyEmail: (token: string) => Promise<void>
  resendVerification: (email: string) => Promise<void>
  
  // Utility methods
  hasRole: (roleName: string) => boolean
  hasPermission: (permissionCode: string) => boolean
  isAccountActive: () => boolean
  isPasswordExpired: () => boolean
  isEmailVerified: () => boolean
  isMfaEnabled: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
  })
  
  const router = useRouter()

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken()
      
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }))
        return
      }

      try {
        const user = await authApi.getCurrentUser()
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          token,
        })
      } catch (error) {
        // Token is invalid, clear it
        clearAuthToken()
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          token: null,
        })
      }
    }

    initializeAuth()
  }, [])

  // Login method
  const login = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      
      const response = await authApi.login(credentials)
      
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        token: response.token,
      })
      
      toast.success(SUCCESS_MESSAGES.login)
      
      // Redirect based on account status
      const redirectUrl = routeUtils.getRedirectUrl(response.user)
      router.push(redirectUrl)
      
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      
      const errorMessage = errorUtils.getErrorMessage(error)
      toast.error(errorMessage)
      
      throw error
    }
  }

  // Register method
  const register = async (data: RegisterData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      
      const response = await authApi.register(data)
      
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        token: response.token,
      })
      
      toast.success(SUCCESS_MESSAGES.register)
      
      // Redirect to email verification if needed
      if (!response.user.is_email_verified) {
        router.push('/verify-email')
      } else {
        router.push('/dashboard')
      }
      
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      
      const errorMessage = errorUtils.getErrorMessage(error)
      toast.error(errorMessage)
      
      throw error
    }
  }

  // Logout method
  const logout = async () => {
    try {
      await authApi.logout()
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      })
      
      toast.success(SUCCESS_MESSAGES.logout)
      router.push('/login')
      
    } catch (error) {
      // Even if logout API fails, clear local state
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      })
      
      router.push('/login')
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    if (!state.token) return

    try {
      const user = await authApi.getCurrentUser()
      setState(prev => ({ ...prev, user }))
    } catch (error) {
      // If refresh fails, user might need to re-authenticate
      await logout()
    }
  }

  // Update profile
  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!state.user) return

    try {
      // This would call the profile update API
      // For now, optimistically update the state
      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null,
      }))
      
      toast.success(SUCCESS_MESSAGES.profileUpdated)
      
    } catch (error) {
      // Revert optimistic update
      await refreshUser()
      
      const errorMessage = errorUtils.getErrorMessage(error)
      toast.error(errorMessage)
      
      throw error
    }
  }

  // Change password
  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await authApi.changePassword(oldPassword, newPassword)
      toast.success(SUCCESS_MESSAGES.passwordChanged)
      
      // Refresh user data
      await refreshUser()
      
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error)
      toast.error(errorMessage)
      
      throw error
    }
  }

  // Force password change (for expired passwords)
  const forcePasswordChange = async (newPassword: string) => {
    try {
      const response = await authApi.forcePasswordChange(newPassword)
      
      // Update token if new one is provided
      if (response.token) {
        setState(prev => ({ ...prev, token: response.token }))
      }
      
      toast.success(SUCCESS_MESSAGES.passwordChanged)
      
      // Refresh user data and redirect to dashboard
      await refreshUser()
      router.push('/dashboard')
      
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error)
      toast.error(errorMessage)
      
      throw error
    }
  }

  // Verify email
  const verifyEmail = async (token: string) => {
    try {
      await authApi.verifyEmail(token)
      toast.success(SUCCESS_MESSAGES.emailVerified)
      
      // Refresh user data
      await refreshUser()
      
      // Redirect to dashboard
      router.push('/dashboard')
      
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error)
      toast.error(errorMessage)
      
      throw error
    }
  }

  // Resend verification email
  const resendVerification = async (email: string) => {
    try {
      await authApi.resendVerification(email)
      toast.success('Verification email sent! Please check your inbox.')
      
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error)
      toast.error(errorMessage)
      
      throw error
    }
  }

  // Utility methods
  const hasRole = (roleName: string): boolean => {
    return sessionUtils.hasRole(state.user, roleName)
  }

  const hasPermission = (permissionCode: string): boolean => {
    return sessionUtils.hasPermission(state.user, permissionCode)
  }

  const isAccountActive = (): boolean => {
    return sessionUtils.isAccountActive(state.user)
  }

  const isPasswordExpired = (): boolean => {
    return sessionUtils.isPasswordExpired(state.user)
  }

  const isEmailVerified = (): boolean => {
    return sessionUtils.isEmailVerified(state.user)
  }

  const isMfaEnabled = (): boolean => {
    return sessionUtils.isMfaEnabled(state.user)
  }

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    changePassword,
    forcePasswordChange,
    verifyEmail,
    resendVerification,
    hasRole,
    hasPermission,
    isAccountActive,
    isPasswordExpired,
    isEmailVerified,
    isMfaEnabled,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Higher-order component for route protection
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireAuth?: boolean
    requireRole?: string
    requirePermission?: string
    redirectTo?: string
  }
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const auth = useAuth()
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
      const checkAccess = () => {
        // Wait for auth to initialize
        if (auth.isLoading) return

        const { requireAuth = true, requireRole, requirePermission, redirectTo = '/login' } = options || {}

        // Check authentication requirement
        if (requireAuth && !auth.isAuthenticated) {
          router.push(redirectTo)
          return
        }

        // Check role requirement
        if (requireRole && !auth.hasRole(requireRole)) {
          toast.error(ERROR_MESSAGES.forbidden)
          router.push('/dashboard')
          return
        }

        // Check permission requirement
        if (requirePermission && !auth.hasPermission(requirePermission)) {
          toast.error(ERROR_MESSAGES.forbidden)
          router.push('/dashboard')
          return
        }

        // Check account status
        if (auth.isAuthenticated && !auth.isAccountActive()) {
          if (!auth.isEmailVerified()) {
            router.push('/verify-email')
            return
          }
          
          if (auth.isPasswordExpired()) {
            router.push('/force-password-change')
            return
          }
        }

        setIsChecking(false)
      }

      checkAccess()
    }, [auth.isLoading, auth.isAuthenticated, auth.user, router])

    // Show loading while checking access
    if (auth.isLoading || isChecking) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-primary-900">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-pink"></div>
        </div>
      )
    }

    return <Component {...props} />
  }

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`
  
  return WrappedComponent
}