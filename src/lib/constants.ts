/**
 * Application Constants
 * 
 * This file contains all constant values used throughout the application,
 * including configuration, options, and static data.
 */

// Application Configuration
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Calendly Clone',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  description: 'Professional scheduling platform for modern teams',
  url: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  supportEmail: 'support@calendly-clone.com',
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880', 10), // 5MB
  allowedFileTypes: (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(','),
} as const

// Feature Flags
export const FEATURES = {
  sso: process.env.NEXT_PUBLIC_ENABLE_SSO === 'true',
  mfa: process.env.NEXT_PUBLIC_ENABLE_MFA === 'true',
  analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  workflows: process.env.NEXT_PUBLIC_ENABLE_WORKFLOWS === 'true',
  debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  mockApi: process.env.NEXT_PUBLIC_MOCK_API === 'true',
} as const

// Route Paths
export const ROUTES = {
  // Public routes
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  invitation: '/invitation',

  // Dashboard routes
  dashboard: '/dashboard',
  profile: '/profile',
  settings: '/settings',

  // Event management
  eventTypes: '/event-types',
  createEventType: '/event-types/create',
  editEventType: (id: string) => `/event-types/${id}/edit`,

  // Booking management
  bookings: '/bookings',
  booking: (id: string) => `/bookings/${id}`,
  calendar: '/calendar',

  // Availability
  availability: '/availability',
  schedule: '/schedule',

  // Integrations
  integrations: '/integrations',
  calendarIntegrations: '/integrations/calendar',
  videoIntegrations: '/integrations/video',
  webhooks: '/integrations/webhooks',

  // Workflows
  workflows: '/workflows',
  createWorkflow: '/workflows/create',
  editWorkflow: (id: string) => `/workflows/${id}/edit`,

  // Notifications
  notifications: '/notifications',
  notificationTemplates: '/notifications/templates',
  notificationSettings: '/notifications/settings',

  // Contacts
  contacts: '/contacts',
  contactGroups: '/contacts/groups',

  // Analytics
  analytics: '/analytics',
  reports: '/reports',

  // Admin
  admin: '/admin',
  users: '/admin/users',
  userDetail: (id: string) => `/admin/users/${id}`,
  createUser: '/admin/users/create',
  roles: '/admin/roles',
  permissions: '/admin/permissions',
  systemSettings: '/admin/settings',

  // Security
  securitySettings: '/settings/security',
  mfaSettings: '/settings/security/mfa',
  sessions: '/settings/security/sessions',
  auditLogs: '/settings/security/audit-logs',

  // Invitations
  invitations: '/invitations',
  invitationResponse: '/invitation',

  // Public booking pages
  publicOrganizer: (slug: string) => `/${slug}`,
  publicEventType: (organizerSlug: string, eventSlug: string) => `/${organizerSlug}/${eventSlug}`,
  bookingManagement: (token: string) => `/booking/${token}/manage`,
} as const

// Duration Options (in minutes)
export const DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
] as const

// Location Type Options
export const LOCATION_TYPE_OPTIONS = [
  { value: 'video_call', label: 'Video Call', icon: 'Video' },
  { value: 'phone_call', label: 'Phone Call', icon: 'Phone' },
  { value: 'in_person', label: 'In Person', icon: 'MapPin' },
  { value: 'custom', label: 'Custom', icon: 'Settings' },
] as const

// Timezone Options (common timezones)
export const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: '+00:00' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)', offset: '-05:00' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)', offset: '-06:00' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)', offset: '-07:00' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)', offset: '-08:00' },
  { value: 'Europe/London', label: 'London (GMT/BST)', offset: '+00:00' },
  { value: 'Europe/Paris', label: 'Central European Time', offset: '+01:00' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: '+01:00' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time', offset: '+09:00' },
  { value: 'Asia/Shanghai', label: 'China Standard Time', offset: '+08:00' },
  { value: 'Asia/Kolkata', label: 'India Standard Time', offset: '+05:30' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time', offset: '+10:00' },
] as const

// Days of Week
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Monday', short: 'Mon' },
  { value: 1, label: 'Tuesday', short: 'Tue' },
  { value: 2, label: 'Wednesday', short: 'Wed' },
  { value: 3, label: 'Thursday', short: 'Thu' },
  { value: 4, label: 'Friday', short: 'Fri' },
  { value: 5, label: 'Saturday', short: 'Sat' },
  { value: 6, label: 'Sunday', short: 'Sun' },
] as const

// Booking Status Options
export const BOOKING_STATUS_OPTIONS = [
  { value: 'confirmed', label: 'Confirmed', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
  { value: 'rescheduled', label: 'Rescheduled', color: 'warning' },
  { value: 'completed', label: 'Completed', color: 'info' },
  { value: 'no_show', label: 'No Show', color: 'error' },
] as const

// Account Status Options
export const ACCOUNT_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'neutral' },
  { value: 'suspended', label: 'Suspended', color: 'error' },
  { value: 'pending_verification', label: 'Pending Verification', color: 'warning' },
  { value: 'password_expired', label: 'Password Expired', color: 'error' },
  { value: 'password_expired_grace_period', label: 'Password Expired (Grace)', color: 'warning' },
] as const

// Role Type Options
export const ROLE_TYPE_OPTIONS = [
  { value: 'admin', label: 'Administrator', description: 'Full system access' },
  { value: 'organizer', label: 'Organizer', description: 'Can create and manage events' },
  { value: 'team_member', label: 'Team Member', description: 'Limited access to team resources' },
  { value: 'billing_manager', label: 'Billing Manager', description: 'Can manage billing and subscriptions' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
] as const

// Integration Provider Options
export const CALENDAR_PROVIDERS = [
  { value: 'google', label: 'Google Calendar', icon: 'Calendar' },
  { value: 'outlook', label: 'Microsoft Outlook', icon: 'Calendar' },
  { value: 'apple', label: 'Apple Calendar', icon: 'Calendar' },
] as const

export const VIDEO_PROVIDERS = [
  { value: 'zoom', label: 'Zoom', icon: 'Video' },
  { value: 'google_meet', label: 'Google Meet', icon: 'Video' },
  { value: 'microsoft_teams', label: 'Microsoft Teams', icon: 'Video' },
  { value: 'webex', label: 'Cisco Webex', icon: 'Video' },
] as const

// Workflow Trigger Options
export const WORKFLOW_TRIGGERS = [
  { value: 'booking_created', label: 'Booking Created', description: 'When a new booking is made' },
  { value: 'booking_cancelled', label: 'Booking Cancelled', description: 'When a booking is cancelled' },
  { value: 'booking_completed', label: 'Booking Completed', description: 'When a booking is marked as completed' },
  { value: 'before_meeting', label: 'Before Meeting', description: 'Before a meeting starts' },
  { value: 'after_meeting', label: 'After Meeting', description: 'After a meeting ends' },
] as const

// Workflow Action Types
export const WORKFLOW_ACTION_TYPES = [
  { value: 'send_email', label: 'Send Email', icon: 'Mail', description: 'Send an email notification' },
  { value: 'send_sms', label: 'Send SMS', icon: 'MessageSquare', description: 'Send an SMS notification' },
  { value: 'webhook', label: 'Trigger Webhook', icon: 'Webhook', description: 'Call an external webhook' },
  { value: 'update_booking', label: 'Update Booking', icon: 'Edit', description: 'Update booking details' },
] as const

// Notification Types
export const NOTIFICATION_TYPES = [
  { value: 'email', label: 'Email', icon: 'Mail' },
  { value: 'sms', label: 'SMS', icon: 'MessageSquare' },
] as const

// Template Types
export const TEMPLATE_TYPES = [
  { value: 'booking_confirmation', label: 'Booking Confirmation' },
  { value: 'booking_reminder', label: 'Booking Reminder' },
  { value: 'booking_cancellation', label: 'Booking Cancellation' },
  { value: 'booking_rescheduled', label: 'Booking Rescheduled' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'custom', label: 'Custom' },
] as const

// Question Types for Custom Questions
export const QUESTION_TYPES = [
  { value: 'text', label: 'Text Input', icon: 'Type' },
  { value: 'textarea', label: 'Long Text', icon: 'AlignLeft' },
  { value: 'select', label: 'Single Select', icon: 'ChevronDown' },
  { value: 'multiselect', label: 'Multiple Select', icon: 'CheckSquare' },
  { value: 'checkbox', label: 'Checkbox', icon: 'Square' },
  { value: 'radio', label: 'Radio Buttons', icon: 'Circle' },
  { value: 'email', label: 'Email', icon: 'Mail' },
  { value: 'phone', label: 'Phone Number', icon: 'Phone' },
  { value: 'number', label: 'Number', icon: 'Hash' },
  { value: 'date', label: 'Date', icon: 'Calendar' },
  { value: 'time', label: 'Time', icon: 'Clock' },
  { value: 'url', label: 'URL', icon: 'Link' },
] as const

// Pagination Constants
export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  maxPageSize: 100,
} as const

// Animation Durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
} as const

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  authToken: 'auth_token',
  userPreferences: 'user_preferences',
  themeMode: 'theme_mode',
  sidebarState: 'sidebar_state',
  recentSearches: 'recent_searches',
  draftForms: 'draft_forms',
} as const

// API Rate Limits
export const RATE_LIMITS = {
  api: parseInt(process.env.NEXT_PUBLIC_API_RATE_LIMIT || '1000', 10),
  booking: parseInt(process.env.NEXT_PUBLIC_BOOKING_RATE_LIMIT || '10', 10),
  search: 5, // requests per second
  upload: 3, // concurrent uploads
} as const

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection and try again.',
  unauthorized: 'You are not authorized to perform this action.',
  forbidden: 'You do not have permission to access this resource.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  rateLimit: 'Too many requests. Please try again later.',
  serverError: 'An internal server error occurred. Please try again later.',
  unknown: 'An unexpected error occurred. Please try again.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  login: 'Successfully logged in!',
  logout: 'Successfully logged out!',
  register: 'Account created successfully! Please check your email to verify your account.',
  emailVerified: 'Email verified successfully!',
  passwordChanged: 'Password changed successfully!',
  passwordReset: 'Password reset successfully!',
  profileUpdated: 'Profile updated successfully!',
  eventTypeCreated: 'Event type created successfully!',
  eventTypeUpdated: 'Event type updated successfully!',
  eventTypeDeleted: 'Event type deleted successfully!',
  bookingCreated: 'Booking created successfully!',
  bookingCancelled: 'Booking cancelled successfully!',
  bookingRescheduled: 'Booking rescheduled successfully!',
  integrationConnected: 'Integration connected successfully!',
  integrationDisconnected: 'Integration disconnected successfully!',
  workflowCreated: 'Workflow created successfully!',
  workflowUpdated: 'Workflow updated successfully!',
  notificationSent: 'Notification sent successfully!',
  contactCreated: 'Contact created successfully!',
  contactUpdated: 'Contact updated successfully!',
  settingsSaved: 'Settings saved successfully!',
} as const

// Loading Messages
export const LOADING_MESSAGES = {
  authenticating: 'Authenticating...',
  loading: 'Loading...',
  saving: 'Saving...',
  creating: 'Creating...',
  updating: 'Updating...',
  deleting: 'Deleting...',
  uploading: 'Uploading...',
  processing: 'Processing...',
  connecting: 'Connecting...',
  syncing: 'Syncing...',
  sending: 'Sending...',
  calculating: 'Calculating availability...',
  validating: 'Validating...',
} as const

// Time Format Options
export const TIME_FORMAT_OPTIONS = [
  { value: '12h', label: '12-hour (2:30 PM)' },
  { value: '24h', label: '24-hour (14:30)' },
] as const

// Date Format Options
export const DATE_FORMAT_OPTIONS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (UK)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
  { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY (Jan 15, 2024)' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY (15 Jan 2024)' },
] as const

// Language Options
export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'it', label: 'Italiano', flag: '🇮🇹' },
  { value: 'pt', label: 'Português', flag: '🇵🇹' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
] as const

// Buffer Time Options (in minutes)
export const BUFFER_TIME_OPTIONS = [
  { value: 0, label: 'No buffer' },
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
] as const

// Slot Interval Options (in minutes)
export const SLOT_INTERVAL_OPTIONS = [
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
] as const

// Reminder Time Options (in minutes)
export const REMINDER_TIME_OPTIONS = [
  { value: 5, label: '5 minutes before' },
  { value: 10, label: '10 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 120, label: '2 hours before' },
  { value: 1440, label: '1 day before' },
  { value: 2880, label: '2 days before' },
] as const

// Webhook Events
export const WEBHOOK_EVENTS = [
  { value: 'booking_created', label: 'Booking Created' },
  { value: 'booking_cancelled', label: 'Booking Cancelled' },
  { value: 'booking_rescheduled', label: 'Booking Rescheduled' },
  { value: 'booking_completed', label: 'Booking Completed' },
] as const

// Table Page Size Options
export const TABLE_PAGE_SIZES = [
  { value: 10, label: '10 per page' },
  { value: 20, label: '20 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page' },
] as const

// Chart Colors (for analytics)
export const CHART_COLORS = [
  '#E94560', // accent.pink
  '#00B894', // accent.green
  '#007BFF', // accent.blue
  '#FF6B35', // accent.orange
  '#6C5CE7', // accent.purple
  '#FDCB6E', // accent.yellow
  '#00CEC9', // accent.cyan
] as const

// Status Colors Mapping
export const STATUS_COLORS = {
  confirmed: 'success',
  pending: 'warning',
  cancelled: 'error',
  completed: 'info',
  failed: 'error',
  active: 'success',
  inactive: 'neutral',
  healthy: 'success',
  degraded: 'warning',
  unhealthy: 'error',
} as const

// File Type Icons
export const FILE_TYPE_ICONS = {
  'image/jpeg': 'Image',
  'image/png': 'Image',
  'image/gif': 'Image',
  'image/webp': 'Image',
  'application/pdf': 'FileText',
  'text/csv': 'FileSpreadsheet',
  'application/json': 'FileCode',
  default: 'File',
} as const

// Default Values
export const DEFAULTS = {
  timezone: 'UTC',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  brandColor: '#E94560',
  eventDuration: 30,
  maxAttendees: 1,
  bufferTime: 0,
  slotInterval: 15,
  reminderTime: 60,
  pageSize: 20,
  reasonableHoursStart: 7,
  reasonableHoursEnd: 22,
} as const