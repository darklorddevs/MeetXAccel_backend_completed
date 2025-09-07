/**
 * Authentication Hooks
 * 
 * Custom hooks for authentication-related functionality.
 */

import { useAuth as useAuthContext } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { routeUtils } from '@/lib/auth'

// Re-export the main auth hook
export const useAuth = useAuthContext

// Hook for protecting routes
export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  return { isAuthenticated, isLoading }
}

// Hook for checking permissions
export const usePermissions = () => {
  const { user, hasRole, hasPermission } = useAuth()

  return {
    user,
    hasRole,
    hasPermission,
    isAdmin: hasRole('admin'),
    isOrganizer: hasRole('organizer'),
    canViewUsers: hasPermission('can_view_users'),
    canCreateUsers: hasPermission('can_create_users'),
    canEditUsers: hasPermission('can_edit_users'),
    canDeleteUsers: hasPermission('can_delete_users'),
    canCreateEvents: hasPermission('can_create_events'),
    canManageBookings: hasPermission('can_manage_bookings'),
    canManageRoles: hasPermission('can_manage_roles'),
    canViewAdmin: hasPermission('can_view_admin'),
    canViewBilling: hasPermission('can_view_billing'),
    canManageIntegrations: hasPermission('can_manage_integrations'),
    canManageSso: hasPermission('can_manage_sso'),
  }
}

// Hook for route protection with role/permission checks
export const useRouteProtection = (options?: {
  requireRole?: string
  requirePermission?: string
  redirectTo?: string
}) => {
  const { isAuthenticated, isLoading, user, hasRole, hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    const { requireRole, requirePermission, redirectTo = '/dashboard' } = options || {}

    // Check authentication
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Check role requirement
    if (requireRole && !hasRole(requireRole)) {
      router.push(redirectTo)
      return
    }

    // Check permission requirement
    if (requirePermission && !hasPermission(requirePermission)) {
      router.push(redirectTo)
      return
    }

    // Check account status
    if (user) {
      const redirectUrl = routeUtils.getRedirectUrl(user)
      if (redirectUrl !== '/dashboard' && window.location.pathname !== redirectUrl) {
        router.push(redirectUrl)
      }
    }
  }, [isLoading, isAuthenticated, user, hasRole, hasPermission, router, options])

  return {
    isAuthenticated,
    isLoading,
    user,
    hasRole,
    hasPermission,
  }
}

// Hook for handling authentication redirects
export const useAuthRedirect = () => {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const redirectAfterAuth = (intendedUrl?: string) => {
    if (!isAuthenticated || !user) return

    const redirectUrl = routeUtils.getRedirectUrl(user, intendedUrl)
    router.push(redirectUrl)
  }

  return { redirectAfterAuth }
}