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
      background: '#10B981',
      color: '#ffffff',
      border: '1px solid #059669',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#10B981',
    },
  },
  error: {
    style: {
      background: '#EF4444',
      color: '#ffffff',
      border: '1px solid #DC2626',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#EF4444',
    },
  },
  loading: {
    style: {
      background: '#F1F5F9',
      color: '#334155',
      border: '1px solid #CBD5E1',
    },
    iconTheme: {
      primary: '#334155',
      secondary: '#F1F5F9',
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
        background: '#F59E0B',
        color: '#ffffff',
        border: '1px solid #D97706',
      },
      icon: <AlertCircle className="h-5 w-5" />,
      duration: 5000,
    })
  },

  info: (message: string) => {
    return hotToast(message, {
      style: {
        background: '#3B82F6',
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
          background: '#FFFFFF',
          color: '#334155',
          border: '1px solid #CBD5E1',
          borderRadius: '0.5rem',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        success: toastStyles.success,
        error: toastStyles.error,
        loading: toastStyles.loading,
      }}
    />
  )
}