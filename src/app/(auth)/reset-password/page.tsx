/**
 * Reset Password Page
 * 
 * Password reset confirmation page with token validation.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, CheckCircle } from 'lucide-react'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { passwordResetConfirmSchema, type PasswordResetConfirmData } from '@/lib/validation'
import { authApi } from '@/lib/auth'
import { toast } from '@/components/ui/toast'
import { ROUTES } from '@/lib/constants'
import { validationUtils } from '@/lib/utils'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isCompleted, setIsCompleted] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] })

  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<PasswordResetConfirmData>({
    resolver: zodResolver(passwordResetConfirmSchema),
    defaultValues: {
      token: token || '',
      new_password: '',
      new_password_confirm: '',
    },
  })

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      router.push(ROUTES.forgotPassword)
    }
  }, [token, router])

  // Watch password for strength indicator
  const password = watch('new_password')
  useEffect(() => {
    if (password) {
      const strength = validationUtils.getPasswordStrength(password)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength({ score: 0, feedback: [] })
    }
  }, [password])

  const onSubmit = async (data: PasswordResetConfirmData) => {
    try {
      await authApi.confirmPasswordReset(data.token, data.new_password)
      setIsCompleted(true)
    } catch (error: any) {
      if (error?.status === 400) {
        setError('root', {
          message: 'Invalid or expired reset token. Please request a new password reset.',
        })
      } else {
        setError('root', {
          message: error?.message || 'Failed to reset password. Please try again.',
        })
      }
    }
  }

  if (isCompleted) {
    return (
      <AuthLayout
        title="Password reset successful"
        subtitle="Your password has been updated"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-success-500" />
          </div>
          
          <p className="text-neutral-600 mb-8">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          
          <Button
            onClick={() => router.push(ROUTES.login)}
            className="w-full"
          >
            Continue to sign in
          </Button>
        </div>
      </AuthLayout>
    )
  }

  if (!token) {
    return null // Will redirect
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your new password below"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* New password field */}
        <div>
          <Input
            {...register('new_password')}
            type="password"
            label="New password"
            placeholder="Enter your new password"
            leftIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle
            error={errors.new_password?.message}
            autoComplete="new-password"
            autoFocus
          />
          
          {/* Password strength indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-primary-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.score <= 1 ? 'bg-error-500' :
                      passwordStrength.score <= 3 ? 'bg-warning-500' :
                      'bg-success-500'
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength.score <= 1 ? 'text-error-500' :
                  passwordStrength.score <= 3 ? 'text-warning-500' :
                  'text-success-500'
                }`}>
                  {passwordStrength.score <= 1 ? 'Weak' :
                   passwordStrength.score <= 3 ? 'Medium' : 'Strong'}
                </span>
              </div>
              
              {passwordStrength.feedback.length > 0 && (
                <ul className="mt-1 text-xs text-neutral-600 space-y-1">
                  {passwordStrength.feedback.map((feedback, index) => (
                    <li key={index} className="flex items-center space-x-1">
                      <span className="w-1 h-1 bg-neutral-500 rounded-full" />
                      <span>{feedback}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Confirm password field */}
        <Input
          {...register('new_password_confirm')}
          type="password"
          label="Confirm new password"
          placeholder="Confirm your new password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.new_password_confirm?.message}
          autoComplete="new-password"
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
          Reset password
        </Button>
      </form>
    </AuthLayout>
  )
}