/**
 * Invitation Response Page
 * 
 * Page for accepting or declining team invitations.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Mail, 
  User, 
  Lock,
  Shield,
  AlertCircle
} from 'lucide-react'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Form, FormField, FormActions } from '@/components/ui/form'
import { useRespondToInvitation, useInvitationDetails } from '@/hooks/use-api'
import { invitationResponseSchema, type InvitationResponseData } from '@/lib/validation'
import { validationUtils } from '@/lib/utils'
import { toast } from '@/components/ui/toast'

export default function InvitationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const action = searchParams.get('action') as 'accept' | 'decline' | null
  
  const [invitationStatus, setInvitationStatus] = useState<'loading' | 'valid' | 'invalid' | 'responded'>('loading')
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] })
  const [userExists, setUserExists] = useState(false)

  const { data: invitation, isLoading: invitationLoading } = useInvitationDetails(token)
  const respondToInvitationMutation = useRespondToInvitation()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvitationResponseData>({
    resolver: zodResolver(invitationResponseSchema),
    defaultValues: {
      token: token || '',
      action: action || 'accept',
      first_name: '',
      last_name: '',
      password: '',
      password_confirm: '',
    },
  })

  // Check invitation validity
  useEffect(() => {
    if (!token) {
      setInvitationStatus('invalid')
      return
    }

    if (invitation) {
      if (invitation.status === 'pending') {
        setInvitationStatus('valid')
        // Check if user already exists (this would be determined by the API response)
        setUserExists(invitation.user_exists || false)
      } else {
        setInvitationStatus('responded')
      }
    }
  }, [token, invitation])

  // Watch password for strength indicator
  const password = watch('password')
  useEffect(() => {
    if (password && !userExists) {
      const strength = validationUtils.getPasswordStrength(password)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength({ score: 0, feedback: [] })
    }
  }, [password, userExists])

  const onSubmit = async (data: InvitationResponseData) => {
    try {
      const response = await respondToInvitationMutation.mutateAsync(data)
      
      if (data.action === 'accept') {
        toast.success('Invitation accepted! Welcome to the team!')
        // Redirect to dashboard or login
        router.push('/dashboard')
      } else {
        toast.success('Invitation declined')
        router.push('/')
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to respond to invitation')
    }
  }

  // Loading state
  if (invitationLoading || invitationStatus === 'loading') {
    return (
      <AuthLayout title="Loading invitation..." showLogo={false}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue mx-auto"></div>
        </div>
      </AuthLayout>
    )
  }

  // Invalid invitation
  if (invitationStatus === 'invalid' || !invitation) {
    return (
      <AuthLayout title="Invalid Invitation" showLogo={false}>
        <div className="text-center">
          <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-8 w-8 text-error-500" />
          </div>
          
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Invalid Invitation
          </h2>
          
          <p className="text-neutral-600 mb-8">
            This invitation link is invalid or has expired.
          </p>
          
          <Button onClick={() => router.push('/')}>
            Go to Homepage
          </Button>
        </div>
      </AuthLayout>
    )
  }

  // Already responded
  if (invitationStatus === 'responded') {
    return (
      <AuthLayout title="Invitation Already Responded" showLogo={false}>
        <div className="text-center">
          <div className="w-16 h-16 bg-info-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-info-500" />
          </div>
          
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Invitation Already Responded
          </h2>
          
          <p className="text-neutral-600 mb-8">
            You have already responded to this invitation.
          </p>
          
          <Button onClick={() => router.push('/login')}>
            Sign In
          </Button>
        </div>
      </AuthLayout>
    )
  }

  // Valid invitation - show response form
  return (
    <AuthLayout 
      title="Team Invitation"
      subtitle={`You've been invited to join ${invitation.invited_by_name}'s team`}
    >
      <div className="space-y-6">
        {/* Invitation Details */}
        <Card variant="gradient">
          <CardContent>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-6 w-6 text-accent-blue" />
              </div>
              
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Join as {invitation.role_name}
              </h3>
              
              <p className="text-neutral-600 mb-4">
                {invitation.invited_by_name} has invited you to join their team
              </p>
              
              {invitation.message && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 text-left">
                  <p className="text-sm text-neutral-700 italic">
                    "{invitation.message}"
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* New User Registration (if user doesn't exist) */}
          {!userExists && (
            <Card>
              <CardHeader 
                title="Create Your Account"
                description="Complete your profile to join the team"
              />
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField>
                    <Input
                      {...register('first_name')}
                      label="First Name"
                      placeholder="John"
                      leftIcon={<User className="h-4 w-4" />}
                      error={errors.first_name?.message}
                    />
                  </FormField>
                  
                  <FormField>
                    <Input
                      {...register('last_name')}
                      label="Last Name"
                      placeholder="Doe"
                      error={errors.last_name?.message}
                    />
                  </FormField>
                </div>

                <FormField>
                  <Input
                    {...register('password')}
                    type="password"
                    label="Password"
                    placeholder="Create a strong password"
                    leftIcon={<Lock className="h-4 w-4" />}
                    showPasswordToggle
                    error={errors.password?.message}
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
                    </div>
                  )}
                </FormField>

                <FormField>
                  <Input
                    {...register('password_confirm')}
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    leftIcon={<Lock className="h-4 w-4" />}
                    error={errors.password_confirm?.message}
                  />
                </FormField>
              </CardContent>
            </Card>
          )}

          {/* Existing User */}
          {userExists && (
            <Alert variant="info">
              <AlertTitle>Account Found</AlertTitle>
              <AlertDescription>
                An account with this email already exists. You'll be signed in and the role will be added to your account.
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <FormActions align="center">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              leftIcon={<CheckCircle className="h-4 w-4" />}
              onClick={() => setValue('action', 'accept')}
            >
              Accept Invitation
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setValue('action', 'decline')
                handleSubmit(onSubmit)()
              }}
              disabled={isSubmitting}
              leftIcon={<XCircle className="h-4 w-4" />}
            >
              Decline
            </Button>
          </FormActions>
        </Form>
      </div>
    </AuthLayout>
  )
}