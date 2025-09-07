/**
 * Common Type Definitions
 */

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  description?: string
  icon?: React.ComponentType<any>
}

export interface TableColumn<T = any> {
  key: keyof T | string
  label: string
  sortable?: boolean
  width?: string
  render?: (value: any, row: T) => React.ReactNode
}

export interface FilterOption {
  key: string
  label: string
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'boolean'
  options?: SelectOption[]
  placeholder?: string
}

export interface SortOption {
  key: string
  label: string
  direction: 'asc' | 'desc'
}

export interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface SearchFilters {
  search?: string
  filters?: Record<string, any>
  sort?: string
  page?: number
  pageSize?: number
}

export interface TimeZoneInfo {
  value: string
  label: string
  offset: string
  abbreviation: string
}

export interface DateRange {
  start: Date
  end: Date
}

export interface TimeRange {
  start: string // HH:MM format
  end: string   // HH:MM format
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isDisabled: boolean
  hasEvents: boolean
  eventCount?: number
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  type: 'booking' | 'blocked' | 'available' | 'override'
  status?: string
  color?: string
  attendees?: number
  maxAttendees?: number
}

export interface FormFieldError {
  message: string
  type: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, FormFieldError>
}

export interface UploadFile {
  file: File
  preview?: string
  progress?: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface MenuItem {
  id: string
  label: string
  href?: string
  icon?: React.ComponentType<any>
  badge?: string | number
  children?: MenuItem[]
  onClick?: () => void
  disabled?: boolean
  hidden?: boolean
}

export interface NotificationItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
}

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
  badge?: string | number
}

export interface StepItem {
  id: string
  title: string
  description?: string
  status: 'pending' | 'current' | 'completed' | 'error'
  optional?: boolean
}

// Utility types
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}