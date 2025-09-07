/**
 * UI Store
 * 
 * Zustand store for managing global UI state.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NotificationItem {
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

interface UIState {
  // Sidebar state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  // Modal state
  currentModal: string | null
  modalData: any
  openModal: (modalId: string, data?: any) => void
  closeModal: () => void

  // Loading state
  globalLoading: boolean
  setGlobalLoading: (loading: boolean) => void

  // Theme state
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // Notifications
  notifications: NotificationItem[]
  addNotification: (notification: Omit<NotificationItem, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void

  // Search state
  searchQuery: string
  setSearchQuery: (query: string) => void
  recentSearches: string[]
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void

  // Page state
  pageTitle: string
  setPageTitle: (title: string) => void
  breadcrumbs: Array<{ label: string; href?: string }>
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href?: string }>) => void

  // Form state
  unsavedChanges: boolean
  setUnsavedChanges: (hasChanges: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Sidebar state
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Modal state
      currentModal: null,
      modalData: null,
      openModal: (modalId, data) => set({ currentModal: modalId, modalData: data }),
      closeModal: () => set({ currentModal: null, modalData: null }),

      // Loading state
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      // Theme state
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      // Notifications
      notifications: [],
      addNotification: (notification) => {
        const id = Math.random().toString(36).substring(2, 15)
        const newNotification = { ...notification, id }
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }))

        // Auto-remove notification after duration
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id)
          }, notification.duration || 5000)
        }
      },
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      clearNotifications: () => set({ notifications: [] }),

      // Search state
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      recentSearches: [],
      addRecentSearch: (query) => {
        if (!query.trim()) return
        
        set((state) => {
          const filtered = state.recentSearches.filter(s => s !== query)
          return {
            recentSearches: [query, ...filtered].slice(0, 10) // Keep last 10 searches
          }
        })
      },
      clearRecentSearches: () => set({ recentSearches: [] }),

      // Page state
      pageTitle: '',
      setPageTitle: (title) => set({ pageTitle: title }),
      breadcrumbs: [],
      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

      // Form state
      unsavedChanges: false,
      setUnsavedChanges: (hasChanges) => set({ unsavedChanges: hasChanges }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        recentSearches: state.recentSearches,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)

// Selector hooks for better performance
export const useSidebar = () => useUIStore((state) => ({
  isOpen: state.sidebarOpen,
  open: () => state.setSidebarOpen(true),
  close: () => state.setSidebarOpen(false),
  toggle: state.toggleSidebar,
}))

export const useModal = () => useUIStore((state) => ({
  currentModal: state.currentModal,
  modalData: state.modalData,
  openModal: state.openModal,
  closeModal: state.closeModal,
}))

export const useTheme = () => useUIStore((state) => ({
  theme: state.theme,
  setTheme: state.setTheme,
}))

export const useNotifications = () => useUIStore((state) => ({
  notifications: state.notifications,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
}))

export const useSearch = () => useUIStore((state) => ({
  query: state.searchQuery,
  setQuery: state.setSearchQuery,
  recentSearches: state.recentSearches,
  addRecentSearch: state.addRecentSearch,
  clearRecentSearches: state.clearRecentSearches,
}))

export const usePage = () => useUIStore((state) => ({
  title: state.pageTitle,
  setTitle: state.setPageTitle,
  breadcrumbs: state.breadcrumbs,
  setBreadcrumbs: state.setBreadcrumbs,
}))

export const useUnsavedChanges = () => useUIStore((state) => ({
  hasUnsavedChanges: state.unsavedChanges,
  setUnsavedChanges: state.setUnsavedChanges,
}))