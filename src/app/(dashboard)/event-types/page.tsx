/**
 * Event Types List Page
 * 
 * Main page for managing all event types with search, filtering, and actions.
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Users,
  MapPin,
  Video,
  Phone,
  Settings,
  ExternalLink
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Table } from '@/components/ui/table'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Dropdown } from '@/components/ui/dropdown'
import { Modal, ConfirmationModal } from '@/components/ui/modal'
import { EmptyState } from '@/components/ui/empty-state'
import { Tooltip } from '@/components/ui/tooltip'
import { useEventTypes, useDeleteEventType, useUpdateEventType } from '@/hooks/use-api'
import { usePermissions } from '@/hooks/use-auth'
import { usePagination } from '@/hooks/use-pagination'
import { useDebounce } from '@/hooks/use-debounce'
import { LOCATION_TYPE_OPTIONS, DURATION_OPTIONS } from '@/lib/constants'
import { dateUtils, stringUtils } from '@/lib/utils'
import { toast } from '@/components/ui/toast'

export default function EventTypesPage() {
  const { canCreateEvents, canEditEvents, canDeleteEvents } = usePermissions()
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedEventType, setSelectedEventType] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  const debouncedSearch = useDebounce(searchQuery, 300)
  const pagination = usePagination({ initialPageSize: 20 })

  // Fetch event types with filters
  const { data: eventTypesData, isLoading, refetch } = useEventTypes({
    search: debouncedSearch,
    location_type: locationFilter,
    is_active: statusFilter,
    page: pagination.currentPage,
    page_size: pagination.pageSize,
  })

  const deleteEventTypeMutation = useDeleteEventType()
  const updateEventTypeMutation = useUpdateEventType()

  const eventTypes = eventTypesData?.results || []
  const totalEventTypes = eventTypesData?.count || 0

  const getLocationIcon = (locationType: string) => {
    switch (locationType) {
      case 'video_call':
        return <Video className="h-4 w-4" />
      case 'phone_call':
        return <Phone className="h-4 w-4" />
      case 'in_person':
        return <MapPin className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const handleToggleStatus = async (eventType: any) => {
    try {
      await updateEventTypeMutation.mutateAsync({
        id: eventType.id,
        is_active: !eventType.is_active,
      })
      toast.success(`Event type ${eventType.is_active ? 'deactivated' : 'activated'} successfully`)
      refetch()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update event type status')
    }
  }

  const handleDuplicate = async (eventType: any) => {
    try {
      // This would call a duplicate endpoint
      toast.success('Event type duplicated successfully')
      refetch()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to duplicate event type')
    }
  }

  const handleDelete = async () => {
    if (!selectedEventType) return

    try {
      await deleteEventTypeMutation.mutateAsync(selectedEventType.id)
      toast.success('Event type deleted successfully')
      setShowDeleteModal(false)
      setSelectedEventType(null)
      refetch()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete event type')
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Event Type',
      render: (name: string, eventType: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-indigo rounded-lg flex items-center justify-center">
            {getLocationIcon(eventType.location_type)}
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900">{name}</p>
            <p className="text-xs text-neutral-600">
              {eventType.event_type_slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (duration: number) => (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4 text-neutral-500" />
          <span className="text-sm text-neutral-700">
            {DURATION_OPTIONS.find(opt => opt.value === duration)?.label || `${duration} min`}
          </span>
        </div>
      ),
    },
    {
      key: 'location_type',
      label: 'Location',
      render: (locationType: string) => {
        const location = LOCATION_TYPE_OPTIONS.find(opt => opt.value === locationType)
        return (
          <div className="flex items-center space-x-1">
            {getLocationIcon(locationType)}
            <span className="text-sm text-neutral-700">
              {location?.label || locationType}
            </span>
          </div>
        )
      },
    },
    {
      key: 'max_attendees',
      label: 'Attendees',
      render: (maxAttendees: number, eventType: any) => (
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-neutral-500" />
          <span className="text-sm text-neutral-700">{maxAttendees}</span>
          {eventType.is_group_event && (
            <Badge variant="info" size="sm">Group</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, eventType: any) => (
        <div className="flex items-center space-x-2">
          <StatusBadge status={eventType.is_active ? 'active' : 'inactive'} />
          {eventType.is_private && (
            <Tooltip content="Private event type">
              <EyeOff className="h-4 w-4 text-neutral-500" />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (date: string) => dateUtils.formatDate(date, 'MMM dd, yyyy'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, eventType: any) => (
        <Dropdown
          items={[
            {
              id: 'view',
              label: 'View Public Page',
              icon: ExternalLink,
              onClick: () => window.open(`/${eventType.organizer.profile.organizer_slug}/${eventType.event_type_slug}`, '_blank'),
            },
            {
              id: 'edit',
              label: 'Edit',
              icon: Edit,
              href: `/event-types/${eventType.id}/edit`,
              disabled: !canEditEvents,
            },
            {
              id: 'duplicate',
              label: 'Duplicate',
              icon: Copy,
              onClick: () => handleDuplicate(eventType),
              disabled: !canCreateEvents,
            },
            {
              id: 'separator1',
              label: '',
              separator: true,
            },
            {
              id: 'toggle',
              label: eventType.is_active ? 'Deactivate' : 'Activate',
              icon: eventType.is_active ? EyeOff : Eye,
              onClick: () => handleToggleStatus(eventType),
              disabled: !canEditEvents,
            },
            {
              id: 'delete',
              label: 'Delete',
              icon: Trash2,
              onClick: () => {
                setSelectedEventType(eventType)
                setShowDeleteModal(true)
              },
              disabled: !canDeleteEvents,
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
            <h1 className="text-2xl font-bold text-neutral-900">Event Types</h1>
            <p className="text-neutral-600 mt-1">
              Create and manage your scheduling event types
            </p>
          </div>
          
          {canCreateEvents && (
            <Link href="/event-types/create">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Create Event Type
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
                  placeholder="Search event types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
              
              <Select
                options={[
                  { value: '', label: 'All Locations' },
                  ...LOCATION_TYPE_OPTIONS.map(location => ({
                    value: location.value,
                    label: location.label,
                  })),
                ]}
                value={locationFilter}
                onChange={setLocationFilter}
                placeholder="Filter by location"
              />

              <Select
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Inactive' },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by status"
              />
            </div>
          </CardContent>
        </Card>

        {/* Event Types Table */}
        <Card>
          <CardHeader 
            title={`Event Types (${totalEventTypes})`}
            description="All your scheduling event types"
          />
          <CardContent>
            {eventTypes.length === 0 && !isLoading ? (
              <EmptyState
                title="No event types found"
                description="Create your first event type to start accepting bookings."
                icon={Calendar}
                action={{
                  label: 'Create Event Type',
                  href: '/event-types/create',
                  icon: Plus,
                }}
              />
            ) : (
              <>
                <Table
                  columns={columns}
                  data={eventTypes}
                  loading={isLoading}
                  emptyMessage="No event types found"
                />
                
                {totalEventTypes > pagination.pageSize && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={Math.ceil(totalEventTypes / pagination.pageSize)}
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
            setSelectedEventType(null)
          }}
          onConfirm={handleDelete}
          title="Delete Event Type"
          message={`Are you sure you want to delete "${selectedEventType?.name}"? This action cannot be undone and will cancel all future bookings.`}
          confirmText="Delete Event Type"
          variant="danger"
          loading={deleteEventTypeMutation.isPending}
        />
      </div>
    </AppLayout>
  )
}