/**
 * Public Event Type Booking Page
 * 
 * Public-facing booking page with availability calendar and booking form.
 */

'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Mail,
  MessageSquare,
  Globe,
  Building,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Radio } from '@/components/ui/radio'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Form, FormField, FormGrid, FormActions } from '@/components/ui/form'
import { LoadingOverlay, PageLoading } from '@/components/ui/loading'
import { EmptyState } from '@/components/ui/empty-state'
import { usePublicEventType, useAvailableSlots, useCreateBooking } from '@/hooks/use-api'
import { bookingCreateSchema, type BookingCreateData } from '@/lib/validation'
import { 
  TIMEZONE_OPTIONS, 
  DURATION_OPTIONS, 
  LOCATION_TYPE_OPTIONS 
} from '@/lib/constants'
import { dateUtils, stringUtils, cn } from '@/lib/utils'
import { toast } from '@/components/ui/toast'

export default function PublicBookingPage() {
  const params = useParams()
  const router = useRouter()
  const organizerSlug = params.organizerSlug as string
  const eventTypeSlug = params.eventTypeSlug as string

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState<'select-time' | 'booking-form' | 'confirmation'>('select-time')
  const [attendeeCount, setAttendeeCount] = useState(1)
  const [inviteeTimezone, setInviteeTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  )
  const [bookingResult, setBookingResult] = useState<any>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Fetch event type data
  const { data: eventType, isLoading: eventTypeLoading, error: eventTypeError } = usePublicEventType(
    organizerSlug, 
    eventTypeSlug
  )

  // Fetch available slots when date is selected
  const { data: availabilityData, isLoading: slotsLoading } = useAvailableSlots(
    organizerSlug,
    eventTypeSlug,
    selectedDate ? {
      start_date: selectedDate.toISOString().split('T')[0],
      end_date: selectedDate.toISOString().split('T')[0],
      timezone: inviteeTimezone,
      attendee_count: attendeeCount,
    } : undefined
  )

  const createBookingMutation = useCreateBooking()

  // Booking form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingCreateData>({
    resolver: zodResolver(bookingCreateSchema),
    defaultValues: {
      organizer_slug: organizerSlug,
      event_type_slug: eventTypeSlug,
      invitee_name: '',
      invitee_email: '',
      invitee_phone: '',
      invitee_timezone: inviteeTimezone,
      attendee_count: 1,
      start_time: '',
      custom_answers: {},
      attendees_data: [],
    },
  })

  // Generate calendar days for current month
  const calendarDays = React.useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay()) // Start from Sunday
    
    const days = []
    const today = new Date()
    
    for (let i = 0; i < 42; i++) { // 6 weeks
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        isPast: date < today,
        isSelected: selectedDate?.toDateString() === date.toDateString(),
      })
    }
    
    return days
  }, [currentMonth, selectedDate])

  // Get available time slots for selected date
  const availableSlots = React.useMemo(() => {
    return availabilityData?.available_slots || []
  }, [availabilityData])

  const handleDateSelect = (date: Date) => {
    if (date < new Date()) return // Can't select past dates
    setSelectedDate(date)
    setSelectedTimeSlot(null)
  }

  const handleTimeSlotSelect = (slot: any) => {
    setSelectedTimeSlot(slot)
    setValue('start_time', slot.start_time)
    setValue('attendee_count', attendeeCount)
    setValue('invitee_timezone', inviteeTimezone)
  }

  const handleContinueToForm = () => {
    if (!selectedTimeSlot) {
      toast.error('Please select a time slot')
      return
    }
    setCurrentStep('booking-form')
  }

  const handleBackToTimeSelection = () => {
    setCurrentStep('select-time')
  }

  const onSubmit = async (data: BookingCreateData) => {
    try {
      const result = await createBookingMutation.mutateAsync(data)
      setBookingResult(result)
      setCurrentStep('confirmation')
      
      // Redirect if specified
      if (result.redirect_url) {
        setTimeout(() => {
          window.location.href = result.redirect_url
        }, 3000)
      }
    } catch (error: any) {
      if (error?.status === 409) {
        // Time slot no longer available
        toast.error('This time slot is no longer available. Please select another time.')
        setCurrentStep('select-time')
        setSelectedTimeSlot(null)
      } else if (error?.status === 202) {
        // Added to waitlist
        toast.success('Added to waitlist! You\'ll be notified when a spot becomes available.')
        router.push(`/${organizerSlug}`)
      } else {
        toast.error(error?.message || 'Failed to create booking')
      }
    }
  }

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

  const renderCustomQuestion = (question: any) => {
    const fieldName = `custom_answers.${question.id}`
    
    switch (question.question_type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
        return (
          <FormField key={question.id}>
            <Input
              {...register(fieldName)}
              type={question.question_type === 'email' ? 'email' : 
                    question.question_type === 'phone' ? 'tel' :
                    question.question_type === 'url' ? 'url' : 'text'}
              label={question.question_text}
              required={question.is_required}
              error={errors.custom_answers?.[question.id]?.message}
            />
          </FormField>
        )
      
      case 'textarea':
        return (
          <FormField key={question.id}>
            <Textarea
              {...register(fieldName)}
              label={question.question_text}
              required={question.is_required}
              error={errors.custom_answers?.[question.id]?.message}
            />
          </FormField>
        )
      
      case 'select':
        return (
          <FormField key={question.id}>
            <Select
              options={question.options.map((option: string) => ({
                value: option,
                label: option,
              }))}
              value={watch(fieldName) || ''}
              onChange={(value) => setValue(fieldName, value)}
              label={question.question_text}
              placeholder="Select an option"
              error={errors.custom_answers?.[question.id]?.message}
            />
          </FormField>
        )
      
      case 'radio':
        return (
          <FormField key={question.id}>
            <Radio
              options={question.options.map((option: string) => ({
                value: option,
                label: option,
              }))}
              value={watch(fieldName) || ''}
              onChange={(value) => setValue(fieldName, value)}
              label={question.question_text}
              error={errors.custom_answers?.[question.id]?.message}
            />
          </FormField>
        )
      
      case 'checkbox':
        return (
          <FormField key={question.id}>
            <Checkbox
              checked={watch(fieldName) || false}
              onChange={(checked) => setValue(fieldName, checked)}
              label={question.question_text}
            />
          </FormField>
        )
      
      default:
        return null
    }
  }

  // Loading state
  if (eventTypeLoading) {
    return <PageLoading message="Loading booking page..." />
  }

  // Error state
  if (eventTypeError || !eventType) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-error-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Event Not Found
          </h1>
          
          <p className="text-neutral-600 mb-8">
            The event type you're looking for doesn't exist or is not available for booking.
          </p>
          
          <Button onClick={() => router.push('/')}>
            Go to Homepage
          </Button>
        </div>
      </div>
    )
  }

  // Confirmation step
  if (currentStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-success-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Booking Confirmed!
          </h1>
          
          <p className="text-neutral-600 mb-6">
            Your meeting with {eventType.organizer_name} has been successfully scheduled.
          </p>
          
          <Card variant="secondary" className="text-left mb-6">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-neutral-700">Event:</span>
                  <span className="text-sm text-neutral-900">{eventType.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-neutral-700">Date & Time:</span>
                  <span className="text-sm text-neutral-900">
                    {selectedTimeSlot && dateUtils.formatDateTime(selectedTimeSlot.local_start_time)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-neutral-700">Duration:</span>
                  <span className="text-sm text-neutral-900">
                    {DURATION_OPTIONS.find(opt => opt.value === eventType.duration)?.label}
                  </span>
                </div>
                {bookingResult?.meeting_link && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-neutral-700">Meeting Link:</span>
                    <a 
                      href={bookingResult.meeting_link}
                      className="text-sm text-accent-blue hover:text-accent-blue/80"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Meeting
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <p className="text-sm text-neutral-600 mb-6">
            A confirmation email has been sent to your email address with all the meeting details.
          </p>
          
          {bookingResult?.management_url && (
            <Button
              variant="outline"
              onClick={() => window.open(bookingResult.management_url, '_blank')}
              className="mb-4"
            >
              Manage Booking
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="bg-neutral-50 border-b border-primary-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Avatar
              src={eventType.organizer_avatar}
              alt={eventType.organizer_name}
              size="lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {eventType.name}
              </h1>
              <p className="text-neutral-600">
                with {eventType.organizer_name}
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{DURATION_OPTIONS.find(opt => opt.value === eventType.duration)?.label}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {getLocationIcon(eventType.location_type)}
              <span>
                {LOCATION_TYPE_OPTIONS.find(opt => opt.value === eventType.location_type)?.label}
              </span>
            </div>
            
            {eventType.is_group_event && (
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Group event (max {eventType.max_attendees})</span>
              </div>
            )}
          </div>
          
          {eventType.description && (
            <p className="mt-4 text-neutral-700">
              {eventType.description}
            </p>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'select-time' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Select a Date
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium text-neutral-700 min-w-[120px] text-center">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-neutral-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(day.date)}
                      disabled={day.isPast || !day.isCurrentMonth}
                      className={cn(
                        'aspect-square text-sm rounded-lg transition-colors',
                        'hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-accent-blue',
                        {
                          'text-neutral-300': !day.isCurrentMonth,
                          'text-neutral-400 cursor-not-allowed': day.isPast,
                          'text-neutral-900': day.isCurrentMonth && !day.isPast,
                          'bg-accent-blue text-white': day.isSelected,
                          'bg-primary-100 font-semibold': day.isToday && !day.isSelected,
                        }
                      )}
                    >
                      {day.date.getDate()}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Slots */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {selectedDate ? dateUtils.formatDate(selectedDate) : 'Select a time'}
                  </h2>
                  
                  {eventType.is_group_event && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAttendeeCount(Math.max(1, attendeeCount - 1))}
                        disabled={attendeeCount <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium text-neutral-700 min-w-[60px] text-center">
                        {attendeeCount} {attendeeCount === 1 ? 'person' : 'people'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAttendeeCount(Math.min(eventType.max_attendees, attendeeCount + 1))}
                        disabled={attendeeCount >= eventType.max_attendees}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <Globe className="h-4 w-4" />
                  <Select
                    options={TIMEZONE_OPTIONS}
                    value={inviteeTimezone}
                    onChange={setInviteeTimezone}
                    placeholder="Select timezone"
                    className="text-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {!selectedDate ? (
                  <EmptyState
                    icon={Calendar}
                    title="Select a date"
                    description="Choose a date from the calendar to see available time slots"
                  />
                ) : slotsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-accent-blue" />
                    <span className="ml-2 text-sm text-neutral-600">Loading available times...</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <EmptyState
                    icon={Clock}
                    title="No times available"
                    description="There are no available time slots for this date. Please select another date."
                  />
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {availableSlots.map((slot: any) => (
                      <button
                        key={slot.start_time}
                        onClick={() => handleTimeSlotSelect(slot)}
                        className={cn(
                          'w-full text-left px-4 py-3 rounded-lg border transition-colors',
                          'hover:border-accent-blue hover:bg-primary-50',
                          'focus:outline-none focus:ring-2 focus:ring-accent-blue',
                          {
                            'border-accent-blue bg-accent-blue/10': selectedTimeSlot?.start_time === slot.start_time,
                            'border-primary-300': selectedTimeSlot?.start_time !== slot.start_time,
                          }
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-neutral-900">
                            {dateUtils.formatTime(slot.local_start_time)}
                          </span>
                          {slot.available_spots < eventType.max_attendees && (
                            <Badge variant="secondary" size="sm">
                              {slot.available_spots} spots left
                            </Badge>
                          )}
                        </div>
                        {slot.is_waitlist_available && (
                          <p className="text-xs text-neutral-600 mt-1">
                            Waitlist available
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                
                {selectedTimeSlot && (
                  <div className="mt-6 pt-6 border-t border-primary-300">
                    <Button onClick={handleContinueToForm} className="w-full">
                      Continue
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'booking-form' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={handleBackToTimeSelection}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to time selection
              </Button>
              
              <Card variant="secondary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-900">{eventType.name}</h3>
                      <p className="text-sm text-neutral-600">
                        {selectedDate && dateUtils.formatDate(selectedDate)} at{' '}
                        {selectedTimeSlot && dateUtils.formatTime(selectedTimeSlot.local_start_time)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-700">
                        {DURATION_OPTIONS.find(opt => opt.value === eventType.duration)?.label}
                      </p>
                      <p className="text-xs text-neutral-600">{inviteeTimezone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Enter Details
                </h2>
              </CardHeader>
              <CardContent>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <FormGrid>
                    <FormField>
                      <Input
                        {...register('invitee_name')}
                        label="Full Name"
                        required
                        error={errors.invitee_name?.message}
                        icon={<User className="h-4 w-4" />}
                      />
                    </FormField>

                    <FormField>
                      <Input
                        {...register('invitee_email')}
                        type="email"
                        label="Email Address"
                        required
                        error={errors.invitee_email?.message}
                        icon={<Mail className="h-4 w-4" />}
                      />
                    </FormField>

                    {eventType.require_phone && (
                      <FormField>
                        <Input
                          {...register('invitee_phone')}
                          type="tel"
                          label="Phone Number"
                          required
                          error={errors.invitee_phone?.message}
                          icon={<Phone className="h-4 w-4" />}
                        />
                      </FormField>
                    )}

                    {eventType.custom_questions?.map(renderCustomQuestion)}

                    {eventType.is_group_event && attendeeCount > 1 && (
                      <div className="col-span-full">
                        <h3 className="text-sm font-medium text-neutral-900 mb-4">
                          Additional Attendees ({attendeeCount - 1})
                        </h3>
                        {Array.from({ length: attendeeCount - 1 }, (_, index) => (
                          <div key={index} className="grid grid-cols-2 gap-4 mb-4 p-4 bg-primary-50 rounded-lg">
                            <FormField>
                              <Input
                                {...register(`attendees_data.${index}.name`)}
                                label={`Attendee ${index + 2} Name`}
                                required
                                error={errors.attendees_data?.[index]?.name?.message}
                              />
                            </FormField>
                            <FormField>
                              <Input
                                {...register(`attendees_data.${index}.email`)}
                                type="email"
                                label={`Attendee ${index + 2} Email`}
                                required
                                error={errors.attendees_data?.[index]?.email?.message}
                              />
                            </FormField>
                          </div>
                        ))}
                      </div>
                    )}

                    {eventType.location_type === 'in_person' && eventType.location_details && (
                      <div className="col-span-full">
                        <Alert>
                          <MapPin className="h-4 w-4" />
                          <AlertTitle>Meeting Location</AlertTitle>
                          <AlertDescription>
                            {eventType.location_details}
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </FormGrid>

                  <FormActions>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBackToTimeSelection}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="min-w-[120px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Booking...
                        </>
                      ) : (
                        'Schedule Event'
                      )}
                    </Button>
                  </FormActions>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}