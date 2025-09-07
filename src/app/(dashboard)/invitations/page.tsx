/**
 * Invitations Management Page
 * 
 * Page for managing team member invitations.
 */

'use client'

import React, { useState } from 'react'
import { 
  UserPlus, 
  Plus, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  Trash2
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { EmptyState } from '@/components/ui/empty-state'
import { useInvitations, useDeleteInvitation } from '@/hooks/use-api'
import { dateUtils } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import { InvitationForm } from '@/components/admin/invitation-form'

export default function InvitationsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null)

  const { data: invitations, isLoading, refetch } = useInvitations()
  const deleteInvitationMutation = useDeleteInvitation()

  const handleDeleteInvitation = async (invitation: any) => {
    try {
      await deleteInvitationMutation.mutateAsync(invitation.id)
      toast.success('Invitation deleted successfully')
      refetch()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete invitation')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-success-500" />
      case 'declined':
        return <XCircle className="h-4 w-4 text-error-500" />
      case 'expired':
        return <Clock className="h-4 w-4 text-warning-500" />
      default:
        return <Clock className="h-4 w-4 text-info-500" />
    }
  }

  const columns = [
    {
      key: 'invited_email',
      label: 'Invited User',
      render: (email: string, invitation: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent-blue/10 rounded-full flex items-center justify-center">
            <Mail className="h-4 w-4 text-accent-blue" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900">{email}</p>
            <p className="text-xs text-neutral-600">
              Invited by {invitation.invited_by_name}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'role_name',
      label: 'Role',
      render: (roleName: string) => (
        <Badge variant="secondary">{roleName}</Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: string) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(status)}
          <StatusBadge status={status} />
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Sent',
      render: (date: string) => (
        <div>
          <p className="text-sm text-neutral-900">
            {dateUtils.formatDate(date, 'MMM dd, yyyy')}
          </p>
          <p className="text-xs text-neutral-600">
            {dateUtils.getRelativeTime(date)}
          </p>
        </div>
      ),
    },
    {
      key: 'expires_at',
      label: 'Expires',
      render: (date: string) => {
        const isExpired = new Date(date) < new Date()
        return (
          <div>
            <p className={`text-sm ${isExpired ? 'text-error-600' : 'text-neutral-900'}`}>
              {dateUtils.formatDate(date, 'MMM dd, yyyy')}
            </p>
            <p className="text-xs text-neutral-600">
              {dateUtils.getRelativeTime(date)}
            </p>
          </div>
        )
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, invitation: any) => (
        <div className="flex items-center space-x-2">
          {invitation.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* TODO: Resend invitation */}}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Resend
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteInvitation(invitation)}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Team Invitations</h1>
            <p className="text-neutral-600 mt-1">
              Manage invitations to join your team
            </p>
          </div>
          
          <Button
            onClick={() => setShowCreateModal(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Send Invitation
          </Button>
        </div>

        {/* Invitations Table */}
        <Card>
          <CardHeader 
            title={`Invitations (${invitations?.length || 0})`}
            description="All sent invitations and their status"
          />
          <CardContent>
            {invitations?.length === 0 && !isLoading ? (
              <EmptyState
                title="No invitations sent"
                description="Send your first invitation to start building your team."
                icon={UserPlus}
                action={{
                  label: 'Send Invitation',
                  onClick: () => setShowCreateModal(true),
                  icon: Plus,
                }}
              />
            ) : (
              <Table
                columns={columns}
                data={invitations || []}
                loading={isLoading}
                emptyMessage="No invitations found"
              />
            )}
          </CardContent>
        </Card>

        {/* Create Invitation Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Send Team Invitation"
          size="md"
        >
          <InvitationForm
            onSuccess={() => {
              setShowCreateModal(false)
              refetch()
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      </div>
    </AppLayout>
  )
}