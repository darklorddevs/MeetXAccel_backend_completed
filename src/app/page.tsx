/**
 * Home Page
 * 
 * Landing page for the application. Redirects authenticated users
 * to dashboard, shows marketing content for unauthenticated users.
 */

'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Star,
  Globe,
  Shield,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/auth-context'
import { ROUTES } from '@/lib/constants'

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(ROUTES.dashboard)
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-pink"></div>
      </div>
    )
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200">
      {/* Header */}
      <header className="border-b border-primary-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-indigo rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-neutral-900">
                Calendly Clone
              </span>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Link href={ROUTES.login}>
                <Button variant="ghost">
                  Sign in
                </Button>
              </Link>
              <Link href={ROUTES.register}>
                <Button variant="primary">
                  Get started free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-neutral-100 mb-6">
            Scheduling made{' '}
            <span className="slate-text-gradient">
              simple
            </span>
          </h1>
          
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
            Eliminate the back-and-forth emails and find the perfect time for everyone. 
            Our enterprise-grade scheduling platform makes booking meetings effortless.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ROUTES.register}>
              <Button size="lg" className="w-full sm:w-auto">
                Start scheduling for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Watch demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Everything you need to schedule smarter
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Powerful features designed for modern teams and professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards */}
            {[
              {
                icon: Calendar,
                title: 'Smart Scheduling',
                description: 'Intelligent availability detection with timezone support and conflict resolution.',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Role-based access control, team calendars, and collaborative scheduling.',
              },
              {
                icon: Zap,
                title: 'Powerful Integrations',
                description: 'Connect with Google Calendar, Zoom, Slack, and 100+ other tools.',
              },
              {
                icon: Workflow,
                title: 'Automation Workflows',
                description: 'Automate follow-ups, reminders, and custom actions with visual workflow builder.',
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'SSO, MFA, audit logs, and enterprise-grade security features.',
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Detailed insights into your scheduling patterns and team performance.',
              },
            ].map((feature, index) => (
              <Card key={index} variant="gradient" hover="lift" className="p-6">
                <div className="text-accent-blue mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-100/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Trusted by teams worldwide
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {[
              { metric: '10M+', label: 'Meetings scheduled' },
              { metric: '50K+', label: 'Active users' },
              { metric: '99.9%', label: 'Uptime' },
              { metric: '4.9/5', label: 'User rating' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-accent-blue mb-2">
                  {stat.metric}
                </div>
                <div className="text-neutral-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Ready to transform your scheduling?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Join thousands of professionals who have streamlined their scheduling with our platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ROUTES.register}>
              <Button size="lg" className="w-full sm:w-auto">
                Get started free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Contact sales
            </Button>
          </div>
          
          <p className="text-sm text-neutral-400 mt-4">
            No credit card required • Free 14-day trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-neutral-600 hover:text-neutral-800">Features</Link></li>
                <li><Link href="/pricing" className="text-neutral-600 hover:text-neutral-800">Pricing</Link></li>
                <li><Link href="/integrations" className="text-neutral-600 hover:text-neutral-800">Integrations</Link></li>
                <li><Link href="/api" className="text-neutral-600 hover:text-neutral-800">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-neutral-600 hover:text-neutral-800">About</Link></li>
                <li><Link href="/careers" className="text-neutral-600 hover:text-neutral-800">Careers</Link></li>
                <li><Link href="/blog" className="text-neutral-600 hover:text-neutral-800">Blog</Link></li>
                <li><Link href="/press" className="text-neutral-600 hover:text-neutral-800">Press</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-neutral-600 hover:text-neutral-800">Help Center</Link></li>
                <li><Link href="/docs" className="text-neutral-600 hover:text-neutral-800">Documentation</Link></li>
                <li><Link href="/contact" className="text-neutral-600 hover:text-neutral-800">Contact</Link></li>
                <li><Link href="/status" className="text-neutral-600 hover:text-neutral-800">Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-neutral-600 hover:text-neutral-800">Privacy</Link></li>
                <li><Link href="/terms" className="text-neutral-600 hover:text-neutral-800">Terms</Link></li>
                <li><Link href="/security" className="text-neutral-600 hover:text-neutral-800">Security</Link></li>
                <li><Link href="/compliance" className="text-neutral-600 hover:text-neutral-800">Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-200 mt-8 pt-8 text-center">
            <p className="text-neutral-500">
              © 2024 Calendly Clone. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}