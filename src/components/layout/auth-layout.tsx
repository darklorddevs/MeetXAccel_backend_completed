/**
 * Auth Layout Component
 * 
 * Layout for authentication pages (login, register, forgot password, etc.)
 * with centered content and Monkai theme styling.
 */

import React from 'react'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  showLogo?: boolean
  className?: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showLogo = true,
  className,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        {showLogo && (
          <Link href="/" className="flex justify-center items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-accent-indigo rounded-xl flex items-center justify-center shadow-slate-lg">
              <Calendar className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-neutral-900">
              Calendly Clone
            </span>
          </Link>
        )}

        {/* Title and subtitle */}
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-neutral-600">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className={cn(
          'bg-neutral-50 border border-primary-300 shadow-slate-xl rounded-xl px-8 py-10',
          className
        )}>
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-neutral-500">
          © 2024 Calendly Clone. All rights reserved.
        </p>
        <div className="mt-2 space-x-4">
          <Link href="/privacy" className="text-sm text-neutral-500 hover:text-neutral-700">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-neutral-500 hover:text-neutral-700">
            Terms of Service
          </Link>
          <Link href="/help" className="text-sm text-neutral-500 hover:text-neutral-700">
            Help
          </Link>
        </div>
      </div>
    </div>
  )
}