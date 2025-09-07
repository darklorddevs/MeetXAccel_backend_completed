/**
 * Profile Page
 * 
 * User profile management page with comprehensive settings and customization options.
 */

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Building, 
  Briefcase, 
  Clock,
  Palette,
  Eye,
  EyeOff,
  Upload,
  Save,
  Camera
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Avatar } from '@/components/ui/avatar'
import { Form, FormSection, FormField, FormGrid, FormActions } from '@/components/ui/form'
import { LoadingOverlay } from '@/components/ui/loading'
import { useAuth } from '@/context/auth-context'
import { useCurrentUser, useUpdateProfile } from '@/hooks/use-api'
import { profileUpdateSchema, type ProfileUpdateData } from '@/lib/validation'
import { 
  TIMEZONE_OPTIONS, 
  LANGUAGE_OPTIONS, 
  DATE_FORMAT_OPTIONS, 
  TIME_FORMAT_OPTIONS 
} from '@/lib/constants'
import { toast } from '@/components/ui/toast'
import { stringUtils } from '@/lib/utils'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const { data: currentUser, isLoading } = useCurrentUser()
  const updateProfileMutation = useUpdateProfile()
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      display_name: '',
      bio: '',
      phone: '',
      website: '',
      company: '',
      job_title: '',
      timezone_name: 'UTC',
      language: 'en',
      date_format: 'MM/DD/YYYY',
      time_format: '12h',
      brand_color: '#3B82F6',
      public_profile: true,
      show_phone: false,
      show_email: true,
      reasonable_hours_start: 7,
      reasonable_hours_end: 22,
    },
  })

  // Update form when user data loads
  React.useEffect(() => {
    if (currentUser?.profile) {
      const profile = currentUser.profile
      reset({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        website: profile.website || '',
        company: profile.company || '',
        job_title: profile.job_title || '',
        timezone_name: profile.timezone_name || 'UTC',
        language: profile.language || 'en',
        date_format: profile.date_format || 'MM/DD/YYYY',
        time_format: profile.time_format || '12h',
        brand_color: profile.brand_color || '#3B82F6',
        public_profile: profile.public_profile ?? true,
        show_phone: profile.show_phone ?? false,
        show_email: profile.show_email ?? true,
        reasonable_hours_start: profile.reasonable_hours_start ?? 7,
        reasonable_hours_end: profile.reasonable_hours_end ?? 22,
      })
    }
  }, [currentUser, reset])

  // Handle profile picture upload
  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfilePictureFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: ProfileUpdateData) => {
    try {
      await updateProfileMutation.mutateAsync(data)
      await refreshUser()
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update profile')
    }
  }

  const brandColor = watch('brand_color')
  const publicProfile = watch('public_profile')

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">
          <LoadingOverlay isLoading={true} message="Loading profile...">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="h-64 bg-primary-100 rounded-lg animate-pulse" />
              <div className="h-96 bg-primary-100 rounded-lg animate-pulse" />
            </div>
          </LoadingOverlay>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Profile Settings</h1>
            <p className="text-neutral-600 mt-1">
              Manage your personal information and preferences
            </p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <LoadingOverlay isLoading={isSubmitting} message="Saving profile...">
              {/* Profile Picture Section */}
              <Card>
                <CardHeader title="Profile Picture" />
                <CardContent>
                  <div className="flex items-center space-x-6">
                    <Avatar
                      src={profilePicturePreview || currentUser?.profile?.profile_picture}
                      alt={currentUser?.full_name}
                      fallback={stringUtils.getInitials(
                        currentUser?.first_name || '',
                        currentUser?.last_name || ''
                      )}
                      size="xl"
                    />
                    
                    <div>
                      <label htmlFor="profile-picture" className="cursor-pointer">
                        <Button
                          type="button"
                          variant="outline"
                          leftIcon={<Camera className="h-4 w-4" />}
                          onClick={() => document.getElementById('profile-picture')?.click()}
                        >
                          Change Picture
                        </Button>
                      </label>
                      
                      <input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                      
                      <p className="text-sm text-neutral-600 mt-2">
                        JPG, PNG or GIF. Max size 5MB.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader 
                  title="Basic Information"
                  description="Your personal details and contact information"
                />
                <CardContent>
                  <FormGrid columns={2}>
                    <FormField>
                      <Input
                        {...register('display_name')}
                        label="Display Name"
                        placeholder="How you want to appear to others"
                        leftIcon={<User className="h-4 w-4" />}
                        error={errors.display_name?.message}
                      />
                    </FormField>

                    <FormField>
                      <Input
                        value={currentUser?.email || ''}
                        label="Email Address"
                        leftIcon={<Mail className="h-4 w-4" />}
                        disabled
                        helperText="Contact support to change your email address"
                      />
                    </FormField>

                    <FormField>
                      <Input
                        {...register('phone')}
                        type="tel"
                        label="Phone Number"
                        placeholder="+1 (555) 123-4567"
                        leftIcon={<Phone className="h-4 w-4" />}
                        error={errors.phone?.message}
                      />
                    </FormField>

                    <FormField>
                      <Input
                        {...register('website')}
                        type="url"
                        label="Website"
                        placeholder="https://yourwebsite.com"
                        leftIcon={<Globe className="h-4 w-4" />}
                        error={errors.website?.message}
                      />
                    </FormField>

                    <FormField>
                      <Input
                        {...register('company')}
                        label="Company"
                        placeholder="Your company name"
                        leftIcon={<Building className="h-4 w-4" />}
                        error={errors.company?.message}
                      />
                    </FormField>

                    <FormField>
                      <Input
                        {...register('job_title')}
                        label="Job Title"
                        placeholder="Your role or position"
                        leftIcon={<Briefcase className="h-4 w-4" />}
                        error={errors.job_title?.message}
                      />
                    </FormField>
                  </FormGrid>

                  <FormField>
                    <Textarea
                      {...register('bio')}
                      label="Bio"
                      placeholder="Tell people a bit about yourself..."
                      maxLength={500}
                      showCharCount
                      error={errors.bio?.message}
                    />
                  </FormField>
                </CardContent>
              </Card>

              {/* Localization Settings */}
              <Card>
                <CardHeader 
                  title="Localization"
                  description="Configure your timezone and display preferences"
                />
                <CardContent>
                  <FormGrid columns={2}>
                    <FormField>
                      <Select
                        options={TIMEZONE_OPTIONS}
                        value={watch('timezone_name')}
                        onChange={(value) => setValue('timezone_name', value)}
                        label="Timezone"
                        searchable
                        error={errors.timezone_name?.message}
                      />
                    </FormField>

                    <FormField>
                      <Select
                        options={LANGUAGE_OPTIONS}
                        value={watch('language')}
                        onChange={(value) => setValue('language', value)}
                        label="Language"
                        error={errors.language?.message}
                      />
                    </FormField>

                    <FormField>
                      <Select
                        options={DATE_FORMAT_OPTIONS}
                        value={watch('date_format')}
                        onChange={(value) => setValue('date_format', value)}
                        label="Date Format"
                        error={errors.date_format?.message}
                      />
                    </FormField>

                    <FormField>
                      <Select
                        options={TIME_FORMAT_OPTIONS}
                        value={watch('time_format')}
                        onChange={(value) => setValue('time_format', value)}
                        label="Time Format"
                        error={errors.time_format?.message}
                      />
                    </FormField>
                  </FormGrid>
                </CardContent>
              </Card>

              {/* Branding */}
              <Card>
                <CardHeader 
                  title="Branding"
                  description="Customize how your booking pages look"
                />
                <CardContent>
                  <FormField>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Brand Color
                      </label>
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-lg border border-primary-300 shadow-sm"
                          style={{ backgroundColor: brandColor }}
                        />
                        <Input
                          {...register('brand_color')}
                          type="color"
                          className="w-20 h-12 p-1 border border-primary-300 rounded-lg"
                          error={errors.brand_color?.message}
                        />
                        <div className="flex-1">
                          <Input
                            {...register('brand_color')}
                            placeholder="#3B82F6"
                            leftIcon={<Palette className="h-4 w-4" />}
                            error={errors.brand_color?.message}
                          />
                        </div>
                      </div>
                    </div>
                  </FormField>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader 
                  title="Privacy Settings"
                  description="Control what information is visible on your public profile"
                />
                <CardContent className="space-y-6">
                  <Switch
                    checked={publicProfile}
                    onChange={(checked) => setValue('public_profile', checked)}
                    label="Public Profile"
                    description="Allow others to view your profile information"
                  />

                  {publicProfile && (
                    <div className="ml-6 space-y-4 border-l-2 border-primary-200 pl-6">
                      <Switch
                        checked={watch('show_email')}
                        onChange={(checked) => setValue('show_email', checked)}
                        label="Show Email"
                        description="Display your email address on your public profile"
                      />

                      <Switch
                        checked={watch('show_phone')}
                        onChange={(checked) => setValue('show_phone', checked)}
                        label="Show Phone"
                        description="Display your phone number on your public profile"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Multi-Invitee Scheduling */}
              <Card>
                <CardHeader 
                  title="Multi-Invitee Scheduling"
                  description="Configure reasonable hours for group scheduling across timezones"
                />
                <CardContent>
                  <FormGrid columns={2}>
                    <FormField>
                      <Select
                        options={Array.from({ length: 24 }, (_, i) => ({
                          value: i.toString(),
                          label: `${i.toString().padStart(2, '0')}:00`,
                        }))}
                        value={watch('reasonable_hours_start')?.toString()}
                        onChange={(value) => setValue('reasonable_hours_start', parseInt(value))}
                        label="Reasonable Hours Start"
                        error={errors.reasonable_hours_start?.message}
                      />
                    </FormField>

                    <FormField>
                      <Select
                        options={Array.from({ length: 24 }, (_, i) => ({
                          value: (i + 1).toString(),
                          label: `${(i + 1).toString().padStart(2, '0')}:00`,
                        }))}
                        value={watch('reasonable_hours_end')?.toString()}
                        onChange={(value) => setValue('reasonable_hours_end', parseInt(value))}
                        label="Reasonable Hours End"
                        error={errors.reasonable_hours_end?.message}
                      />
                    </FormField>
                  </FormGrid>
                  
                  <p className="text-sm text-neutral-600 mt-2">
                    These hours help optimize scheduling when multiple invitees are in different timezones.
                  </p>
                </CardContent>
              </Card>

              {/* Form Actions */}
              <FormActions>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={!isDirty || isSubmitting}
                >
                  Reset Changes
                </Button>
                
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={!isDirty || isSubmitting}
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  Save Changes
                </Button>
              </FormActions>
            </LoadingOverlay>
          </Form>
        </div>
      </div>
    </AppLayout>
  )
}