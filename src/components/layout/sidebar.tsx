/**
 * Sidebar Component
 * 
 * Main navigation sidebar for the dashboard with collapsible sections
 * and Monkai theme styling.
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Calendar,
  Clock,
  Users,
  Settings,
  BarChart3,
  Workflow,
  Bell,
  Zap,
  UserCheck,
  ChevronRight,
  Home,
  Video,
  Mail,
  Webhook,
  Shield,
  CreditCard,
  HelpCircle,
  BookOpen,
  Palette
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/auth-context'
import { ROUTES, FEATURES } from '@/lib/constants'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  className?: string
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<any>
  badge?: string
  children?: NavigationItem[]
  permission?: string
  feature?: keyof typeof FEATURES
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen = true, 
  onClose,
  className 
}) => {
  const pathname = usePathname()
  const { user, hasPermission } = useAuth()
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['main'])

  // Navigation structure
  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: ROUTES.dashboard,
      icon: Home,
    },
    {
      name: 'Event Types',
      href: ROUTES.eventTypes,
      icon: Calendar,
    },
    {
      name: 'Bookings',
      href: ROUTES.bookings,
      icon: UserCheck,
    },
    {
      name: 'Calendar',
      href: ROUTES.calendar,
      icon: Calendar,
    },
    {
      name: 'Availability',
      href: ROUTES.availability,
      icon: Clock,
    },
    {
      name: 'Integrations',
      href: ROUTES.integrations,
      icon: Zap,
      children: [
        {
          name: 'Calendar',
          href: ROUTES.calendarIntegrations,
          icon: Calendar,
        },
        {
          name: 'Video',
          href: ROUTES.videoIntegrations,
          icon: Video,
        },
        {
          name: 'Webhooks',
          href: ROUTES.webhooks,
          icon: Webhook,
        },
      ],
    },
    {
      name: 'Workflows',
      href: ROUTES.workflows,
      icon: Workflow,
      feature: 'workflows',
    },
    {
      name: 'Notifications',
      href: ROUTES.notifications,
      icon: Bell,
      children: [
        {
          name: 'Templates',
          href: ROUTES.notificationTemplates,
          icon: Mail,
        },
        {
          name: 'Settings',
          href: ROUTES.notificationSettings,
          icon: Settings,
        },
      ],
    },
    {
      name: 'Contacts',
      href: ROUTES.contacts,
      icon: Users,
    },
    {
      name: 'Analytics',
      href: ROUTES.analytics,
      icon: BarChart3,
      feature: 'analytics',
    },
    {
      name: 'Settings',
      href: ROUTES.settings,
      icon: Settings,
      children: [
        {
          name: 'Profile',
          href: ROUTES.profile,
          icon: User,
        },
        {
          name: 'Branding',
          href: '/settings/branding',
          icon: Palette,
        },
        {
          name: 'Security',
          href: ROUTES.securitySettings,
          icon: Shield,
        },
        {
          name: 'Billing',
          href: '/settings/billing',
          icon: CreditCard,
          permission: 'can_view_billing',
        },
      ],
    },
  ]

  // Admin navigation (if user has admin role)
  const adminNavigation: NavigationItem[] = [
    {
      name: 'Admin',
      href: ROUTES.admin,
      icon: Shield,
      permission: 'can_view_admin',
      children: [
        {
          name: 'Users',
          href: ROUTES.users,
          icon: Users,
          permission: 'can_view_users',
        },
        {
          name: 'Roles',
          href: ROUTES.roles,
          icon: Shield,
          permission: 'can_manage_roles',
        },
        {
          name: 'Permissions',
          href: ROUTES.permissions,
          icon: Key,
          permission: 'can_view_admin',
        },
        {
          name: 'System Settings',
          href: ROUTES.systemSettings,
          icon: Settings,
          permission: 'can_manage_system',
        },
      ],
    },
  ]

  // Filter navigation based on permissions and features
  const filterNavigation = (items: NavigationItem[]): NavigationItem[] => {
    return items.filter(item => {
      // Check feature flags
      if (item.feature && !FEATURES[item.feature]) {
        return false
      }
      
      // Check permissions
      if (item.permission && !hasPermission(item.permission)) {
        return false
      }
      
      return true
    }).map(item => ({
      ...item,
      children: item.children ? filterNavigation(item.children) : undefined,
    }))
  }

  const filteredNavigation = filterNavigation(navigation)
  const filteredAdminNavigation = filterNavigation(adminNavigation)

  // Toggle section expansion
  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    )
  }

  // Check if item is active
  const isItemActive = (href: string, children?: NavigationItem[]) => {
    if (pathname === href) return true
    if (children) {
      return children.some(child => pathname.startsWith(child.href))
    }
    return pathname.startsWith(href) && href !== ROUTES.dashboard
  }

  // Render navigation item
  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isActive = isItemActive(item.href, item.children)
    const isExpanded = expandedSections.includes(item.name.toLowerCase())

    return (
      <div key={item.name}>
        {hasChildren ? (
          <button
            onClick={() => toggleSection(item.name.toLowerCase())}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              level > 0 && 'ml-4',
              isActive
                ? 'bg-accent-blue text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-primary-100'
            )}
          >
            <div className="flex items-center">
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
              {item.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-accent-pink text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <ChevronRight 
              className={cn(
                'h-4 w-4 transition-transform',
                isExpanded && 'rotate-90'
              )} 
            />
          </button>
        ) : (
          <Link
            href={item.href}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              level > 0 && 'ml-4',
              isActive
                ? 'bg-accent-blue text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-primary-100'
            )}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
            {item.badge && (
              <span className="ml-auto px-2 py-0.5 text-xs bg-accent-blue text-white rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        )}

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-neutral-50 border-r border-primary-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-200">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-indigo rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900">
              Calendly Clone
            </span>
          </Link>

          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Main navigation */}
          <div className="space-y-1">
            {filteredNavigation.map(item => renderNavigationItem(item))}
          </div>

          {/* Admin navigation */}
          {filteredAdminNavigation.length > 0 && (
            <>
              <div className="border-t border-primary-200 my-6"></div>
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Administration
                </h3>
                {filteredAdminNavigation.map(item => renderNavigationItem(item))}
              </div>
            </>
          )}

          {/* Help section */}
          <div className="border-t border-primary-200 my-6"></div>
          <div className="space-y-1">
            <Link
              href="/help"
              className="flex items-center px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              Help & Support
            </Link>
            <Link
              href="/docs"
              className="flex items-center px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <BookOpen className="h-5 w-5 mr-3" />
              Documentation
            </Link>
          </div>
        </nav>

        {/* User info footer */}
        <div className="border-t border-primary-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-indigo rounded-full flex items-center justify-center">
              {user?.profile?.profile_picture ? (
                <img
                  src={user.profile.profile_picture}
                  alt={user.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {user?.full_name}
              </p>
              <p className="text-xs text-neutral-600 truncate">
                {user?.profile?.company || 'Organizer'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}