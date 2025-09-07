/**
 * Event Type Creation Wizard
 * 
 * Multi-step wizard for creating new event types with comprehensive configuration.
 */

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Video, 
  Phone, 
  Settings,
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Radio } from '@/components/ui/radio'
import { Form, FormSection, FormField, FormGrid, FormActions } from '@/components/ui/form'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { LoadingOverlay } from '@/components/ui/loading'
import { CustomQuestionBuilder } from '@/components/event-types/custom-question-builder'
import { WorkflowSelector } from '@/components/event-types/workflow-selector'
import { useCreateEventType, useWorkflows } from '@/hooks/use-api'
import { eventTypeCreateSchema, type EventTypeCreateData } from '@/lib/validation'
import { 
  DURATION_OPTIONS, 
  LOCATION_TYPE_OPTIONS, 
  BUFFER_TIME_OPTIONS,
  SLOT_INTERVAL_OPTIONS,
  REMINDER_TIME_OPTIONS
} from '@/lib/constants'
import { toast } from '@/components/ui/toast'

const WIZARD_STEPS = [
  { id: 'basic', title: 'Basic Info', description: 'Event name and description' },
  { id: 'scheduling', title: 'Scheduling', description: 'Duration and availability settings' },
  { id: 'location', title: 'Location', description: 'Meeting location and details' },
  { id: 'advanced', title: 'Advanced', description: 'Recurrence and limits' },
  { id: 'questions', title: 'Questions', description: 'Custom questions for invitees' },
  { id: 'workflows', title: 'Workflows', description: 'Automation and notifications' },
  { id: 'review', title: 'Review', description: 'Review and create' },
]

export default function CreateEventTypePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [customQuestions, setCustomQuestions] = useState<any[]>([])
  const [selectedWorkflows, setSelectedWorkflows] = useState({
    confirmation: null,
    reminder: null,
    cancellation: null,
  })

  const createEventTypeMutation = useCreateEventType()
  const { data: workflows } = useWorkflows({ is_active: true })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<EventTypeCreateData>({
    resolver: zodResolver(eventTypeCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: 30,
      max_attendees: 1,
      enable_waitlist: false,
      is_active: true,
      is_private: false,
      min_scheduling_notice: 60,
      max_scheduling_horizon: 43200,
      buffer_time_before: 0,
      buffer_time_after: 0,
      max_bookings_per_day: null,
      slot_interval_minutes: 15,
      location_type: 'video_call',
      location_details: '',
      redirect_url_after_booking: '',
    },
  })

  const currentStepData = WIZARD_STEPS[currentStep]
  const isLastStep = currentStep === WIZARD_STEPS.length - 1
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100

  const nextStep = async () => {
    const isValid = await trigger()
    if (isValid && currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: EventTypeCreateData) => {
    try {
      const eventTypeData = {
        ...data,
        questions_data: customQuestions,
        confirmation_workflow: selectedWorkflows.confirmation,
        reminder_workflow: selectedWorkflows.reminder,
        cancellation_workflow: selectedWorkflows.cancellation,
      }

      await createEventTypeMutation.mutateAsync(eventTypeData)
      toast.success('Event type created successfully!')
      router.push('/event-types')
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create event type')
    }
  }

  const renderStepContent = () => {
    switch (WIZARD_STEPS[currentStep].id) {
      case 'basic':
        return (
          <FormSection
            title="Basic Information"
            description="Define the name and description for your event type"
          >
            <FormField>
              <Input
                {...register('name')}
                label="Event Name"
                placeholder="30 Minute Meeting"
                leftIcon={<Calendar className="h-4 w-4" />}
                error={errors.name?.message}
                autoFocus
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
                />
              </FormField>

              <FormField>
                <Input
                  {...register('max_attendees', { valueAsNumber: true })}
                  type="number"
                  label="Max Attendees"
                  min={1}
                  max={100}
                  leftIcon={<Users className="h-4 w-4" />}
                  error={errors.max_attendees?.message}
                />
              </FormField>
            </FormGrid>

            <div className="space-y-4">
              <Switch
                checked={watch('enable_waitlist')}
                onChange={(checked) => setValue('enable_waitlist', checked)}
                label="Enable Waitlist"
                description="Allow people to join a waitlist when the event is full"
              />

              <Switch
                checked={watch('is_private')}
                onChange={(checked) => setValue('is_private', checked)}
                label="Private Event"
                description="Only accessible via direct link"
              />
            </div>
          </FormSection>
        )

      case 'scheduling':
        return (
          <FormSection
            title="Scheduling Settings"
            description="Configure when and how people can book this event"
          >
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
                />
              </FormField>
            </FormGrid>

            <FormSection
              title="Buffer Times"
              description="Add buffer time before and after meetings"
            >
              <FormGrid columns={2}>
                <FormField>
                  <Select
                    options={BUFFER_TIME_OPTIONS}
                    value={watch('buffer_time_before')?.toString()}
                    onChange={(value) => setValue('buffer_time_before', parseInt(value))}
                    label="Buffer Before"
                    error={errors.buffer_time_before?.message}
                  />
                </FormField>

                <FormField>
                  <Select
                    options={BUFFER_TIME_OPTIONS}
                    value={watch('buffer_time_after')?.toString()}
                    onChange={(value) => setValue('buffer_time_after', parseInt(value))}
                    label="Buffer After"
                    error={errors.buffer_time_after?.message}
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
                />
              </FormField>

              <FormField>
                <Select
                  options={SLOT_INTERVAL_OPTIONS}
                  value={watch('slot_interval_minutes')?.toString()}
                  onChange={(value) => setValue('slot_interval_minutes', parseInt(value))}
                  label="Time Slot Interval"
                  error={errors.slot_interval_minutes?.message}
                />
              </FormField>
            </FormGrid>
          </FormSection>
        )

      case 'location':
        return (
          <FormSection
            title="Location Settings"
            description="Configure where this meeting will take place"
          >
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
              />
            </FormField>

            {watch('location_type') !== 'video_call' && (
              <FormField>
                <Textarea
                  {...register('location_details')}
                  label="Location Details"
                  placeholder={getLocationPlaceholder(watch('location_type'))}
                  error={errors.location_details?.message}
                />
              </FormField>
            )}
          </FormSection>
        )

      case 'advanced':
        return (
          <FormSection
            title="Advanced Settings"
            description="Configure additional options and post-booking behavior"
          >
            <FormField>
              <Input
                {...register('redirect_url_after_booking')}
                type="url"
                label="Redirect URL After Booking (Optional)"
                placeholder="https://yourwebsite.com/thank-you"
                error={errors.redirect_url_after_booking?.message}
                helperText="Redirect invitees to a custom page after booking"
              />
            </FormField>

            <Alert variant="info">
              <AlertTitle>Recurrence Settings</AlertTitle>
              <AlertDescription>
                Recurring event functionality will be available in a future update. 
                For now, all events are single-occurrence.
              </AlertDescription>
            </Alert>
          </FormSection>
        )

      case 'questions':
        return (
          <FormSection
            title="Custom Questions"
            description="Add custom questions to collect additional information from invitees"
          >
            <CustomQuestionBuilder
              questions={customQuestions}
              onChange={setCustomQuestions}
            />
          </FormSection>
        )

      case 'workflows':
        return (
          <FormSection
            title="Workflow Integration"
            description="Connect workflows to automate actions for this event type"
          >
            <WorkflowSelector
              workflows={workflows || []}
              selectedWorkflows={selectedWorkflows}
              onChange={setSelectedWorkflows}
            />
          </FormSection>
        )

      case 'review':
        return (
          <FormSection
            title="Review & Create"
            description="Review your event type configuration before creating"
          >
            <div className="space-y-6">
              {/* Basic Info Summary */}
              <Card variant="secondary">
                <CardHeader title="Basic Information" />
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Name</label>
                      <p className="text-sm text-neutral-900">{watch('name')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Duration</label>
                      <p className="text-sm text-neutral-900">
                        {DURATION_OPTIONS.find(opt => opt.value === watch('duration'))?.label}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Max Attendees</label>
                      <p className="text-sm text-neutral-900">{watch('max_attendees')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Location</label>
                      <p className="text-sm text-neutral-900">
                        {LOCATION_TYPE_OPTIONS.find(opt => opt.value === watch('location_type'))?.label}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Questions Summary */}
              {customQuestions.length > 0 && (
                <Card variant="secondary">
                  <CardHeader title={`Custom Questions (${customQuestions.length})`} />
                  <CardContent>
                    <div className="space-y-2">
                      {customQuestions.map((question, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                          <span className="text-sm text-neutral-900">{question.question_text}</span>
                          <Badge variant="outline" size="sm">{question.question_type}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Workflows Summary */}
              {Object.values(selectedWorkflows).some(w => w) && (
                <Card variant="secondary">
                  <CardHeader title="Connected Workflows" />
                  <CardContent>
                    <div className="space-y-2">
                      {selectedWorkflows.confirmation && (
                        <div className="flex items-center space-x-2">
                          <Badge variant="success" size="sm">Confirmation</Badge>
                          <span className="text-sm text-neutral-700">
                            {workflows?.find(w => w.id === selectedWorkflows.confirmation)?.name}
                          </span>
                        </div>
                      )}
                      {selectedWorkflows.reminder && (
                        <div className="flex items-center space-x-2">
                          <Badge variant="info" size="sm">Reminder</Badge>
                          <span className="text-sm text-neutral-700">
                            {workflows?.find(w => w.id === selectedWorkflows.reminder)?.name}
                          </span>
                        </div>
                      )}
                      {selectedWorkflows.cancellation && (
                        <div className="flex items-center space-x-2">
                          <Badge variant="warning" size="sm">Cancellation</Badge>
                          <span className="text-sm text-neutral-700">
                            {workflows?.find(w => w.id === selectedWorkflows.cancellation)?.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </FormSection>
        )

      default:
        return null
    }
  }

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
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900">Create Event Type</h1>
            <p className="text-neutral-600 mt-1">
              Set up a new event type for your scheduling needs
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-4">
            <Progress value={progress} showLabel />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">
                Step {currentStep + 1} of {WIZARD_STEPS.length}
              </span>
              <span className="font-medium text-neutral-900">
                {currentStepData.title}
              </span>
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader 
              title={currentStepData.title}
              description={currentStepData.description}
            />
            <CardContent>
              <LoadingOverlay isLoading={isSubmitting} message="Creating event type...">
                <Form onSubmit={handleSubmit(onSubmit)}>
                  {renderStepContent()}

                  {/* Navigation */}
                  <FormActions>
                    <div className="flex justify-between w-full">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        leftIcon={<ArrowLeft className="h-4 w-4" />}
                      >
                        Previous
                      </Button>

                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => router.push('/event-types')}
                        >
                          Cancel
                        </Button>

                        {isLastStep ? (
                          <Button
                            type="submit"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            leftIcon={<Save className="h-4 w-4" />}
                          >
                            Create Event Type
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            onClick={nextStep}
                            rightIcon={<ArrowRight className="h-4 w-4" />}
                          >
                            Next
                          </Button>
                        )}
                      </div>
                    </div>
                  </FormActions>
                </Form>
              </LoadingOverlay>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}