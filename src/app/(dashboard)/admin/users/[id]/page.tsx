/**
 * User Detail Page
 * 
 * Detailed view and editing interface for individual users.
 */

'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Clock,
  MapPin,
  Edit,
  Save,
  ArrowLeft,
  UserCheck,
  UserX,
  Key,
  Activity
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabItem } from '@/components/ui/tabs'
import { Table } from '@/components/ui/table'
import { LoadingOverlay, PageLoading } from '@/components/ui/loading'
import { useUser, useUpdateUser, useUserAuditLogs, useUserSessions } from '@/hooks/use-api'
import { usePermissions } from '@/hooks/use-auth'
import { ACCOUNT_STATUS_OPTIONS, ROLE_TYPE_OPTIONS } from '@/lib/constants'
import { dateUtils, stringUtils } from '@/lib/utils'
import { toast } from '@/components/ui/toast'

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const { canEditUsers, canManageRoles } = usePermissions()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<any>({})

  const { data: user, isLoading, refetch } = useUser(userId)
  const { data: auditLogs } = useUserAuditLogs(userId)
  const { data: sessions } = useUserSessions(userId)
  const updateUserMutation = useUpdateUser()

  if (isLoading) {
    return <PageLoading message="Loading user details..." />
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">User Not Found</h1>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  const handleSaveChanges = async () => {
    try {
      await updateUserMutation.mutateAsync({
        id: userId,
        ...editData,
      })
      toast.success('User updated successfully')
      setIsEditing(false)
      setEditData({})
      refetch()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update user')
    }
  }

  const auditLogColumns = [
    {
      key: 'action_display',
      label: 'Action',
      render: (action: string) => <Badge variant="outline">{action}</Badge>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (description: string) => (
        <span className="text-sm text-neutral-700">{description}</span>
      ),
    },
    {
      key: 'ip_address',
      label: 'IP Address',
      render: (ip: string) => (
        <code className="text-xs bg-primary-100 px-2 py-1 rounded">{ip}</code>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (date: string) => dateUtils.formatDateTime(date),
    },
  ]

  const sessionColumns = [
    {
      key: 'location',
      label: 'Location',
      render: (location: string, session: any) => (
        <div>
          <p className="text-sm font-medium">{location || 'Unknown'}</p>
          <p className="text-xs text-neutral-600">{session.ip_address}</p>
        </div>
      ),
    },
    {
      key: 'device_info',
      label: 'Device',
      render: (deviceInfo: any) => (
        <div>
          <p className="text-sm">{deviceInfo?.browser || 'Unknown'}</p>
          <p className="text-xs text-neutral-600">{deviceInfo?.os || 'Unknown'}</p>
        </div>
      ),
    },
    {
      key: 'last_activity',
      label: 'Last Activity',
      render: (date: string) => dateUtils.getRelativeTime(date),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (isActive: boolean) => (
        <StatusBadge status={isActive ? 'active' : 'inactive'} />
      ),
    },
  ]

  const tabs: TabItem[] = [
    {
      id: 'details',
      label: 'Details',
      content: (
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader 
              title="Basic Information"
              action={canEditUsers && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  leftIcon={<Edit className="h-4 w-4" />}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              )}
            />
            <CardContent>
              <LoadingOverlay isLoading={updateUserMutation.isPending}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src={user.profile?.profile_picture}
                      fallback={stringUtils.getInitials(user.first_name, user.last_name)}
                      size="lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {user.full_name}
                      </h3>
                      <p className="text-neutral-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {isEditing ? (
                      <>
                        <Select
                          options={ACCOUNT_STATUS_OPTIONS}
                          value={editData.account_status || user.account_status}
                          onChange={(value) => setEditData({ ...editData, account_status: value })}
                          label="Account Status"
                        />
                        
                        <div className="flex space-x-2">
                          <Button
                            onClick={handleSaveChanges}
                            leftIcon={<Save className="h-4 w-4" />}
                            loading={updateUserMutation.isPending}
                          >
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false)
                              setEditData({})
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Status</label>
                          <div className="mt-1">
                            <StatusBadge status={user.account_status} />
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Joined</label>
                          <p className="text-sm text-neutral-900 mt-1">
                            {dateUtils.formatDateTime(user.date_joined)}
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Last Login</label>
                          <p className="text-sm text-neutral-900 mt-1">
                            {user.last_login ? dateUtils.getRelativeTime(user.last_login) : 'Never'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </LoadingOverlay>
            </CardContent>
          </Card>

          {/* Profile Information */}
          {user.profile && (
            <Card>
              <CardHeader title="Profile Information" />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Display Name</label>
                      <p className="text-sm text-neutral-900 mt-1">
                        {user.profile.display_name || 'Not set'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Company</label>
                      <p className="text-sm text-neutral-900 mt-1">
                        {user.profile.company || 'Not set'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Job Title</label>
                      <p className="text-sm text-neutral-900 mt-1">
                        {user.profile.job_title || 'Not set'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Phone</label>
                      <p className="text-sm text-neutral-900 mt-1">
                        {user.profile.phone || 'Not set'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Timezone</label>
                      <p className="text-sm text-neutral-900 mt-1">
                        {user.profile.timezone_name}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Website</label>
                      <p className="text-sm text-neutral-900 mt-1">
                        {user.profile.website ? (
                          <a 
                            href={user.profile.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-accent-blue hover:text-accent-blue/80"
                          >
                            {user.profile.website}
                          </a>
                        ) : (
                          'Not set'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Roles and Permissions */}
          <Card>
            <CardHeader title="Roles and Permissions" />
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">
                    Assigned Roles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role: any) => (
                      <Badge key={role.id} variant="secondary">
                        {role.name}
                        <span className="ml-1 text-xs text-neutral-500">
                          ({role.role_type})
                        </span>
                      </Badge>
                    ))}
                    {user.roles.length === 0 && (
                      <p className="text-sm text-neutral-600">No roles assigned</p>
                    )}
                  </div>
                </div>

                {canManageRoles && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* TODO: Open role assignment modal */}}
                  >
                    Manage Roles
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      content: (
        <div className="space-y-6">
          {/* Security Status */}
          <Card>
            <CardHeader title="Security Status" />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700">Email Verified</span>
                    <StatusBadge status={user.is_email_verified ? 'verified' : 'unverified'} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700">Phone Verified</span>
                    <StatusBadge status={user.is_phone_verified ? 'verified' : 'unverified'} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700">MFA Enabled</span>
                    <StatusBadge status={user.is_mfa_enabled ? 'enabled' : 'disabled'} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Failed Login Attempts</label>
                    <p className="text-sm text-neutral-900 mt-1">
                      {user.failed_login_attempts || 0}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Last Login IP</label>
                    <p className="text-sm text-neutral-900 mt-1">
                      {user.last_login_ip || 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader title="Active Sessions" />
            <CardContent>
              <Table
                columns={sessionColumns}
                data={sessions || []}
                emptyMessage="No active sessions"
              />
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: Activity,
      content: (
        <Card>
          <CardHeader title="Audit Log" />
          <CardContent>
            <Table
              columns={auditLogColumns}
              data={auditLogs || []}
              emptyMessage="No activity recorded"
            />
          </CardContent>
        </Card>
      ),
    },
  ]

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {user.full_name}
              </h1>
              <p className="text-neutral-600">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <StatusBadge status={user.account_status} />
            {user.is_organizer && (
              <Badge variant="info">Organizer</Badge>
            )}
          </div>
        </div>

        {/* User Details Tabs */}
        <Tabs tabs={tabs} defaultTab="details" />
      </div>
    </AppLayout>
  )
}