/**
 * 404 Not Found Page
 * 
 * Custom 404 page with helpful navigation and Subtle Slate theme styling.
 */

import React from 'react'
import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-primary-300 mb-4">404</div>
          <div className="w-24 h-1 bg-accent-blue mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Page not found
        </h1>
        
        <p className="text-neutral-600 mb-8">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Go back
          </Button>
          
          <Link href="/">
            <Button leftIcon={<Home className="h-4 w-4" />}>
              Go home
            </Button>
          </Link>
        </div>

        {/* Help text */}
        <div className="mt-8 pt-8 border-t border-primary-200">
          <p className="text-sm text-neutral-500">
            Need help? <Link href="/help" className="text-accent-blue hover:text-accent-blue/80">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  )
}