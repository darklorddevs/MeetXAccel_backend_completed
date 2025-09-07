/**
 * Monkai Theme Color Definitions
 * 
 * This file contains the complete color palette for the Monkai-themed
 * Calendly clone application. Colors are designed for dark-first UI
 * with high contrast and professional appearance.
 */

export const monkaiColors = {
  // Primary brand colors - deep, sophisticated tones
  primary: {
    50: '#f0f0f5',   // Lightest - for subtle backgrounds
    100: '#e1e1ea',  // Very light - for hover states
    200: '#c3c3d5',  // Light - for disabled states
    300: '#a5a5c0',  // Medium light - for placeholders
    400: '#8787ab',  // Medium - for secondary text
    500: '#696996',  // Base - primary brand color
    600: '#545481',  // Medium dark - for hover states
    700: '#3f3f6c',  // Dark - for active states
    800: '#2a2a57',  // Very dark - for backgrounds
    900: '#151542',  // Darkest - for main backgrounds
    950: '#0a0a21'   // Ultra dark - for deep backgrounds
  },

  // Accent colors - vibrant, attention-grabbing
  accent: {
    pink: '#E94560',     // Primary accent - CTAs, important actions
    green: '#00B894',    // Success, positive actions
    blue: '#007BFF',     // Info, links, secondary actions
    orange: '#FF6B35',   // Warning, attention needed
    purple: '#6C5CE7',   // Secondary accent, premium features
    yellow: '#FDCB6E',   // Highlights, notifications
    cyan: '#00CEC9',     // Data visualization, charts
    indigo: '#6C5CE7'    // Alternative accent
  },

  // Neutral colors - for text, borders, backgrounds
  neutral: {
    50: '#f8f9fa',   // Lightest neutral
    100: '#f1f3f4',  // Very light gray
    200: '#e3e5e8',  // Light gray
    300: '#d1d5db',  // Medium light gray
    400: '#9ca3af',  // Medium gray
    500: '#6b7280',  // Base gray
    600: '#4b5563',  // Medium dark gray
    700: '#374151',  // Dark gray
    800: '#1f2937',  // Very dark gray
    900: '#111827',  // Darkest gray
    950: '#030712'   // Ultra dark
  },

  // Semantic colors - contextual meanings
  semantic: {
    success: {
      light: '#ecfdf5',
      base: '#00B894',
      dark: '#047857',
      text: '#065f46'
    },
    error: {
      light: '#fef2f2',
      base: '#E94560',
      dark: '#b91c1c',
      text: '#991b1b'
    },
    warning: {
      light: '#fffbeb',
      base: '#FF6B35',
      dark: '#b45309',
      text: '#92400e'
    },
    info: {
      light: '#eff6ff',
      base: '#007BFF',
      dark: '#1d4ed8',
      text: '#1e40af'
    }
  },

  // Status colors - for booking states, integration health, etc.
  status: {
    confirmed: '#00B894',
    pending: '#FF6B35',
    cancelled: '#E94560',
    completed: '#6C5CE7',
    failed: '#dc2626',
    active: '#00B894',
    inactive: '#6b7280',
    healthy: '#00B894',
    degraded: '#FF6B35',
    unhealthy: '#E94560'
  }
} as const

// Export individual color groups for easier imports
export const { primary, accent, neutral, semantic, status } = monkaiColors

// Utility function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`
}

// Common color combinations for consistent usage
export const colorCombinations = {
  // Card backgrounds
  cardPrimary: {
    background: primary[800],
    border: primary[700],
    text: neutral[100]
  },
  cardSecondary: {
    background: primary[900],
    border: primary[800],
    text: neutral[200]
  },
  
  // Button variants
  buttonPrimary: {
    background: accent.pink,
    hover: '#d63851',
    text: neutral[50],
    border: accent.pink
  },
  buttonSecondary: {
    background: primary[700],
    hover: primary[600],
    text: neutral[100],
    border: primary[600]
  },
  buttonSuccess: {
    background: accent.green,
    hover: '#00a085',
    text: neutral[50],
    border: accent.green
  },
  
  // Input styles
  input: {
    background: primary[800],
    border: primary[600],
    borderFocus: accent.pink,
    text: neutral[100],
    placeholder: neutral[400]
  },
  
  // Navigation
  navigation: {
    background: primary[900],
    active: accent.pink,
    hover: primary[700],
    text: neutral[200],
    textActive: neutral[50]
  }
} as const