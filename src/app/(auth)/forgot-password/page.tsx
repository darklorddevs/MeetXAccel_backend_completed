/**
 * Forgot Password Page
 * 
 * Password reset request page with email input and validation.
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { passwordResetRequestSchema, type PasswordResetRequestData } from '@/lib/validation'
import { authApi } from '@/lib/auth'
import { toast } from '@/components/ui/toast'
import { ROUTES } from '@/lib/constants'

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues,
  } = useForm<PasswordResetRequestData>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: PasswordResetRequestData) => {
    try {
      await authApi.requestPasswordReset(data.email)
      setIsSubmitted(true)
    } catch (error: any) {
      setError('root', {
        message: error?.message || 'Failed to send reset email. Please try again.',
      })
    }
  }

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent password reset instructions"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-success-500" />
          </div>
          
          <p className="text-neutral-600 mb-6">
            If an account with <strong>{getValues('email')}</strong> exists, 
            you'll receive password reset instructions shortly.
          </p>
          
          <p className="text-sm text-neutral-500 mb-8">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full"
            >
              Try different email
            </Button>
            
            <Link href={ROUTES.login}>
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you reset instructions"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email field */}
        <Input
          {...register('email')}
          type="email"
          label="Email address"
          placeholder="Enter your email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          autoComplete="email"
          autoFocus
        />

        {/* Form errors */}
        {errors.root && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-3">
            <p className="text-sm text-error-700">
              {errors.root.message}
            </p>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Send reset instructions
        </Button>

        {/* Back to login */}
        <div className="text-center">
          <Link 
            href={ROUTES.login}
            className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}