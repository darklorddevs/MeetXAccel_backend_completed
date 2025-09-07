/**
 * Validation Schemas using Zod
 * 
 * This file contains Zod schemas for form validation that mirror
 * the Django backend validation rules. This ensures consistent
 * validation between frontend and backend.
 */

import { z } from 'zod'

// Common validation patterns
const emailSchema = z.string().email('Please enter a valid email address')
const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number').optional()
const urlSchema = z.string().url('Please enter a valid URL').optional()
const slugSchema = z.string().regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens allowed')

// Password validation (matching backend requirements)
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')

// Authentication Schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember_me: z.boolean().optional(),
})

export const registerSchema = z.object({
  email: emailSchema,
  first_name: z.string().min(1, 'First name is required').max(30, 'First name too long'),
  last_name: z.string().min(1, 'Last name is required').max(30, 'Last name too long'),
  password: passwordSchema,
  password_confirm: z.string(),
  terms_accepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine(data => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ['password_confirm'],
})

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
})

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  new_password: passwordSchema,
  new_password_confirm: z.string(),
}).refine(data => data.new_password === data.new_password_confirm, {
  message: "Passwords don't match",
  path: ['new_password_confirm'],
})

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Current password is required'),
  new_password: passwordSchema,
  new_password_confirm: z.string(),
}).refine(data => data.new_password === data.new_password_confirm, {
  message: "Passwords don't match",
  path: ['new_password_confirm'],
})

export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
})

// Profile Schemas
export const profileUpdateSchema = z.object({
  display_name: z.string().max(100, 'Display name too long').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
  phone: phoneSchema,
  website: urlSchema,
  company: z.string().max(100, 'Company name too long').optional(),
  job_title: z.string().max(100, 'Job title too long').optional(),
  timezone_name: z.string().min(1, 'Timezone is required'),
  language: z.string().min(1, 'Language is required'),
  date_format: z.string().min(1, 'Date format is required'),
  time_format: z.string().min(1, 'Time format is required'),
  brand_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
  public_profile: z.boolean(),
  show_phone: z.boolean(),
  show_email: z.boolean(),
  reasonable_hours_start: z.number().min(0).max(23),
  reasonable_hours_end: z.number().min(1).max(24),
})

// Event Type Schemas
export const eventTypeCreateSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(200, 'Event name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  duration: z.enum(['15', '30', '45', '60', '90', '120', '180', '240']).transform(Number),
  max_attendees: z.number().min(1, 'Must allow at least 1 attendee').max(100, 'Too many attendees'),
  enable_waitlist: z.boolean(),
  is_active: z.boolean(),
  is_private: z.boolean(),
  min_scheduling_notice: z.number().min(0, 'Cannot be negative'),
  max_scheduling_horizon: z.number().min(60, 'Must be at least 1 hour'),
  buffer_time_before: z.number().min(0).max(120),
  buffer_time_after: z.number().min(0).max(120),
  max_bookings_per_day: z.number().min(1).max(50).optional(),
  slot_interval_minutes: z.number().min(0).max(60),
  location_type: z.enum(['video_call', 'phone_call', 'in_person', 'custom']),
  location_details: z.string().optional(),
  redirect_url_after_booking: urlSchema,
})

// Booking Schemas
export const bookingCreateSchema = z.object({
  organizer_slug: z.string().min(1, 'Organizer slug is required'),
  event_type_slug: z.string().min(1, 'Event type slug is required'),
  invitee_name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  invitee_email: emailSchema,
  invitee_phone: phoneSchema,
  invitee_timezone: z.string().min(1, 'Timezone is required'),
  attendee_count: z.number().min(1, 'Must have at least 1 attendee'),
  start_time: z.string().datetime('Invalid datetime format'),
  custom_answers: z.record(z.any()).optional(),
  attendees_data: z.array(z.object({
    name: z.string().min(1, 'Attendee name is required'),
    email: emailSchema,
    phone: phoneSchema,
    custom_answers: z.record(z.any()).optional(),
  })).optional(),
})

// Availability Schemas
export const availabilityRuleSchema = z.object({
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  event_types: z.array(z.string()).optional(),
  is_active: z.boolean(),
})

export const dateOverrideSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  is_available: z.boolean(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional(),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional(),
  event_types: z.array(z.string()).optional(),
  reason: z.string().max(200, 'Reason too long').optional(),
  is_active: z.boolean(),
}).refine(data => {
  if (data.is_available && (!data.start_time || !data.end_time)) {
    return false
  }
  return true
}, {
  message: 'Start time and end time are required when available',
  path: ['start_time'],
})

export const blockedTimeSchema = z.object({
  start_datetime: z.string().datetime('Invalid datetime format'),
  end_datetime: z.string().datetime('Invalid datetime format'),
  reason: z.string().max(200, 'Reason too long').optional(),
  is_active: z.boolean(),
}).refine(data => new Date(data.start_datetime) < new Date(data.end_datetime), {
  message: 'End time must be after start time',
  path: ['end_datetime'],
})

// Integration Schemas
export const webhookIntegrationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  webhook_url: z.string().url('Please enter a valid webhook URL'),
  events: z.array(z.string()).min(1, 'Select at least one event'),
  secret_key: z.string().optional(),
  headers: z.record(z.string()).optional(),
  is_active: z.boolean(),
  retry_failed: z.boolean(),
  max_retries: z.number().min(0).max(10),
})

// Workflow Schemas
export const workflowCreateSchema = z.object({
  name: z.string().min(1, 'Workflow name is required').max(200, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  trigger: z.enum(['booking_created', 'booking_cancelled', 'booking_completed', 'before_meeting', 'after_meeting']),
  event_types: z.array(z.string()).optional(),
  delay_minutes: z.number().min(0, 'Delay cannot be negative'),
  is_active: z.boolean(),
})

export const workflowActionSchema = z.object({
  name: z.string().min(1, 'Action name is required').max(200, 'Name too long'),
  action_type: z.enum(['send_email', 'send_sms', 'webhook', 'update_booking']),
  order: z.number().min(0, 'Order cannot be negative'),
  recipient: z.enum(['organizer', 'invitee', 'both', 'custom']),
  custom_email: emailSchema.optional(),
  subject: z.string().max(200, 'Subject too long').optional(),
  message: z.string().optional(),
  webhook_url: urlSchema,
  webhook_data: z.record(z.any()).optional(),
  conditions: z.array(z.any()).optional(),
  update_booking_fields: z.record(z.any()).optional(),
  is_active: z.boolean(),
}).refine(data => {
  // Custom email required when recipient is 'custom'
  if (data.recipient === 'custom' && !data.custom_email) {
    return false
  }
  return true
}, {
  message: 'Custom email is required when recipient is custom',
  path: ['custom_email'],
})

// Notification Schemas
export const notificationTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(200, 'Name too long'),
  template_type: z.enum(['booking_confirmation', 'booking_reminder', 'booking_cancellation', 'booking_rescheduled', 'follow_up', 'custom']),
  notification_type: z.enum(['email', 'sms']),
  subject: z.string().max(200, 'Subject too long').optional(),
  message: z.string().min(1, 'Message is required'),
  is_active: z.boolean(),
  is_default: z.boolean(),
})

export const notificationPreferenceSchema = z.object({
  booking_confirmations_email: z.boolean(),
  booking_reminders_email: z.boolean(),
  booking_cancellations_email: z.boolean(),
  daily_agenda_email: z.boolean(),
  booking_confirmations_sms: z.boolean(),
  booking_reminders_sms: z.boolean(),
  booking_cancellations_sms: z.boolean(),
  reminder_minutes_before: z.number().min(5, 'Must be at least 5 minutes').max(1440, 'Cannot exceed 24 hours'),
  daily_agenda_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
})

// Contact Schemas
export const contactCreateSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100, 'First name too long'),
  last_name: z.string().max(100, 'Last name too long').optional(),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().max(200, 'Company name too long').optional(),
  job_title: z.string().max(200, 'Job title too long').optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
  tags: z.array(z.string()).optional(),
  is_active: z.boolean(),
})

export const contactGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
  contact_ids: z.array(z.string()).optional(),
})

// MFA Schemas
export const mfaSetupSchema = z.object({
  device_type: z.enum(['totp', 'sms']),
  device_name: z.string().min(1, 'Device name is required').max(100, 'Name too long'),
  phone_number: z.string().optional(),
}).refine(data => {
  if (data.device_type === 'sms' && !data.phone_number) {
    return false
  }
  return true
}, {
  message: 'Phone number is required for SMS devices',
  path: ['phone_number'],
})

export const mfaVerificationSchema = z.object({
  otp_code: z.string().length(6, 'OTP code must be 6 digits').regex(/^\d+$/, 'OTP code must contain only numbers'),
  device_id: z.string().optional(),
})

// Invitation Schemas
export const invitationCreateSchema = z.object({
  invited_email: emailSchema,
  role: z.string().min(1, 'Role is required'),
  message: z.string().max(500, 'Message too long').optional(),
})

export const invitationResponseSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  action: z.enum(['accept', 'decline']),
  first_name: z.string().min(1, 'First name is required').max(30, 'First name too long').optional(),
  last_name: z.string().min(1, 'Last name is required').max(30, 'Last name too long').optional(),
  password: passwordSchema.optional(),
  password_confirm: z.string().optional(),
}).refine(data => {
  if (data.action === 'accept' && data.password && data.password !== data.password_confirm) {
    return false
  }
  return true
}, {
  message: "Passwords don't match",
  path: ['password_confirm'],
})

// Role management schemas
export const roleCreateSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name too long'),
  role_type: z.enum(['admin', 'organizer', 'team_member', 'billing_manager', 'viewer']),
  description: z.string().max(500, 'Description too long').optional(),
  parent: z.string().optional(),
  role_permissions: z.array(z.string()),
})

export const userUpdateSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(30, 'First name too long').optional(),
  last_name: z.string().min(1, 'Last name is required').max(30, 'Last name too long').optional(),
  account_status: z.enum(['active', 'inactive', 'suspended', 'pending_verification', 'password_expired', 'password_expired_grace_period']).optional(),
  is_active: z.boolean().optional(),
})

// Custom Question Schema
export const customQuestionSchema = z.object({
  question_text: z.string().min(1, 'Question text is required').max(500, 'Question too long'),
  question_type: z.enum(['text', 'textarea', 'select', 'multiselect', 'checkbox', 'radio', 'email', 'phone', 'number', 'date', 'time', 'url']),
  is_required: z.boolean(),
  order: z.number().min(0, 'Order cannot be negative'),
  options: z.array(z.string()).optional(),
  validation_rules: z.record(z.any()).optional(),
}).refine(data => {
  // Options required for select/radio questions
  if (['select', 'multiselect', 'radio'].includes(data.question_type) && (!data.options || data.options.length < 2)) {
    return false
  }
  return true
}, {
  message: 'At least 2 options are required for select/radio questions',
  path: ['options'],
})

// Search and Filter Schemas
export const searchFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).optional(),
  page_size: z.number().min(1).max(100).optional(),
  ordering: z.string().optional(),
})

export const dateRangeSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
}).refine(data => new Date(data.start_date) <= new Date(data.end_date), {
  message: 'End date must be after start date',
  path: ['end_date'],
})

// File Upload Schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File, 'Please select a file'),
}).refine(data => {
  const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880', 10) // 5MB default
  return data.file.size <= maxSize
}, {
  message: 'File size too large',
  path: ['file'],
}).refine(data => {
  const allowedTypes = (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || 'image/jpeg,image/png').split(',')
  return allowedTypes.includes(data.file.type)
}, {
  message: 'File type not allowed',
  path: ['file'],
})

// Export type inference helpers
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetConfirmData = z.infer<typeof passwordResetConfirmSchema>
export type ChangePasswordData = z.infer<typeof changePasswordSchema>
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>
export type EventTypeCreateData = z.infer<typeof eventTypeCreateSchema>
export type BookingCreateData = z.infer<typeof bookingCreateSchema>
export type AvailabilityRuleData = z.infer<typeof availabilityRuleSchema>
export type DateOverrideData = z.infer<typeof dateOverrideSchema>
export type BlockedTimeData = z.infer<typeof blockedTimeSchema>
export type WebhookIntegrationData = z.infer<typeof webhookIntegrationSchema>
export type WorkflowCreateData = z.infer<typeof workflowCreateSchema>
export type WorkflowActionData = z.infer<typeof workflowActionSchema>
export type NotificationTemplateData = z.infer<typeof notificationTemplateSchema>
export type NotificationPreferenceData = z.infer<typeof notificationPreferenceSchema>
export type ContactCreateData = z.infer<typeof contactCreateSchema>
export type ContactGroupData = z.infer<typeof contactGroupSchema>
export type MfaSetupData = z.infer<typeof mfaSetupSchema>
export type MfaVerificationData = z.infer<typeof mfaVerificationSchema>
export type InvitationCreateData = z.infer<typeof invitationCreateSchema>
export type InvitationResponseData = z.infer<typeof invitationResponseSchema>
export type RoleCreateData = z.infer<typeof roleCreateSchema>
export type UserUpdateData = z.infer<typeof userUpdateSchema>
export type CustomQuestionData = z.infer<typeof customQuestionSchema>
export type SearchFiltersData = z.infer<typeof searchFiltersSchema>
export type DateRangeData = z.infer<typeof dateRangeSchema>
export type FileUploadData = z.infer<typeof fileUploadSchema>