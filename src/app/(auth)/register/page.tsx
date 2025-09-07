/**
 * Register Page
 * 
 * User registration page with form validation and terms acceptance.
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, User, Check } from 'lucide-react'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/auth-context'
import { registerSchema, type RegisterFormData } from '@/lib/validation'
import { ROUTES } from '@/lib/constants'
import { validationUtils } from '@/lib/utils'

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth()
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      password_confirm: '',
      terms_accepted: false,
    },
  })

  // Watch password for strength indicator
  const password = watch('password')
  React.useEffect(() => {
    if (password) {
      const strength = validationUtils.getPasswordStrength(password)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength({ score: 0, feedback: [] })
    }
  }, [password])

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data)
      // Redirect is handled by the auth context
    } catch (error: any) {
      // Handle specific error cases
      if (error?.status === 400) {
        const fieldErrors = error?.details?.errors || {}
        
        // Set field-specific errors
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(field as keyof RegisterFormData, { 
              message: messages[0] 
            })
          }
        })
        
        // Set general error if no field-specific errors
        if (Object.keys(fieldErrors).length === 0) {
          setError('root', { 
            message: error?.message || 'Registration failed. Please check your information.' 
          })
        }
      } else {
        setError('root', { 
          message: error?.message || 'An unexpected error occurred. Please try again.' 
        })
      }
    }
  }

  // Password strength indicator
  const getStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-error-500'
    if (score <= 3) return 'bg-warning-500'
    return 'bg-success-500'
  }

  const getStrengthText = (score: number) => {
    if (score <= 1) return 'Weak'
    if (score <= 3) return 'Medium'
    return 'Strong'
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start scheduling meetings in minutes"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register('first_name')}
            type="text"
            label="First name"
            placeholder="John"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.first_name?.message}
            autoComplete="given-name"
          />
          
          <Input
            {...register('last_name')}
            type="text"
            label="Last name"
            placeholder="Doe"
            error={errors.last_name?.message}
            autoComplete="family-name"
          />
        </div>

        {/* Email field */}
        <Input
          {...register('email')}
          type="email"
          label="Email address"
          placeholder="john@company.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          autoComplete="email"
        />

        {/* Password field */}
        <div>
          <Input
            {...register('password')}
            type="password"
            label="Password"
            placeholder="Create a strong password"
            leftIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle
            error={errors.password?.message}
            autoComplete="new-password"
          />
          
          {/* Password strength indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-primary-700 rounded-full h-2">
                  <div
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      getStrengthColor(passwordStrength.score)
                    )}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span className={cn(
                  'text-xs font-medium',
                  passwordStrength.score <= 1 && 'text-error-500',
                  passwordStrength.score > 1 && passwordStrength.score <= 3 && 'text-warning-500',
                  passwordStrength.score > 3 && 'text-success-500'
                )}>
                  {getStrengthText(passwordStrength.score)}
                </span>
              </div>
              
              {passwordStrength.feedback.length > 0 && (
                <ul className="mt-1 text-xs text-neutral-400 space-y-1">
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
          {...register('password_confirm')}
          type="password"
          label="Confirm password"
          placeholder="Confirm your password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password_confirm?.message}
          autoComplete="new-password"
        />

        {/* Terms acceptance */}
        <div>
          <label className="flex items-start space-x-3">
            <input
              {...register('terms_accepted')}
              type="checkbox"
              className="mt-1 h-4 w-4 text-accent-pink bg-primary-700 border-primary-600 rounded focus:ring-accent-pink focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800"
            />
            <span className="text-sm text-neutral-300">
              I agree to the{' '}
              <Link href="/terms" className="text-accent-pink hover:text-accent-pink/80">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-accent-pink hover:text-accent-pink/80">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.terms_accepted && (
            <p className="mt-1 text-sm text-error-500">
              {errors.terms_accepted.message}
            </p>
          )}
        </div>

        {/* Form errors */}
        {errors.root && (
          <div className="bg-error-500/10 border border-error-500/20 rounded-lg p-3">
            <p className="text-sm text-error-500">
              {errors.root.message}
            </p>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading}
        >
          Create account
        </Button>

        {/* SSO options (if enabled) */}
        {process.env.NEXT_PUBLIC_ENABLE_SSO === 'true' && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-primary-800 text-neutral-400">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {/* Handle Google SSO */}}
                className="w-full"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => {/* Handle Microsoft SSO */}}
                className="w-full"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                </svg>
                Microsoft
              </Button>
            </div>
          </>
        )}

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-sm text-neutral-400">
            Already have an account?{' '}
            <Link 
              href={ROUTES.login}
              className="text-accent-pink hover:text-accent-pink/80 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}