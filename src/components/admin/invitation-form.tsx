/**
 * Invitation Form Component
 * 
 * Form for sending team member invitations.
 */

'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Shield, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Form, FormSection, FormField, FormActions } from '@/components/ui/form'
import { useCreateInvitation, useRoles } from '@/hooks/use-api'
import { invitationCreateSchema, type InvitationCreateData } from '@/lib/validation'
import { toast } from '@/components/ui/toast'

interface InvitationFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export const InvitationForm: React.FC<InvitationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const createInvitationMutation = useCreateInvitation()
  const { data: roles } = useRoles()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvitationCreateData>({
    resolver: zodResolver(invitationCreateSchema),
    defaultValues: {
      invited_email: '',
      role: '',
      message: '',
    },
  })

  const onSubmit = async (data: InvitationCreateData) => {
    try {
      await createInvitationMutation.mutateAsync(data)
      toast.success('Invitation sent successfully!')
      onSuccess()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send invitation')
    }
  }

  const roleOptions = React.useMemo(() => {
    return (roles || []).map(role => ({
      value: role.id,
      label: role.name,
      description: role.description,
    }))
  }, [roles])

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <FormSection
          title="Invitation Details"
          description="Send an invitation to join your team"
        >
          <FormField>
            <Input
              {...register('invited_email')}
              type="email"
              label="Email Address"
              placeholder="colleague@company.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.invited_email?.message}
              autoFocus
            />
          </FormField>

          <FormField>
            <Select
              options={roleOptions}
              value={watch('role')}
              onChange={(value) => setValue('role', value)}
              label="Role"
              placeholder="Select a role"
              error={errors.role?.message}
            />
          </FormField>

          <FormField>
            <Textarea
              {...register('message')}
              label="Personal Message (Optional)"
              placeholder="Add a personal message to the invitation..."
              maxLength={500}
              showCharCount
              error={errors.message?.message}
            />
          </FormField>
        </FormSection>

        <FormActions>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            leftIcon={<Mail className="h-4 w-4" />}
          >
            Send Invitation
          </Button>
        </FormActions>
      </div>
    </Form>
  )
}