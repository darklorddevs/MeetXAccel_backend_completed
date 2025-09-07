/**
 * Dashboard Page
 * 
 * Main dashboard overview with key metrics, recent activity,
 * and quick actions for organizers.
 */

'use client'

import React from 'react'
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp,
  Plus,
  ArrowRight,
  CalendarDays,
  UserCheck,
  Zap,
  BarChart3
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardContent, StatsCard, FeatureCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { useEventTypes, useBookings } from '@/hooks/use-api'
import { ROUTES } from '@/lib/constants'
import { dateUtils } from '@/lib/utils'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  
  // Fetch dashboard data
  const { data: eventTypes, isLoading: eventTypesLoading } = useEventTypes()
  const { data: bookings, isLoading: bookingsLoading } = useBookings({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
  })

  // Calculate stats
  const stats = React.useMemo(() => {
    const totalEventTypes = eventTypes?.results?.length || 0
    const activeEventTypes = eventTypes?.results?.filter((et: any) => et.is_active)?.length || 0
    const totalBookings = bookings?.results?.length || 0
    const confirmedBookings = bookings?.results?.filter((b: any) => b.status === 'confirmed')?.length || 0
    
    return {
      totalEventTypes,
      activeEventTypes,
      totalBookings,
      confirmedBookings,
      cancellationRate: totalBookings > 0 ? 
        ((totalBookings - confirmedBookings) / totalBookings * 100).toFixed(1) : '0',
    }
  }, [eventTypes, bookings])

  // Recent bookings for quick view
  const recentBookings = React.useMemo(() => {
    return bookings?.results?.slice(0, 5) || []
  }, [bookings])

  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        {/* Welcome section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Welcome back, {user?.first_name}! 👋
            </h1>
            <p className="text-neutral-600 mt-1">
              Here's what's happening with your scheduling today.
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link href={ROUTES.createEventType}>
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                New Event Type
              </Button>
            </Link>
            <Link href={ROUTES.calendar}>
              <Button variant="outline">
                View Calendar
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Event Types"
            value={stats.totalEventTypes}
            change={{
              value: 12,
              type: 'increase',
              period: 'last month'
            }}
            icon={<Calendar className="h-6 w-6" />}
          />
          
          <StatsCard
            title="Total Bookings"
            value={stats.totalBookings}
            change={{
              value: 8,
              type: 'increase',
              period: 'last month'
            }}
            icon={<UserCheck className="h-6 w-6" />}
          />
          
          <StatsCard
            title="Confirmed"
            value={stats.confirmedBookings}
            icon={<Users className="h-6 w-6" />}
          />
          
          <StatsCard
            title="Cancellation Rate"
            value={`${stats.cancellationRate}%`}
            change={{
              value: 2,
              type: 'decrease',
              period: 'last month'
            }}
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader 
                title="Recent Bookings"
                action={
                  <Link href={ROUTES.bookings}>
                    <Button variant="ghost" size="sm">
                      View all
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                }
              />
              <CardContent>
                {bookingsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-700 rounded-full animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-primary-700 rounded animate-pulse" />
                          <div className="h-3 bg-primary-700 rounded w-3/4 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentBookings.length > 0 ? (
                  <div className="space-y-4">
                    {recentBookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-primary-700/50 transition-colors">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-indigo rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {booking.invitee_name}
                          </p>
                          <p className="text-xs text-neutral-600">
                            {booking.event_type.name} • {dateUtils.formatDateTime(booking.start_time)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-success-50 text-success-700 border border-success-200' :
                            booking.status === 'cancelled' ? 'bg-error-50 text-error-700 border border-error-200' :
                            'bg-warning-50 text-warning-700 border border-warning-200'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
                    <p className="text-neutral-600">No recent bookings</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Bookings will appear here once people start scheduling with you.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick actions and features */}
          <div className="space-y-6">
            {/* Quick actions */}
            <Card>
              <CardHeader title="Quick Actions" />
              <CardContent className="space-y-3">
                <Link href={ROUTES.createEventType} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-3" />
                    Create Event Type
                  </Button>
                </Link>
                
                <Link href={ROUTES.availability} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-3" />
                    Set Availability
                  </Button>
                </Link>
                
                <Link href={ROUTES.integrations} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Zap className="h-4 w-4 mr-3" />
                    Connect Calendar
                  </Button>
                </Link>
                
                <Link href={ROUTES.analytics} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-3" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Feature highlights */}
            <div className="space-y-4">
              <FeatureCard
                title="Workflow Automation"
                description="Automate your scheduling workflow with custom triggers and actions."
                icon={<Zap className="h-6 w-6" />}
                status="active"
                action={
                  <Link href={ROUTES.workflows}>
                    <Button size="sm" variant="outline">
                      Explore Workflows
                    </Button>
                  </Link>
                }
              />
              
              <FeatureCard
                title="Team Scheduling"
                description="Coordinate schedules across your entire team with shared calendars."
                icon={<Users className="h-6 w-6" />}
                status="coming_soon"
                action={
                  <Button size="sm" variant="ghost" disabled>
                    Coming Soon
                  </Button>
                }
              />
            </div>
          </div>
        </div>

        {/* Getting started section (for new users) */}
        {stats.totalEventTypes === 0 && (
          <Card variant="gradient">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-accent-blue" />
              </div>
              
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Let's get you started!
              </h3>
              
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Create your first event type to start accepting bookings. 
                It only takes a few minutes to set up.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={ROUTES.createEventType}>
                  <Button size="lg">
                    Create Your First Event Type
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Button variant="outline" size="lg">
                  Watch Tutorial
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}