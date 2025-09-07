/**
 * Event Type Edit Page
 * 
 * Edit existing event type with pre-populated data and full configuration options.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Calendar, 
  Save, 
  ArrowLeft,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Radio } from '@/components/ui/radio'
import { Tabs, TabItem } from '@/components/ui/tabs'
import { Form, FormSection, FormField, FormGrid, FormActions } from '@/components/ui/form'
import { LoadingOverlay, PageLoading } from '@/components/ui/loading'
import { ConfirmationModal } from '@/components/ui/modal'
import { CustomQuestionBuilder } from '@/components/event-types/custom-question-builder'
import { WorkflowSelector } from '@/components/event-types/workflow-selector'
import { 
  useEventType, 
  useUpdateEventType, 
  useDeleteEventType, 
  useDuplicateEventType,
  useWorkflows 
} from '@/hooks/use-api'
import { usePermissions } from '@/hooks/use-auth'
import { eventTypeUpdateSchema, type EventTypeUpdateData } from '@/lib/validation'
import { 
  DURATION_OPTIONS, 
  LOCATION_TYPE_OPTIONS, 
  BUFFER_TIME_OPTIONS,
  SLOT_INTERVAL_OPTIONS,
  REMINDER_TIME_OPTIONS
} from '@/lib/constants'
import { toast } from '@/components/ui/toast'

export default function EditEventTypePage() {
  const params = useParams()
  const router = useRouter()
  const eventTypeId = params.id as string
  const { canEditEvents, canDeleteEvents } = usePermissions()
  
  const [customQuestions, setCustomQuestions] = useState<any[]>([])
  const [selectedWorkflows, setSelectedWorkflows] = useState({
    confirmation: null,
    reminder: null,
    cancellation: null,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { data: eventType, isLoading } = useEventType(eventTypeId)
  const { data: workflows } = useWorkflows({ is_active: true })
  const updateEventTypeMutation = useUpdateEventType()
  const deleteEventTypeMutation = useDeleteEventType()
  const duplicateEventTypeMutation = useDuplicateEventType()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EventTypeUpdateData>({
    resolver: zodResolver(eventTypeUpdateSchema),
  })

  // Populate form when event type data loads
  useEffect(() => {
    if (eventType) {
      reset({
        name: eventType.name,
        description: eventType.description || '',
        duration: eventType.duration,
        max_attendees: eventType.max_attendees,
        enable_waitlist: eventType.enable_waitlist,
        is_active: eventType.is_active,
        is_private: eventType.is_private,
        min_scheduling_notice: eventType.min_scheduling_notice,
        max_scheduling_horizon: eventType.max_scheduling_horizon,
        buffer_time_before: eventType.buffer_time_before,
        buffer_time_after: eventType.buffer_time_after,
        max_bookings_per_day: eventType.max_bookings_per_day,
        slot_interval_minutes: eventType.slot_interval_minutes,
        location_type: eventType.location_type,
        location_details: eventType.location_details || '',
        redirect_url_after_booking: eventType.redirect_url_after_booking || '',
      })

      setCustomQuestions(eventType.questions || [])
      setSelectedWorkflows({
        confirmation: eventType.confirmation_workflow,
        reminder: eventType.reminder_workflow,
        cancellation: eventType.cancellation_workflow,
      })
    }
  }, [eventType, reset])

  const onSubmit = async (data: EventTypeUpdateData) => {
    try {
      const updateData = {
        ...data,
        questions_data: customQuestions,
        confirmation_workflow: selectedWorkflows.confirmation,
        reminder_workflow: selectedWorkflows.reminder,
        cancellation_workflow: selectedWorkflows.cancellation,
      }

      await updateEventTypeMutation.mutateAsync({
        id: eventTypeId,
        ...updateData,
      })
      toast.success('Event type updated successfully!')
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update event type')
    }
  }

  const handleDuplicate = async () => {
    try {
      const duplicated = await duplicateEventTypeMutation.mutateAsync(eventTypeId)
      toast.success('Event type duplicated successfully!')
      router.push(`/event-types/${duplicated.id}/edit`)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to duplicate event type')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteEventTypeMutation.mutateAsync(eventTypeId)
      toast.success('Event type deleted successfully!')
      router.push('/event-types')
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete event type')
    }
  }

  const handleToggleStatus = async () => {
    try {
      await updateEventTypeMutation.mutateAsync({
        id: eventTypeId,
        is_active: !eventType?.is_active,
      })
      toast.success(`Event type ${eventType?.is_active ? 'deactivated' : 'activated'} successfully`)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update event type status')
    }
  }

  if (isLoading) {
    return <PageLoading message="Loading event type..." />
  }

  if (!eventType) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Event Type Not Found</h1>
            <Button onClick={() => router.push('/event-types')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Event Types
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  const tabs: TabItem[] = [
    {
      id: 'basic',
      label: 'Basic Settings',
      content: (
        <div className="space-y-6">
          <FormSection title="Basic Information">
            <FormField>
              <Input
                {...register('name')}
                label="Event Name"
                placeholder="30 Minute Meeting"
                leftIcon={<Calendar className="h-4 w-4" />}
                error={errors.name?.message}
                disabled={!canEditEvents}
              />
            </FormField>

            <FormField>
              <Textarea
                {...register('description')}
                label="Description"
                placeholder="Describe what this meeting is for..."
                maxLength={1000}
                showCharCount
                error={errors.description?.message}
                disabled={!canEditEvents}
              />
            </FormField>

            <FormGrid columns={2}>
              <FormField>
                <Select
                  options={DURATION_OPTIONS}
                  value={watch('duration')?.toString()}
                  onChange={(value) => setValue('duration', parseInt(value))}
                  label="Duration"
                  error={errors.duration?.message}
                  disabled={!canEditEvents}
                />
              </FormField>

              <FormField>
                <Input
                  {...register('max_attendees', { valueAsNumber: true })}
                  type="number"
                  label="Max Attendees"
                  min={1}
                  max={100}
                  error={errors.max_attendees?.message}
                  disabled={!canEditEvents}
                />
              </FormField>
            </FormGrid>

            <div className="space-y-4">
              <Switch
                checked={watch('enable_waitlist')}
                onChange={(checked) => setValue('enable_waitlist', checked)}
                label="Enable Waitlist"
                description="Allow people to join a waitlist when the event is full"
                disabled={!canEditEvents}
              />

              <Switch
                checked={watch('is_private')}
                onChange={(checked) => setValue('is_private', checked)}
                label="Private Event"
                description="Only accessible via direct link"
                disabled={!canEditEvents}
              />
            </div>
          </FormSection>
        </div>
      ),
    },
    {
      id: 'scheduling',
      label: 'Scheduling',
      content: (
        <div className="space-y-6">
          <FormSection title="Scheduling Settings">
            <FormGrid columns={2}>
              <FormField>
                <Select
                  options={REMINDER_TIME_OPTIONS.map(opt => ({
                    value: opt.value.toString(),
                    label: opt.label,
                  }))}
                  value={watch('min_scheduling_notice')?.toString()}
                  onChange={(value) => setValue('min_scheduling_notice', parseInt(value))}
                  label="Minimum Notice"
                  error={errors.min_scheduling_notice?.message}
                  disabled={!canEditEvents}
                />
              </FormField>

              <FormField>
                <Select
                  options={[
                    { value: '1440', label: '1 day' },
                    { value: '10080', label: '1 week' },
                    { value: '20160', label: '2 weeks' },
                    { value: '43200', label: '30 days' },
                    { value: '129600', label: '90 days' },
                  ]}
                  value={watch('max_scheduling_horizon')?.toString()}
                  onChange={(value) => setValue('max_scheduling_horizon', parseInt(value))}
                  label="Booking Window"
                  error={errors.max_scheduling_horizon?.message}
                  disabled={!canEditEvents}
                />
              </FormField>
            </FormGrid>

            <FormSection title="Buffer Times">
              <FormGrid columns={2}>
                <FormField>
                  <Select
                    options={BUFFER_TIME_OPTIONS}
                    value={watch('buffer_time_before')?.toString()}
                    onChange={(value) => setValue('buffer_time_before', parseInt(value))}
                    label="Buffer Before"
                    error={errors.buffer_time_before?.message}
                    disabled={!canEditEvents}
                  />
                </FormField>

                <FormField>
                  <Select
                    options={BUFFER_TIME_OPTIONS}
                    value={watch('buffer_time_after')?.toString()}
                    onChange={(value) => setValue('buffer_time_after', parseInt(value))}
                    label="Buffer After"
                    error={errors.buffer_time_after?.message}
                    disabled={!canEditEvents}
                  />
                </FormField>
              </FormGrid>
            </FormSection>

            <FormGrid columns={2}>
              <FormField>
                <Input
                  {...register('max_bookings_per_day', { valueAsNumber: true })}
                  type="number"
                  label="Max Bookings Per Day (Optional)"
                  placeholder="No limit"
                  min={1}
                  max={50}
                  error={errors.max_bookings_per_day?.message}
                  disabled={!canEditEvents}
                />
              </FormField>

              <FormField>
                <Select
                  options={SLOT_INTERVAL_OPTIONS}
                  value={watch('slot_interval_minutes')?.toString()}
                  onChange={(value) => setValue('slot_interval_minutes', parseInt(value))}
                  label="Time Slot Interval"
                  error={errors.slot_interval_minutes?.message}
                  disabled={!canEditEvents}
                />
              </FormField>
            </FormGrid>
          </FormSection>
        </div>
      ),
    },
    {
      id: 'location',
      label: 'Location',
      content: (
        <div className="space-y-6">
          <FormSection title="Location Settings">
            <FormField>
              <Radio
                options={LOCATION_TYPE_OPTIONS.map(option => ({
                  value: option.value,
                  label: option.label,
                  description: getLocationDescription(option.value),
                }))}
                value={watch('location_type')}
                onChange={(value) => setValue('location_type', value as any)}
                label="Location Type"
                error={errors.location_type?.message}
                disabled={!canEditEvents}
              />
            </FormField>

            {watch('location_type') !== 'video_call' && (
              <FormField>
                <Textarea
                  {...register('location_details')}
                  label="Location Details"
                  placeholder={getLocationPlaceholder(watch('location_type'))}
                  error={errors.location_details?.message}
                  disabled={!canEditEvents}
                />
              </FormField>
            )}

            <FormField>
              <Input
                {...register('redirect_url_after_booking')}
                type="url"
                label="Redirect URL After Booking (Optional)"
                placeholder="https://yourwebsite.com/thank-you"
                error={errors.redirect_url_after_booking?.message}
                helperText="Redirect invitees to a custom page after booking"
                disabled={!canEditEvents}
              />
            </FormField>
          </FormSection>
        </div>
      ),
    },
    {
      id: 'questions',
      label: 'Custom Questions',
      content: (
        <FormSection title="Custom Questions">
          <CustomQuestionBuilder
            questions={customQuestions}
            onChange={setCustomQuestions}
            disabled={!canEditEvents}
          />
        </FormSection>
      ),
    },
    {
      id: 'workflows',
      label: 'Workflows',
      content: (
        <FormSection title="Workflow Integration">
          <WorkflowSelector
            workflows={workflows || []}
            selectedWorkflows={selectedWorkflows}
            onChange={setSelectedWorkflows}
            disabled={!canEditEvents}
          />
        </FormSection>
      ),
    },
  ]

  const getLocationDescription = (locationType: string) => {
    switch (locationType) {
      case 'video_call':
        return 'Meeting link will be generated automatically'
      case 'phone_call':
        return 'You will provide a phone number'
      case 'in_person':
        return 'Meeting at a physical location'
      case 'custom':
        return 'Custom meeting instructions'
      default:
        return ''
    }
  }

  const getLocationPlaceholder = (locationType: string) => {
    switch (locationType) {
      case 'phone_call':
        return 'Enter phone number or conference line details...'
      case 'in_person':
        return 'Enter meeting address or location details...'
      case 'custom':
        return 'Enter custom meeting instructions...'
      default:
        return 'Enter location details...'
    }
  }

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/event-types')}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Edit Event Type
                </h1>
                <p className="text-neutral-600">{eventType?.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => window.open(`/${eventType?.organizer.profile.organizer_slug}/${eventType?.event_type_slug}`, '_blank')}
                leftIcon={<ExternalLink className="h-4 w-4" />}
              >
                View Public Page
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDuplicate}
                leftIcon={<Copy className="h-4 w-4" />}
                disabled={!canEditEvents}
              >
                Duplicate
              </Button>

              <Button
                variant="outline"
                onClick={handleToggleStatus}
                leftIcon={eventType?.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                disabled={!canEditEvents}
              >
                {eventType?.is_active ? 'Deactivate' : 'Activate'}
              </Button>

              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
                leftIcon={<Trash2 className="h-4 w-4" />}
                disabled={!canDeleteEvents}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Form */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <LoadingOverlay isLoading={isSubmitting} message="Updating event type...">
              <Tabs tabs={tabs} defaultTab="basic" />

              {/* Save Actions */}
              {canEditEvents && (
                <FormActions>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                    disabled={!isDirty || isSubmitting}
                  >
                    Reset Changes
                  </Button>
                  
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isDirty || isSubmitting}
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    Save Changes
                  </Button>
                </FormActions>
              )}
            </LoadingOverlay>
          </Form>

          {/* Delete Confirmation Modal */}
          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            title="Delete Event Type"
            message={`Are you sure you want to delete "${eventType?.name}"? This action cannot be undone and will cancel all future bookings.`}
            confirmText="Delete Event Type"
            variant="danger"
            loading={deleteEventTypeMutation.isPending}
          />
        </div>
      </div>
    </AppLayout>
  )
}