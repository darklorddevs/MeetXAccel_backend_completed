import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Monkai Theme Color Palette
        primary: {
          50: '#f0f0f5',
          100: '#e1e1ea',
          200: '#c3c3d5',
          300: '#a5a5c0',
          400: '#8787ab',
          500: '#696996',
          600: '#545481',
          700: '#3f3f6c',
          800: '#2a2a57',
          900: '#151542',
          950: '#0a0a21'
        },
        accent: {
          pink: '#E94560',
          green: '#00B894',
          blue: '#007BFF',
          orange: '#FF6B35',
          purple: '#6C5CE7'
        },
        neutral: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e3e5e8',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712'
        },
        // Semantic colors with Monkai theme
        success: {
          50: '#ecfdf5',
          500: '#00B894',
          600: '#059669',
          700: '#047857'
        },
        error: {
          50: '#fef2f2',
          500: '#E94560',
          600: '#dc2626',
          700: '#b91c1c'
        },
        warning: {
          50: '#fffbeb',
          500: '#FF6B35',
          600: '#d97706',
          700: '#b45309'
        },
        info: {
          50: '#eff6ff',
          500: '#007BFF',
          600: '#2563eb',
          700: '#1d4ed8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'monkai': '0 4px 6px -1px rgba(233, 69, 96, 0.1), 0 2px 4px -1px rgba(233, 69, 96, 0.06)',
        'monkai-lg': '0 10px 15px -3px rgba(233, 69, 96, 0.1), 0 4px 6px -2px rgba(233, 69, 96, 0.05)',
        'monkai-xl': '0 20px 25px -5px rgba(233, 69, 96, 0.1), 0 10px 10px -5px rgba(233, 69, 96, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config