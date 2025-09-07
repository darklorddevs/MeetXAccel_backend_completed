/**
 * Copy to Clipboard Hook
 * 
 * Custom hook for copying text to clipboard with feedback.
 */

import { useState } from 'react'
import { toast } from '@/components/ui/toast'

interface UseCopyToClipboardReturn {
  isCopied: boolean
  copyToClipboard: (text: string, successMessage?: string) => Promise<boolean>
}

export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async (
    text: string, 
    successMessage: string = 'Copied to clipboard!'
  ): Promise<boolean> => {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        if (successful) {
          setIsCopied(true)
          toast.success(successMessage)
          setTimeout(() => setIsCopied(false), 2000)
          return true
        }
        
        return false
      } catch (error) {
        console.error('Fallback copy failed:', error)
        toast.error('Failed to copy to clipboard')
        return false
      }
    }

    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      toast.success(successMessage)
      
      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000)
      
      return true
    } catch (error) {
      console.error('Copy to clipboard failed:', error)
      toast.error('Failed to copy to clipboard')
      return false
    }
  }

  return { isCopied, copyToClipboard }
}