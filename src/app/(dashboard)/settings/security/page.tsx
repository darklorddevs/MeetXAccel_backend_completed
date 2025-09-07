/**
 * Security Settings Page
 * 
 * Comprehensive security management including MFA, sessions, and password settings.
 */

'use client'

import React, { useState } from 'react'
import { 
  Shield, 
  Key, 
  Smartphone, 
  Lock, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Table } from '@/components/ui/table'
import { Tabs, TabItem } from '@/components/ui/tabs'
import { Modal, ConfirmationModal } from '@/components/ui/modal'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { EmptyState } from '@/components/ui/empty-state'
import { 
  useAuth,
  useMfaDevices, 
  useUserSessions, 
  useRevokeSession, 
  useRevokeAllSessions,
  useDisableMfa,
  useRegenerateBackupCodes
} from '@/hooks/use-api'
import { dateUtils } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import { MfaSetupWizard } from '@/components/security/mfa-setup-wizard'
import { ChangePasswordForm } from '@/components/security/change-password-form'

export default function SecuritySettingsPage() {
  const { user } = useAuth()
  const [showMfaSetup, setShowMfaSetup] = useState(false)
  const [showDisableMfaModal, setShowDisableMfaModal] = useState(false)
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [showRevokeSessionModal, setShowRevokeSessionModal] = useState(false)
  const [showRevokeAllModal, setShowRevokeAllModal] = useState(false)

  const { data: mfaDevices, refetch: refetchMfaDevices } = useMfaDevices()
  const { data: sessions, refetch: refetchSessions } = useUserSessions()
  const revokeSessionMutation = useRevokeSession()
  const revokeAllSessionsMutation = useRevokeAllSessions()
  const disableMfaMutation = useDisableMfa()
  const regenerateBackupCodesMutation = useRegenerateBackupCodes()

  const handleRevokeSession = async () => {
    if (!selectedSession) return

    try {
      await revokeSessionMutation.mutateAsync(selectedSession.id)
      toast.success('Session revoked successfully')
      setShowRevokeSessionModal(false)
      setSelectedSession(null)
      refetchSessions()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to revoke session')
    }
  }

  const handleRevokeAllSessions = async () => {
    try {
      await revokeAllSessionsMutation.mutateAsync()
      toast.success('All other sessions revoked successfully')
      setShowRevokeAllModal(false)
      refetchSessions()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to revoke sessions')
    }
  }

  const handleDisableMfa = async () => {
    try {
      await disableMfaMutation.mutateAsync()
      toast.success('MFA disabled successfully')
      setShowDisableMfaModal(false)
      refetchMfaDevices()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to disable MFA')
    }
  }

  const handleRegenerateBackupCodes = async () => {
    try {
      const response = await regenerateBackupCodesMutation.mutateAsync()
      toast.success('Backup codes regenerated successfully')
      setShowBackupCodesModal(false)
      // TODO: Show new backup codes in a modal
    } catch (error: any) {
      toast.error(error?.message || 'Failed to regenerate backup codes')
    }
  }

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
      key: 'is_current',
      label: 'Status',
      render: (isCurrent: boolean) => (
        isCurrent ? (
          <Badge variant="success">Current</Badge>
        ) : (
          <Badge variant="secondary">Active</Badge>
        )
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, session: any) => (
        !session.is_current && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedSession(session)
              setShowRevokeSessionModal(true)
            }}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Revoke
          </Button>
        )
      ),
    },
  ]

  const tabs: TabItem[] = [
    {
      id: 'mfa',
      label: 'Multi-Factor Authentication',
      icon: Smartphone,
      content: (
        <div className="space-y-6">
          {/* MFA Status */}
          <Card>
            <CardHeader title="MFA Status" />
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${user?.is_mfa_enabled ? 'bg-success-500' : 'bg-error-500'}`} />
                  <div>
                    <p className="font-medium text-neutral-900">
                      Multi-Factor Authentication
                    </p>
                    <p className="text-sm text-neutral-600">
                      {user?.is_mfa_enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                
                {user?.is_mfa_enabled ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowDisableMfaModal(true)}
                    leftIcon={<Shield className="h-4 w-4" />}
                  >
                    Disable MFA
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowMfaSetup(true)}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Enable MFA
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* MFA Devices */}
          {user?.is_mfa_enabled && (
            <Card>
              <CardHeader 
                title="MFA Devices"
                description="Manage your authentication devices"
              />
              <CardContent>
                {mfaDevices?.length === 0 ? (
                  <EmptyState
                    title="No MFA devices"
                    description="Add an authentication device to secure your account."
                    icon={Smartphone}
                    action={{
                      label: 'Add Device',
                      onClick: () => setShowMfaSetup(true),
                      icon: Plus,
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    {mfaDevices?.map((device: any) => (
                      <div key={device.id} className="flex items-center justify-between p-4 border border-primary-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-neutral-500" />
                          <div>
                            <p className="font-medium text-neutral-900">{device.name}</p>
                            <p className="text-sm text-neutral-600">
                              {device.device_type_display}
                              {device.phone_number && ` • ${device.phone_number}`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {device.is_primary && (
                            <Badge variant="success" size="sm">Primary</Badge>
                          )}
                          <StatusBadge status={device.is_active ? 'active' : 'inactive'} />
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowBackupCodesModal(true)}
                        leftIcon={<Key className="h-4 w-4" />}
                      >
                        Regenerate Backup Codes
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* MFA Recommendations */}
          {!user?.is_mfa_enabled && (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Enhance Your Security</AlertTitle>
              <AlertDescription>
                Enable multi-factor authentication to add an extra layer of security to your account.
              </AlertDescription>
            </Alert>
          )}
        </div>
      ),
    },
    {
      id: 'password',
      label: 'Password',
      icon: Lock,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader 
              title="Change Password"
              description="Update your account password"
            />
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: 'sessions',
      label: 'Active Sessions',
      icon: Activity,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader 
              title="Active Sessions"
              description="Manage your active login sessions"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRevokeAllModal(true)}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                >
                  Revoke All Others
                </Button>
              }
            />
            <CardContent>
              <Table
                columns={sessionColumns}
                data={sessions || []}
                loading={false}
                emptyMessage="No active sessions"
              />
            </CardContent>
          </Card>
        </div>
      ),
    },
  ]

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Security Settings</h1>
          <p className="text-neutral-600 mt-1">
            Manage your account security and authentication methods
          </p>
        </div>

        {/* Security Tabs */}
        <Tabs tabs={tabs} defaultTab="mfa" />

        {/* MFA Setup Modal */}
        <Modal
          isOpen={showMfaSetup}
          onClose={() => setShowMfaSetup(false)}
          title="Enable Multi-Factor Authentication"
          size="md"
        >
          <MfaSetupWizard
            onSuccess={() => {
              setShowMfaSetup(false)
              refetchMfaDevices()
            }}
            onCancel={() => setShowMfaSetup(false)}
          />
        </Modal>

        {/* Disable MFA Confirmation */}
        <ConfirmationModal
          isOpen={showDisableMfaModal}
          onClose={() => setShowDisableMfaModal(false)}
          onConfirm={handleDisableMfa}
          title="Disable Multi-Factor Authentication"
          message="Are you sure you want to disable MFA? This will make your account less secure."
          confirmText="Disable MFA"
          variant="danger"
          loading={disableMfaMutation.isPending}
        />

        {/* Revoke Session Confirmation */}
        <ConfirmationModal
          isOpen={showRevokeSessionModal}
          onClose={() => {
            setShowRevokeSessionModal(false)
            setSelectedSession(null)
          }}
          onConfirm={handleRevokeSession}
          title="Revoke Session"
          message="Are you sure you want to revoke this session? The user will be signed out."
          confirmText="Revoke Session"
          variant="warning"
          loading={revokeSessionMutation.isPending}
        />

        {/* Revoke All Sessions Confirmation */}
        <ConfirmationModal
          isOpen={showRevokeAllModal}
          onClose={() => setShowRevokeAllModal(false)}
          onConfirm={handleRevokeAllSessions}
          title="Revoke All Other Sessions"
          message="Are you sure you want to revoke all other sessions? You will remain signed in on this device."
          confirmText="Revoke All Others"
          variant="warning"
          loading={revokeAllSessionsMutation.isPending}
        />
      </div>
    </AppLayout>
  )
}