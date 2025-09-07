/**
 * Role Management Page
 * 
 * Admin page for managing roles and permissions in the RBAC system.
 */

'use client'

import React, { useState } from 'react'
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Key,
  MoreHorizontal,
  Crown,
  UserCheck
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dropdown } from '@/components/ui/dropdown'
import { Modal, ConfirmationModal } from '@/components/ui/modal'
import { EmptyState } from '@/components/ui/empty-state'
import { useRoles, useDeleteRole, usePermissions as usePermissionsList } from '@/hooks/use-api'
import { usePermissions } from '@/hooks/use-auth'
import { ROLE_TYPE_OPTIONS } from '@/lib/constants'
import { toast } from '@/components/ui/toast'
import { RoleForm } from '@/components/admin/role-form'

export default function RolesPage() {
  const { canManageRoles } = usePermissions()
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { data: roles, isLoading, refetch } = useRoles()
  const { data: permissions } = usePermissionsList()
  const deleteRoleMutation = useDeleteRole()

  // Redirect if no permission
  if (!canManageRoles) {
    return (
      <AppLayout>
        <div className="p-6">
          <EmptyState
            title="Access Denied"
            description="You don't have permission to manage roles."
            icon={Shield}
          />
        </div>
      </AppLayout>
    )
  }

  const handleDeleteRole = async () => {
    if (!selectedRole) return

    try {
      await deleteRoleMutation.mutateAsync(selectedRole.id)
      toast.success('Role deleted successfully')
      setShowDeleteModal(false)
      setSelectedRole(null)
      refetch()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete role')
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Role Name',
      render: (name: string, role: any) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium text-neutral-900">{name}</span>
          {role.is_system_role && (
            <Crown className="h-4 w-4 text-accent-orange" title="System Role" />
          )}
        </div>
      ),
    },
    {
      key: 'role_type',
      label: 'Type',
      render: (type: string) => {
        const roleType = ROLE_TYPE_OPTIONS.find(opt => opt.value === type)
        return (
          <Badge variant="secondary">
            {roleType?.label || type}
          </Badge>
        )
      },
    },
    {
      key: 'parent_name',
      label: 'Parent Role',
      render: (parentName: string) => (
        parentName ? (
          <Badge variant="outline">{parentName}</Badge>
        ) : (
          <span className="text-neutral-500">None</span>
        )
      ),
    },
    {
      key: 'total_permissions',
      label: 'Permissions',
      render: (count: number) => (
        <div className="flex items-center space-x-1">
          <Key className="h-4 w-4 text-neutral-500" />
          <span className="text-sm text-neutral-700">{count}</span>
        </div>
      ),
    },
    {
      key: 'children_count',
      label: 'Child Roles',
      render: (count: number) => (
        <span className="text-sm text-neutral-700">{count}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, role: any) => (
        <Dropdown
          items={[
            {
              id: 'edit',
              label: 'Edit Role',
              icon: Edit,
              onClick: () => {
                setSelectedRole(role)
                setShowEditModal(true)
              },
              disabled: role.is_system_role,
            },
            {
              id: 'delete',
              label: 'Delete Role',
              icon: Trash2,
              onClick: () => {
                setSelectedRole(role)
                setShowDeleteModal(true)
              },
              disabled: role.is_system_role,
              danger: true,
            },
          ]}
        />
      ),
    },
  ]

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Role Management</h1>
            <p className="text-neutral-600 mt-1">
              Manage roles and permissions for your organization
            </p>
          </div>
          
          <Button
            onClick={() => setShowCreateModal(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create Role
          </Button>
        </div>

        {/* Roles Table */}
        <Card>
          <CardHeader 
            title={`Roles (${roles?.length || 0})`}
            description="All roles in the system with their permissions"
          />
          <CardContent>
            {roles?.length === 0 && !isLoading ? (
              <EmptyState
                title="No roles found"
                description="Create your first role to get started with access control."
                icon={Shield}
                action={{
                  label: 'Create Role',
                  onClick: () => setShowCreateModal(true),
                  icon: Plus,
                }}
              />
            ) : (
              <Table
                columns={columns}
                data={roles || []}
                loading={isLoading}
                emptyMessage="No roles found"
              />
            )}
          </CardContent>
        </Card>

        {/* Create Role Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Role"
          size="lg"
        >
          <RoleForm
            permissions={permissions || []}
            onSuccess={() => {
              setShowCreateModal(false)
              refetch()
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>

        {/* Edit Role Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedRole(null)
          }}
          title="Edit Role"
          size="lg"
        >
          {selectedRole && (
            <RoleForm
              role={selectedRole}
              permissions={permissions || []}
              onSuccess={() => {
                setShowEditModal(false)
                setSelectedRole(null)
                refetch()
              }}
              onCancel={() => {
                setShowEditModal(false)
                setSelectedRole(null)
              }}
            />
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedRole(null)
          }}
          onConfirm={handleDeleteRole}
          title="Delete Role"
          message={`Are you sure you want to delete the role "${selectedRole?.name}"? This action cannot be undone.`}
          confirmText="Delete Role"
          variant="danger"
          loading={deleteRoleMutation.isPending}
        />
      </div>
    </AppLayout>
  )
}