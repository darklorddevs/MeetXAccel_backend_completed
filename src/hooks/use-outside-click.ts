/**
 * Outside Click Hook
 * 
 * Custom hook for detecting clicks outside of a component.
 */

import { useEffect, useRef } from 'react'

export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  callback: () => void,
  enabled: boolean = true
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!enabled) return

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('touchstart', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [callback, enabled])

  return ref
}

// Hook for detecting escape key press
export function useEscapeKey(callback: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [callback, enabled])
}

// Combined hook for modal-like behavior
export function useModalBehavior(
  onClose: () => void,
  isOpen: boolean = true
) {
  const ref = useOutsideClick<HTMLDivElement>(onClose, isOpen)
  useEscapeKey(onClose, isOpen)

  return ref
}