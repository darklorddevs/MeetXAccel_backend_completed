/**
 * Change Password Form Component
 * 
 * Form for changing user password with validation.
 */

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormActions } from '@/components/ui/form'
import { useChangePassword } from '@/hooks/use-api'
import { changePasswordSchema, type ChangePasswordData } from '@/lib/validation'
import { validationUtils } from '@/lib/utils'
import { toast } from '@/components/ui/toast'

export const ChangePasswordForm: React.FC = () => {
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] })
  const changePasswordMutation = useChangePassword()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      new_password_confirm: '',
    },
  })

  // Watch new password for strength indicator
  const newPassword = watch('new_password')
  React.useEffect(() => {
    if (newPassword) {
      const strength = validationUtils.getPasswordStrength(newPassword)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength({ score: 0, feedback: [] })
    }
  }, [newPassword])

  const onSubmit = async (data: ChangePasswordData) => {
    try {
      await changePasswordMutation.mutateAsync(data)
      toast.success('Password changed successfully!')
      reset()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to change password')
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6 max-w-md">
        <FormField>
          <Input
            {...register('old_password')}
            type="password"
            label="Current Password"
            placeholder="Enter your current password"
            leftIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle
            error={errors.old_password?.message}
            autoComplete="current-password"
          />
        </FormField>

        <FormField>
          <Input
            {...register('new_password')}
            type="password"
            label="New Password"
            placeholder="Enter your new password"
            leftIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle
            error={errors.new_password?.message}
            autoComplete="new-password"
          />
          
          {/* Password strength indicator */}
          {newPassword && (
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
        </FormField>

        <FormField>
          <Input
            {...register('new_password_confirm')}
            type="password"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            leftIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle
            error={errors.new_password_confirm?.message}
            autoComplete="new-password"
          />
        </FormField>

        <FormActions>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Change Password
          </Button>
        </FormActions>
      </div>
    </Form>
  )
}