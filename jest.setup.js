import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8000/api/v1'
process.env.NEXT_PUBLIC_FRONTEND_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_APP_NAME = 'Calendly Clone'
process.env.NEXT_PUBLIC_ENABLE_SSO = 'true'
process.env.NEXT_PUBLIC_ENABLE_MFA = 'true'
process.env.NEXT_PUBLIC_ENABLE_ANALYTICS = 'true'
process.env.NEXT_PUBLIC_ENABLE_WORKFLOWS = 'true'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}