/**
 * Login Page
 * 
 * User authentication page with form validation and error handling.
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/auth-context'
import { loginSchema, type LoginFormData } from '@/lib/validation'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)

  // Get redirect URL from query params
  const redirectTo = searchParams.get('redirect') || ROUTES.dashboard

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      // Redirect is handled by the auth context
    } catch (error: any) {
      // Handle specific error cases
      if (error?.status === 401) {
        setError('root', { 
          message: 'Invalid email or password. Please try again.' 
        })
      } else if (error?.status === 429) {
        setError('root', { 
          message: 'Too many login attempts. Please try again later.' 
        })
      } else if (error?.details?.account_status === 'pending_verification') {
        setError('root', { 
          message: 'Please verify your email address before logging in.' 
        })
      } else if (error?.details?.account_status === 'suspended') {
        setError('root', { 
          message: 'Your account has been suspended. Please contact support.' 
        })
      } else {
        setError('root', { 
          message: error?.message || 'An unexpected error occurred. Please try again.' 
        })
      }
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email field */}
        <div>
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
        </div>

        {/* Password field */}
        <div>
          <Input
            {...register('password')}
            type="password"
            label="Password"
            placeholder="Enter your password"
            leftIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle
            error={errors.password?.message}
            autoComplete="current-password"
          />
        </div>

        {/* Remember me and forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              {...register('remember_me')}
              type="checkbox"
              className="h-4 w-4 text-accent-pink bg-primary-700 border-primary-600 rounded focus:ring-accent-pink focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800"
            />
            <span className="ml-2 text-sm text-neutral-300">
              Remember me
            </span>
          </label>

          <Link 
            href={ROUTES.forgotPassword}
            className="text-sm text-accent-pink hover:text-accent-pink/80"
          >
            Forgot your password?
          </Link>
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
          Sign in
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
                  Or continue with
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

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm text-neutral-400">
            Don't have an account?{' '}
            <Link 
              href={ROUTES.register}
              className="text-accent-pink hover:text-accent-pink/80 font-medium"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}