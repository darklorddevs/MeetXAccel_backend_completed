/**
 * Toast Notification Setup
 * 
 * Configures react-hot-toast with Monkai theme styling.
 */

import { toast as hotToast, Toaster } from 'react-hot-toast'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

// Custom toast styles for Monkai theme
const toastStyles = {
  success: {
    style: {
      background: '#00B894',
      color: '#ffffff',
      border: '1px solid #059669',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#00B894',
    },
  },
  error: {
    style: {
      background: '#E94560',
      color: '#ffffff',
      border: '1px solid #dc2626',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#E94560',
    },
  },
  loading: {
    style: {
      background: '#3f3f6c',
      color: '#e1e1ea',
      border: '1px solid #545481',
    },
    iconTheme: {
      primary: '#e1e1ea',
      secondary: '#3f3f6c',
    },
  },
}

// Enhanced toast functions with icons
export const toast = {
  success: (message: string) => {
    return hotToast.success(message, {
      ...toastStyles.success,
      icon: <CheckCircle className="h-5 w-5" />,
      duration: 4000,
    })
  },

  error: (message: string) => {
    return hotToast.error(message, {
      ...toastStyles.error,
      icon: <XCircle className="h-5 w-5" />,
      duration: 6000,
    })
  },

  warning: (message: string) => {
    return hotToast(message, {
      style: {
        background: '#FF6B35',
        color: '#ffffff',
        border: '1px solid #d97706',
      },
      icon: <AlertCircle className="h-5 w-5" />,
      duration: 5000,
    })
  },

  info: (message: string) => {
    return hotToast(message, {
      style: {
        background: '#007BFF',
        color: '#ffffff',
        border: '1px solid #2563eb',
      },
      icon: <Info className="h-5 w-5" />,
      duration: 4000,
    })
  },

  loading: (message: string) => {
    return hotToast.loading(message, toastStyles.loading)
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return hotToast.promise(promise, messages, {
      success: toastStyles.success,
      error: toastStyles.error,
      loading: toastStyles.loading,
    })
  },

  dismiss: (toastId?: string) => {
    return hotToast.dismiss(toastId)
  },

  remove: (toastId: string) => {
    return hotToast.remove(toastId)
  },
}

// Toaster component with Monkai theme
export const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerClassName="z-50"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#3f3f6c',
          color: '#e1e1ea',
          border: '1px solid #545481',
          borderRadius: '0.5rem',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          boxShadow: '0 10px 15px -3px rgba(233, 69, 96, 0.1), 0 4px 6px -2px rgba(233, 69, 96, 0.05)',
        },
        success: toastStyles.success,
        error: toastStyles.error,
        loading: toastStyles.loading,
      }}
    />
  )
}