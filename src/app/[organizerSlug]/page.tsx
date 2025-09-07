/**
 * Public Organizer Profile Page
 * 
 * Public-facing page showing organizer's profile and available event types.
 */

'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Video, 
  Phone, 
  Settings,
  Globe,
  Building,
  ArrowRight
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { PageLoading } from '@/components/ui/loading'
import { EmptyState } from '@/components/ui/empty-state'
import { usePublicOrganizer } from '@/hooks/use-api'
import { DURATION_OPTIONS, LOCATION_TYPE_OPTIONS } from '@/lib/constants'
import { stringUtils } from '@/lib/utils'

export default function PublicOrganizerPage() {
  const params = useParams()
  const organizerSlug = params.organizerSlug as string

  const { data: organizer, isLoading, error } = usePublicOrganizer(organizerSlug)

  const getLocationIcon = (locationType: string) => {
    switch (locationType) {
      case 'video_call':
        return <Video className="h-4 w-4" />
      case 'phone_call':
        return <Phone className="h-4 w-4" />
      case 'in_person':
        return <MapPin className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return <PageLoading message="Loading organizer profile..." />
  }

  if (error || !organizer) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Organizer Not Found
          </h1>
          <p className="text-neutral-600 mb-6">
            The organizer you're looking for doesn't exist or is not available.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Homepage
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="bg-neutral-50 border-b border-primary-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            {/* Avatar */}
            <Avatar
              src={organizer.profile_picture}
              alt={organizer.display_name}
              fallback={stringUtils.getInitials(
                organizer.display_name?.split(' ')[0] || '',
                organizer.display_name?.split(' ')[1] || ''
              )}
              size="xl"
            />

            {/* Info */}
            <div className="mt-4 md:mt-0 flex-1">
              <h1 className="text-2xl font-bold text-neutral-900">
                {organizer.display_name}
              </h1>
              
              {organizer.bio && (
                <p className="text-neutral-600 mt-2 max-w-2xl">
                  {organizer.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-4">
                {organizer.company && (
                  <div className="flex items-center space-x-1 text-sm text-neutral-600">
                    <Building className="h-4 w-4" />
                    <span>{organizer.company}</span>
                  </div>
                )}
                
                {organizer.website && (
                  <a
                    href={organizer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-sm text-accent-blue hover:text-accent-blue/80"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Website</span>
                  </a>
                )}

                <div className="flex items-center space-x-1 text-sm text-neutral-600">
                  <Clock className="h-4 w-4" />
                  <span>{organizer.timezone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Event Types */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Book a meeting
          </h2>
          <p className="text-neutral-600">
            Choose a meeting type below to schedule time with {organizer.display_name}
          </p>
        </div>

        {organizer.event_types.length === 0 ? (
          <EmptyState
            title="No available meeting types"
            description="This organizer hasn't set up any public meeting types yet."
            icon={Calendar}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {organizer.event_types.map((eventType: any) => (
              <Card 
                key={eventType.event_type_slug} 
                variant="default" 
                hover="lift"
                className="cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: organizer.brand_color || '#3B82F6' }}
                      >
                        {getLocationIcon(eventType.location_type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {eventType.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {DURATION_OPTIONS.find(opt => opt.value === eventType.duration)?.label}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {getLocationIcon(eventType.location_type)}
                            <span>
                              {LOCATION_TYPE_OPTIONS.find(opt => opt.value === eventType.location_type)?.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {eventType.is_group_event && (
                      <Badge variant="info" size="sm">
                        <Users className="h-3 w-3 mr-1" />
                        Group
                      </Badge>
                    )}
                  </div>

                  {eventType.description && (
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {eventType.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-neutral-500">
                      {eventType.max_attendees > 1 && (
                        <span>Up to {eventType.max_attendees} attendees</span>
                      )}
                    </div>

                    <Link href={`/${organizerSlug}/${eventType.event_type_slug}`}>
                      <Button
                        size="sm"
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                        style={{ backgroundColor: organizer.brand_color || '#3B82F6' }}
                      >
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-primary-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-neutral-500">
            <p>Powered by Calendly Clone</p>
          </div>
        </div>
      </footer>
    </div>
  )
}