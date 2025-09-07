/**
 * Root Layout
 * 
 * The root layout component that wraps all pages with providers
 * and global styles.
 */

import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const robotoMono = Roboto_Mono({ 
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Calendly Clone - Professional Scheduling Platform',
    template: '%s | Calendly Clone',
  },
  description: 'Enterprise-grade scheduling platform for modern teams. Create events, manage bookings, and automate workflows with ease.',
  keywords: ['scheduling', 'calendar', 'booking', 'meetings', 'appointments', 'calendly'],
  authors: [{ name: 'Calendly Clone Team' }],
  creator: 'Calendly Clone',
  publisher: 'Calendly Clone',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
    siteName: 'Calendly Clone',
    title: 'Calendly Clone - Professional Scheduling Platform',
    description: 'Enterprise-grade scheduling platform for modern teams.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Calendly Clone',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calendly Clone - Professional Scheduling Platform',
    description: 'Enterprise-grade scheduling platform for modern teams.',
    images: ['/og-image.png'],
    creator: '@calendlyclone',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="font-sans antialiased bg-primary-50 text-neutral-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}