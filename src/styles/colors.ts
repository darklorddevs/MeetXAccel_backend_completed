/**
 * Subtle Slate Theme Color Definitions
 * 
 * Professional, enterprise-grade light theme with sophisticated grays,
 * clean whites, and vibrant but refined accent colors.
 */

export const subtleSlateColors = {
  // Primary colors - light, sophisticated grays for backgrounds
  primary: {
    50: '#F8FAFC',   // Main background - very light blue-gray
    100: '#F1F5F9',  // Secondary background
    200: '#E2E8F0',  // Subtle background variations
    300: '#CBD5E1',  // Light borders, dividers
    400: '#94A3B8',  // Medium elements
    500: '#64748B',  // Base gray
    600: '#475569',  // Medium dark
    700: '#334155',  // Dark elements
    800: '#1E293B',  // Very dark text
    900: '#0F172A',  // Darkest text
    950: '#020617'   // Ultra dark (rarely used)
  },

  // Accent colors - vibrant but professional
  accent: {
    blue: '#3B82F6',     // Primary accent - professional blue
    indigo: '#6366F1',   // Secondary accent - sophisticated indigo
    emerald: '#10B981',  // Success/positive actions
    orange: '#F59E0B',   // Warning/attention
    red: '#EF4444',      // Error/danger
    purple: '#8B5CF6',   // Premium features
    teal: '#14B8A6',     // Alternative accent
    rose: '#F43F5E'      // Highlights, special actions
  },

  // Neutral colors - for text, borders, subtle elements
  neutral: {
    50: '#FFFFFF',   // Pure white for cards
    100: '#FEFEFE',  // Almost white
    200: '#FAFAFA',  // Very light gray
    300: '#F4F4F5',  // Light gray backgrounds
    400: '#E4E4E7',  // Light borders
    500: '#A1A1AA',  // Medium gray
    600: '#71717A',  // Medium dark gray
    700: '#52525B',  // Dark gray
    800: '#27272A',  // Very dark gray
    900: '#18181B',  // Main dark text
    950: '#09090B'   // Darkest text
  },

  // Semantic colors - contextual meanings for light theme
  semantic: {
    success: {
      light: '#F0FDF4',  // Light green background
      base: '#10B981',   // Success green
      dark: '#059669',   // Darker success
      text: '#065F46'    // Success text
    },
    error: {
      light: '#FEF2F2',  // Light red background
      base: '#EF4444',   // Error red
      dark: '#DC2626',   // Darker error
      text: '#991B1B'    // Error text
    },
    warning: {
      light: '#FFFBEB',  // Light amber background
      base: '#F59E0B',   // Warning amber
      dark: '#D97706',   // Darker warning
      text: '#92400E'    // Warning text
    },
    info: {
      light: '#EFF6FF',  // Light blue background
      base: '#3B82F6',   // Info blue
      dark: '#2563EB',   // Darker info
      text: '#1D4ED8'    // Info text
    }
  },

  // Status colors - for booking states, integration health
  status: {
    confirmed: '#10B981',
    pending: '#F59E0B',
    cancelled: '#EF4444',
    completed: '#8B5CF6',
    failed: '#EF4444',
    active: '#10B981',
    inactive: '#71717A',
    healthy: '#10B981',
    degraded: '#F59E0B',
    unhealthy: '#EF4444'
  }
} as const

// Export individual color groups for easier imports
export const { primary, accent, neutral, semantic, status } = subtleSlateColors

// Utility function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`
}

// Common color combinations for consistent usage in light theme
export const colorCombinations = {
  // Card backgrounds
  cardPrimary: {
    background: neutral[50],      // White cards
    border: neutral[300],         // Light gray borders
    text: neutral[900]            // Dark text
  },
  cardSecondary: {
    background: primary[100],     // Very light gray cards
    border: primary[300],         // Light borders
    text: neutral[800]            // Dark text
  },
  
  // Button variants for light theme
  buttonPrimary: {
    background: accent.blue,
    hover: '#2563EB',
    text: neutral[50],
    border: accent.blue
  },
  buttonSecondary: {
    background: primary[100],
    hover: primary[200],
    text: neutral[700],
    border: primary[300]
  },
  buttonSuccess: {
    background: accent.emerald,
    hover: '#059669',
    text: neutral[50],
    border: accent.emerald
  },
  
  // Input styles for light theme
  input: {
    background: neutral[50],
    border: primary[300],
    borderFocus: accent.blue,
    text: neutral[900],
    placeholder: neutral[500]
  },
  
  // Navigation for light theme
  navigation: {
    background: neutral[50],
    active: accent.blue,
    hover: primary[100],
    text: neutral[700],
    textActive: neutral[50]
  }
} as const