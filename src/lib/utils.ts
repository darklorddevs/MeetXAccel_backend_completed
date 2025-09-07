/**
 * General Utility Functions
 * 
 * This file contains commonly used utility functions throughout
 * the application for data manipulation, formatting, and validation.
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, formatDistanceToNow, isValid } from 'date-fns'

// Tailwind CSS class merging utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date and Time Utilities
export const dateUtils = {
  // Format date for display
  formatDate: (date: string | Date, formatString: string = 'MMM dd, yyyy'): string => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date
      return isValid(dateObj) ? format(dateObj, formatString) : 'Invalid date'
    } catch {
      return 'Invalid date'
    }
  },

  // Format time for display
  formatTime: (date: string | Date, formatString: string = 'h:mm a'): string => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date
      return isValid(dateObj) ? format(dateObj, formatString) : 'Invalid time'
    } catch {
      return 'Invalid time'
    }
  },

  // Format datetime for display
  formatDateTime: (date: string | Date, formatString: string = 'MMM dd, yyyy h:mm a'): string => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date
      return isValid(dateObj) ? format(dateObj, formatString) : 'Invalid datetime'
    } catch {
      return 'Invalid datetime'
    }
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date: string | Date): string => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date
      return isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true }) : 'Invalid date'
    } catch {
      return 'Invalid date'
    }
  },

  // Check if date is today
  isToday: (date: string | Date): boolean => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date
      const today = new Date()
      return isValid(dateObj) && 
             dateObj.getDate() === today.getDate() &&
             dateObj.getMonth() === today.getMonth() &&
             dateObj.getFullYear() === today.getFullYear()
    } catch {
      return false
    }
  },

  // Convert duration in minutes to human readable format
  formatDuration: (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (remainingMinutes === 0) {
      return `${hours} hr${hours > 1 ? 's' : ''}`
    }
    
    return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMinutes} min`
  },

  // Get timezone display name
  getTimezoneDisplay: (timezone: string): string => {
    try {
      return new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        timeZoneName: 'long'
      }).formatToParts(new Date()).find(part => part.type === 'timeZoneName')?.value || timezone
    } catch {
      return timezone
    }
  },
}

// String Utilities
export const stringUtils = {
  // Capitalize first letter
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },

  // Convert to title case
  toTitleCase: (str: string): string => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  },

  // Truncate string with ellipsis
  truncate: (str: string, length: number): string => {
    return str.length > length ? `${str.substring(0, length)}...` : str
  },

  // Generate initials from name
  getInitials: (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  },

  // Slugify string
  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  // Extract domain from email
  getDomainFromEmail: (email: string): string => {
    const parts = email.split('@')
    return parts.length > 1 ? parts[1] : ''
  },

  // Mask sensitive data
  maskEmail: (email: string): string => {
    const [username, domain] = email.split('@')
    if (username.length <= 2) return email
    
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1)
    return `${maskedUsername}@${domain}`
  },

  maskPhone: (phone: string): string => {
    if (phone.length <= 4) return phone
    return '*'.repeat(phone.length - 4) + phone.slice(-4)
  },
}

// Number Utilities
export const numberUtils = {
  // Format number with commas
  formatNumber: (num: number): string => {
    return new Intl.NumberFormat().format(num)
  },

  // Format currency
  formatCurrency: (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  },

  // Format percentage
  formatPercentage: (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`
  },

  // Clamp number between min and max
  clamp: (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max)
  },
}

// Array Utilities
export const arrayUtils = {
  // Group array by key
  groupBy: <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key])
      groups[groupKey] = groups[groupKey] || []
      groups[groupKey].push(item)
      return groups
    }, {} as Record<string, T[]>)
  },

  // Sort array by multiple keys
  sortBy: <T>(array: T[], ...keys: (keyof T)[]): T[] => {
    return [...array].sort((a, b) => {
      for (const key of keys) {
        const aVal = a[key]
        const bVal = b[key]
        
        if (aVal < bVal) return -1
        if (aVal > bVal) return 1
      }
      return 0
    })
  },

  // Remove duplicates from array
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)]
  },

  // Chunk array into smaller arrays
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  },
}

// Object Utilities
export const objectUtils = {
  // Deep clone object
  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj))
  },

  // Pick specific keys from object
  pick: <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key]
      }
    })
    return result
  },

  // Omit specific keys from object
  omit: <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj }
    keys.forEach(key => {
      delete result[key]
    })
    return result
  },

  // Check if object is empty
  isEmpty: (obj: Record<string, any>): boolean => {
    return Object.keys(obj).length === 0
  },
}

// Validation Utilities
export const validationUtils = {
  // Email validation
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Phone validation (basic)
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone)
  },

  // URL validation
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  // Password strength check
  getPasswordStrength: (password: string): {
    score: number
    feedback: string[]
  } => {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) score += 1
    else feedback.push('At least 8 characters')

    if (/[a-z]/.test(password)) score += 1
    else feedback.push('At least one lowercase letter')

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push('At least one uppercase letter')

    if (/\d/.test(password)) score += 1
    else feedback.push('At least one number')

    if (/[^a-zA-Z\d]/.test(password)) score += 1
    else feedback.push('At least one special character')

    return { score, feedback }
  },
}

// Local Storage Utilities
export const storageUtils = {
  // Set item in localStorage with error handling
  setItem: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  },

  // Get item from localStorage with error handling
  getItem: <T = any>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return defaultValue || null
    }
  },

  // Remove item from localStorage
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
  },

  // Clear all localStorage
  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
  },
}

// URL Utilities
export const urlUtils = {
  // Build URL with query parameters
  buildUrl: (base: string, params?: Record<string, any>): string => {
    if (!params || objectUtils.isEmpty(params)) {
      return base
    }
    
    const queryString = requestUtils.buildQueryString(params)
    return `${base}${queryString ? `?${queryString}` : ''}`
  },

  // Get query parameter from URL
  getQueryParam: (param: string): string | null => {
    if (typeof window === 'undefined') return null
    
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param)
  },

  // Update URL query parameters without page reload
  updateQueryParams: (params: Record<string, string | null>): void => {
    if (typeof window === 'undefined') return
    
    const url = new URL(window.location.href)
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        url.searchParams.delete(key)
      } else {
        url.searchParams.set(key, value)
      }
    })
    
    window.history.replaceState({}, '', url.toString())
  },
}

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// File utilities
export const fileUtils = {
  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Check if file type is allowed
  isAllowedFileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type)
  },

  // Check if file size is within limit
  isFileSizeValid: (file: File, maxSize: number): boolean => {
    return file.size <= maxSize
  },

  // Generate file preview URL
  getFilePreview: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },
}

// Color utilities
export const colorUtils = {
  // Convert hex to RGB
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  },

  // Add opacity to hex color
  addOpacity: (hex: string, opacity: number): string => {
    const rgb = colorUtils.hexToRgb(hex)
    if (!rgb) return hex
    
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
  },

  // Get contrast color (black or white) for background
  getContrastColor: (hex: string): string => {
    const rgb = colorUtils.hexToRgb(hex)
    if (!rgb) return '#000000'
    
    // Calculate luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
    
    return luminance > 0.5 ? '#000000' : '#ffffff'
  },
}

// Form utilities
export const formUtils = {
  // Transform form data for API
  transformFormData: (data: Record<string, any>): Record<string, any> => {
    const transformed = { ...data }
    
    // Convert empty strings to null for optional fields
    Object.keys(transformed).forEach(key => {
      if (transformed[key] === '') {
        transformed[key] = null
      }
    })
    
    return transformed
  },

  // Extract field errors from API response
  extractFieldErrors: (errors: Record<string, string[]>): Record<string, string> => {
    const fieldErrors: Record<string, string> = {}
    
    Object.entries(errors).forEach(([field, messages]) => {
      fieldErrors[field] = Array.isArray(messages) ? messages[0] : messages
    })
    
    return fieldErrors
  },

  // Generate form field ID
  generateFieldId: (name: string, prefix?: string): string => {
    const id = prefix ? `${prefix}-${name}` : name
    return id.replace(/[^a-zA-Z0-9-_]/g, '-')
  },
}

// Browser utilities
export const browserUtils = {
  // Check if running in browser
  isBrowser: (): boolean => {
    return typeof window !== 'undefined'
  },

  // Copy text to clipboard
  copyToClipboard: async (text: string): Promise<boolean> => {
    if (!browserUtils.isBrowser()) return false
    
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        return true
      } catch {
        return false
      }
    }
  },

  // Get device type
  getDeviceType: (): 'mobile' | 'tablet' | 'desktop' => {
    if (!browserUtils.isBrowser()) return 'desktop'
    
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  },

  // Check if user prefers dark mode
  prefersDarkMode: (): boolean => {
    if (!browserUtils.isBrowser()) return false
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  },
}

// Performance utilities
export const performanceUtils = {
  // Measure function execution time
  measureTime: async <T>(fn: () => Promise<T>, label?: string): Promise<T> => {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    
    if (label && process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`)
    }
    
    return result
  },

  // Create a simple cache
  createCache: <T>(ttl: number = 5 * 60 * 1000) => {
    const cache = new Map<string, { data: T; timestamp: number }>()
    
    return {
      get: (key: string): T | null => {
        const item = cache.get(key)
        if (!item) return null
        
        if (Date.now() - item.timestamp > ttl) {
          cache.delete(key)
          return null
        }
        
        return item.data
      },
      
      set: (key: string, data: T): void => {
        cache.set(key, { data, timestamp: Date.now() })
      },
      
      clear: (): void => {
        cache.clear()
      },
    }
  },
}