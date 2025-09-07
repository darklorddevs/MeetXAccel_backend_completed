/**
 * Email Verification Page
 * 
 * Handles email verification with token and provides resend functionality.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/auth-context'
import { toast } from '@/components/ui/toast'
import { ROUTES } from '@/lib/constants'

export default function VerifyEmailPage() {
  const { user, verifyEmail, resendVerification } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [resendEmail, setResendEmail] = useState('')
  const [isResending, setIsResending] = useState(false)

  const token = searchParams.get('token')

  // Auto-verify if token is present
  useEffect(() => {
    if (token) {
      handleTokenVerification(token)
    }
  }, [token])

  const handleTokenVerification = async (verificationToken: string) => {
    try {
      await verifyEmail(verificationToken)
      setVerificationStatus('success')
      
      // Redirect to dashboard after success
      setTimeout(() => {
        router.push(ROUTES.dashboard)
      }, 2000)
    } catch (error: any) {
      setVerificationStatus('error')
      toast.error(error?.message || 'Email verification failed')
    }
  }

  const handleResendVerification = async () => {
    if (!resendEmail) {
      toast.error('Please enter your email address')
      return
    }

    try {
      setIsResending(true)
      await resendVerification(resendEmail)
      toast.success('Verification email sent! Please check your inbox.')
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send verification email')
    } finally {
      setIsResending(false)
    }
  }

  // Success state
  if (verificationStatus === 'success') {
    return (
      <AuthLayout
        title="Email verified!"
        subtitle="Your account is now active"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-success-500" />
          </div>
          
          <p className="text-neutral-600 mb-8">
            Your email has been successfully verified. You'll be redirected to your dashboard shortly.
          </p>
          
          <Button
            onClick={() => router.push(ROUTES.dashboard)}
            className="w-full"
          >
            Continue to dashboard
          </Button>
        </div>
      </AuthLayout>
    )
  }

  // Error state
  if (verificationStatus === 'error') {
    return (
      <AuthLayout
        title="Verification failed"
        subtitle="The verification link is invalid or expired"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-error-500" />
          </div>
          
          <p className="text-neutral-600 mb-8">
            The verification link you used is invalid or has expired. 
            Please request a new verification email.
          </p>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
              />
              <Button
                onClick={handleResendVerification}
                loading={isResending}
                disabled={isResending}
              >
                Resend
              </Button>
            </div>
            
            <Button
              variant="ghost"
              onClick={() => router.push(ROUTES.login)}
              className="w-full"
            >
              Back to sign in
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  // Default state - show verification instructions
  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Check your inbox for verification instructions"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-info-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="h-8 w-8 text-info-500" />
        </div>
        
        <p className="text-neutral-600 mb-6">
          {user?.email ? (
            <>We've sent a verification email to <strong>{user.email}</strong>.</>
          ) : (
            'Please check your email for verification instructions.'
          )}
        </p>
        
        <p className="text-sm text-neutral-500 mb-8">
          Click the link in the email to verify your account. 
          If you don't see it, check your spam folder.
        </p>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
            />
            <Button
              onClick={handleResendVerification}
              loading={isResending}
              disabled={isResending}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Resend
            </Button>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => router.push(ROUTES.login)}
            className="w-full"
          >
            Back to sign in
          </Button>
        </div>
      </div>
    </AuthLayout>
  )
}