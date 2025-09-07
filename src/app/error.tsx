/**
 * Global Error Boundary
 * 
 * Catches and displays errors with recovery options.
 */

'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-primary-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-error-500" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Something went wrong
        </h1>
        
        <p className="text-neutral-600 mb-8">
          We encountered an unexpected error. This has been logged and our team will investigate.
        </p>

        {/* Error details (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-neutral-100 rounded-lg text-left">
            <p className="text-sm font-mono text-neutral-700">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-neutral-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Try again
          </Button>
          
          <Link href="/">
            <Button 
              variant="outline"
              leftIcon={<Home className="h-4 w-4" />}
            >
              Go home
            </Button>
          </Link>
        </div>

        {/* Help text */}
        <div className="mt-8 pt-8 border-t border-primary-200">
          <p className="text-sm text-neutral-500">
            If this problem persists, please{' '}
            <Link href="/help" className="text-accent-blue hover:text-accent-blue/80">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}