/**
 * Button Component
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * Follows the Monkai theme design principles.
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accent-blue hover:bg-accent-blue/90 text-white shadow-slate hover:shadow-slate-lg focus-visible:ring-accent-blue',
        secondary: 'bg-primary-100 hover:bg-primary-200 text-neutral-700 border border-primary-300 hover:border-primary-400',
        success: 'bg-accent-emerald hover:bg-accent-emerald/90 text-white shadow-slate hover:shadow-slate-lg focus-visible:ring-accent-emerald',
        outline: 'border border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white focus-visible:ring-accent-blue',
        ghost: 'text-neutral-600 hover:bg-primary-100 hover:text-neutral-700 focus-visible:ring-primary-300',
        danger: 'bg-accent-red hover:bg-accent-red/90 text-white shadow-slate hover:shadow-slate-lg focus-visible:ring-accent-red',
        link: 'text-accent-blue hover:text-accent-blue/80 underline-offset-4 hover:underline focus-visible:ring-accent-blue',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!loading && leftIcon && (
          <span className="mr-2 flex items-center">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="ml-2 flex items-center">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }