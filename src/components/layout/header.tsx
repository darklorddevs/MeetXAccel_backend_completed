/**
 * Header Component
 * 
 * Main application header with navigation, user menu, and notifications.
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Bell, 
  Calendar, 
  ChevronDown, 
  LogOut, 
  Menu, 
  Settings, 
  User,
  X,
  Search,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'

interface HeaderProps {
  onMenuToggle?: () => void
  showMenuButton?: boolean
}

export const Header: React.FC<HeaderProps> = ({ 
  onMenuToggle, 
  showMenuButton = true 
}) => {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Navigation items for authenticated users
  const navigationItems = [
    { name: 'Dashboard', href: ROUTES.dashboard, icon: Calendar },
    { name: 'Event Types', href: ROUTES.eventTypes, icon: Calendar },
    { name: 'Bookings', href: ROUTES.bookings, icon: Calendar },
    { name: 'Availability', href: ROUTES.availability, icon: Calendar },
  ]

  return (
    <header className="bg-neutral-50 border-b border-primary-300 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Menu button for mobile */}
            {showMenuButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMenuToggle}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-indigo rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-neutral-900 hidden sm:block">
                Calendly Clone
              </span>
            </Link>

            {/* Navigation (desktop) */}
            {isAuthenticated && (
              <nav className="hidden lg:flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-accent-blue text-white'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-primary-100'
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            )}
          </div>

          {/* Center section - Search */}
          {isAuthenticated && (
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <form onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Search bookings, contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                  className="bg-neutral-50 border-primary-300"
                />
              </form>
            </div>
          )}

          {/* Right section */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Quick actions */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(ROUTES.createEventType)}
                  className="hidden sm:flex"
                >
                  <Plus className="h-5 w-5" />
                </Button>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push('/notifications')}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {/* Notification badge */}
                 <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent-red rounded-full"></span>
                </Button>

                {/* User menu */}
                <HeadlessMenu as="div" className="relative">
                  <HeadlessMenu.Button className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 focus:outline-none">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-indigo rounded-full flex items-center justify-center">
                      {user?.profile?.profile_picture ? (
                        <img
                          src={user.profile.profile_picture}
                          alt={user.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {user?.first_name}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </HeadlessMenu.Button>

                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-neutral-50 border border-primary-300 rounded-lg shadow-slate-lg focus:outline-none">
                      <div className="p-2">
                        {/* User info */}
                        <div className="px-3 py-2 border-b border-primary-200 mb-2">
                          <p className="text-sm font-medium text-neutral-900">
                            {user?.full_name}
                          </p>
                          <p className="text-xs text-neutral-600">
                            {user?.email}
                          </p>
                        </div>

                        {/* Menu items */}
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <Link
                              href={ROUTES.profile}
                              className={cn(
                                'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                                active ? 'bg-primary-100 text-neutral-900' : 'text-neutral-700'
                              )}
                            >
                              <User className="h-4 w-4 mr-3" />
                              Profile
                            </Link>
                          )}
                        </HeadlessMenu.Item>

                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <Link
                              href={ROUTES.settings}
                              className={cn(
                                'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                                active ? 'bg-primary-100 text-neutral-900' : 'text-neutral-700'
                              )}
                            >
                              <Settings className="h-4 w-4 mr-3" />
                              Settings
                            </Link>
                          )}
                        </HeadlessMenu.Item>

                        <div className="border-t border-primary-200 my-2"></div>

                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={cn(
                                'flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors',
                                active ? 'bg-primary-100 text-neutral-900' : 'text-neutral-700'
                              )}
                            >
                              <LogOut className="h-4 w-4 mr-3" />
                              Sign out
                            </button>
                          )}
                        </HeadlessMenu.Item>
                      </div>
                    </HeadlessMenu.Items>
                  </Transition>
                </HeadlessMenu>
              </>
            ) : (
              // Unauthenticated user actions
              <div className="flex items-center space-x-3">
                <Link href={ROUTES.login}>
                  <Button variant="ghost">
                    Sign in
                  </Button>
                </Link>
                <Link href={ROUTES.register}>
                  <Button variant="primary">
                    Get started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}