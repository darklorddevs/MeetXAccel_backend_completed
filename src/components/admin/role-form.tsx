/**
 * Role Form Component
 * 
 * Form for creating and editing roles with permission management.
 */

'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Users, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { CheckboxGroup } from '@/components/ui/checkbox'
import { Form, FormSection, FormField, FormActions } from '@/components/ui/form'
import { useCreateRole, useUpdateRole } from '@/hooks/use-api'
import { ROLE_TYPE_OPTIONS } from '@/lib/constants'
import { toast } from '@/components/ui/toast'

const roleFormSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name too long'),
  role_type: z.enum(['admin', 'organizer', 'team_member', 'billing_manager', 'viewer']),
  description: z.string().max(500, 'Description too long').optional(),
  parent: z.string().optional(),
  role_permissions: z.array(z.string()),
})

type RoleFormData = z.infer<typeof roleFormSchema>

interface RoleFormProps {
  role?: any
  permissions: any[]
  onSuccess: () => void
  onCancel: () => void
}

export const RoleForm: React.FC<RoleFormProps> = ({
  role,
  permissions,
  onSuccess,
  onCancel,
}) => {
  const isEditing = !!role
  const createRoleMutation = useCreateRole()
  const updateRoleMutation = useUpdateRole()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name || '',
      role_type: role?.role_type || 'organizer',
      description: role?.description || '',
      parent: role?.parent || '',
      role_permissions: role?.role_permissions?.map((p: any) => p.id) || [],
    },
  })

  // Group permissions by category
  const permissionsByCategory = React.useMemo(() => {
    const grouped: Record<string, any[]> = {}
    permissions.forEach(permission => {
      const category = permission.category || 'general'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(permission)
    })
    return grouped
  }, [permissions])

  const selectedPermissions = watch('role_permissions')

  const onSubmit = async (data: RoleFormData) => {
    try {
      if (isEditing) {
        await updateRoleMutation.mutateAsync({
          id: role.id,
          ...data,
        })
        toast.success('Role updated successfully')
      } else {
        await createRoleMutation.mutateAsync(data)
        toast.success('Role created successfully')
      }
      onSuccess()
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${isEditing ? 'update' : 'create'} role`)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* Basic Information */}
        <FormSection
          title="Basic Information"
          description="Define the role name, type, and description"
        >
          <FormField>
            <Input
              {...register('name')}
              label="Role Name"
              placeholder="Enter role name"
              leftIcon={<Shield className="h-4 w-4" />}
              error={errors.name?.message}
              disabled={role?.is_system_role}
            />
          </FormField>

          <FormField>
            <Select
              options={ROLE_TYPE_OPTIONS}
              value={watch('role_type')}
              onChange={(value) => setValue('role_type', value as any)}
              label="Role Type"
              error={errors.role_type?.message}
              disabled={role?.is_system_role}
            />
          </FormField>

          <FormField>
            <Textarea
              {...register('description')}
              label="Description"
              placeholder="Describe what this role is for..."
              maxLength={500}
              showCharCount
              error={errors.description?.message}
            />
          </FormField>
        </FormSection>

        {/* Permissions */}
        <FormSection
          title="Permissions"
          description="Select the permissions this role should have"
        >
          <div className="space-y-6">
            {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
              <div key={category} className="border border-primary-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-neutral-900 mb-3 capitalize">
                  {category.replace('_', ' ')} Permissions
                </h4>
                
                <CheckboxGroup
                  options={categoryPermissions.map(permission => ({
                    value: permission.id,
                    label: permission.name,
                    description: permission.description,
                  }))}
                  value={selectedPermissions}
                  onChange={(value) => setValue('role_permissions', value)}
                />
              </div>
            ))}
          </div>
        </FormSection>

        {/* Form Actions */}
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
          >
            {isEditing ? 'Update Role' : 'Create Role'}
          </Button>
        </FormActions>
      </div>
    </Form>
  )
}