/**
 * Main Type Exports
 * 
 * Central export file for all TypeScript types used throughout the application.
 */

// Re-export all types from individual type files
export * from './api'
export * from './auth'
export * from './common'

// Global type augmentations
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

// Utility types for better TypeScript experience
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type NonEmptyArray<T> = [T, ...T[]]

export type ValueOf<T> = T[keyof T]

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]