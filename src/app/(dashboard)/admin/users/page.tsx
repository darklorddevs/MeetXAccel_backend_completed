/**
 * User Management Page
 * 
 * Admin page for managing all users in the system with RBAC controls.
 */

'use client'

import React, { useState } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Mail,
  UserX,
  UserCheck
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Table, Pagination } from '@/components/ui/table'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Dropdown } from '@/components/ui/dropdown'
import { Modal, ConfirmationModal } from '@/components/ui/modal'
import { EmptyState } from '@/components/ui/empty-state'
import { useUsers, useDeleteUser, useUpdateUser } from '@/hooks/use-api'
import { usePermissions } from '@/hooks/use-auth'
import { usePagination } from '@/hooks/use-pagination'
import { useDebounce } from '@/hooks/use-debounce'
import { ACCOUNT_STATUS_OPTIONS } from '@/lib/constants'
import { dateUtils, stringUtils } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import Link from 'next/link'

export default function UsersPage() {
  const { canViewUsers, canCreateUsers, canEditUsers, canDeleteUsers } = usePermissions()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  const debouncedSearch = useDebounce(searchQuery, 300)
  const pagination = usePagination({ initialPageSize: 20 })

  // Fetch users with filters
  const { data: usersData, isLoading, refetch } = useUsers({
    search: debouncedSearch,
    account_status: statusFilter,
    page: pagination.currentPage,
    page_size: pagination.pageSize,
  })

  const deleteUserMutation = useDeleteUser()
  const updateUserMutation = useUpdateUser()

  // Redirect if no permission
  if (!canViewUsers) {
    return (
      <AppLayout>
        <div className="p-6">
          <EmptyState
            title="Access Denied"
            description="You don't have permission to view users."
            icon={Shield}
          />
        </div>
      </AppLayout>
    )
  }

  const users = usersData?.results || []
  const totalUsers = usersData?.count || 0

  // Table columns
  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (_, user: any) => (
        <div className="flex items-center space-x-3">
          <Avatar
            src={user.profile?.profile_picture}
            fallback={stringUtils.getInitials(user.first_name, user.last_name)}
            size="sm"
          />
          <div>
            <p className="text-sm font-medium text-neutral-900">
              {user.full_name}
            </p>
            <p className="text-sm text-neutral-600">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'account_status',
      label: 'Status',
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      key: 'roles',
      label: 'Roles',
      render: (roles: any[]) => (
        <div className="flex flex-wrap gap-1">
          {roles.slice(0, 2).map((role) => (
            <Badge key={role.id} variant="secondary" size="sm">
              {role.name}
            </Badge>
          ))}
          {roles.length > 2 && (
            <Badge variant="outline" size="sm">
              +{roles.length - 2} more
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'verification',
      label: 'Verification',
      render: (_, user: any) => (
        <div className="flex space-x-2">
          {user.is_email_verified ? (
            <Badge variant="success" size="sm">Email ✓</Badge>
          ) : (
            <Badge variant="warning" size="sm">Email ✗</Badge>
          )}
          {user.is_mfa_enabled && (
            <Badge variant="info" size="sm">MFA ✓</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'date_joined',
      label: 'Joined',
      render: (date: string) => dateUtils.formatDate(date, 'MMM dd, yyyy'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, user: any) => (
        <Dropdown
          items={[
            {
              id: 'view',
              label: 'View Details',
              icon: Edit,
              href: `/admin/users/${user.id}`,
            },
            {
              id: 'edit',
              label: 'Edit User',
              icon: Edit,
              onClick: () => setSelectedUser(user),
              disabled: !canEditUsers,
            },
            {
              id: 'separator1',
              label: '',
              separator: true,
            },
            {
              id: 'activate',
              label: user.is_active ? 'Deactivate' : 'Activate',
              icon: user.is_active ? UserX : UserCheck,
              onClick: () => handleToggleUserStatus(user),
              disabled: !canEditUsers,
            },
            {
              id: 'delete',
              label: 'Delete User',
              icon: Trash2,
              onClick: () => {
                setSelectedUser(user)
                setShowDeleteModal(true)
              },
              disabled: !canDeleteUsers,
              danger: true,
            },
          ]}
        />
      ),
    },
  ]

  const handleToggleUserStatus = async (user: any) => {
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        is_active: !user.is_active,
      })
      toast.success(`User ${user.is_active ? 'deactivated' : 'activated'} successfully`)
      refetch()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update user status')
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      await deleteUserMutation.mutateAsync(selectedUser.id)
      toast.success('User deleted successfully')
      setShowDeleteModal(false)
      setSelectedUser(null)
      refetch()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete user')
    }
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
            <p className="text-neutral-600 mt-1">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          
          {canCreateUsers && (
            <Link href="/admin/users/create">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Add User
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
              
              <Select
                options={[
                  { value: '', label: 'All Statuses' },
                  ...ACCOUNT_STATUS_OPTIONS.map(status => ({
                    value: status.value,
                    label: status.label,
                  })),
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by status"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader 
            title={`Users (${totalUsers})`}
            description="All registered users in the system"
          />
          <CardContent>
            {users.length === 0 && !isLoading ? (
              <EmptyState
                title="No users found"
                description="No users match your current filters."
                icon={Users}
              />
            ) : (
              <>
                <Table
                  columns={columns}
                  data={users}
                  loading={isLoading}
                  emptyMessage="No users found"
                />
                
                {totalUsers > pagination.pageSize && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={Math.ceil(totalUsers / pagination.pageSize)}
                      onPageChange={pagination.goToPage}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedUser(null)
          }}
          onConfirm={handleDeleteUser}
          title="Delete User"
          message={`Are you sure you want to delete ${selectedUser?.full_name}? This action cannot be undone.`}
          confirmText="Delete User"
          variant="danger"
          loading={deleteUserMutation.isPending}
        />
      </div>
    </AppLayout>
  )
}