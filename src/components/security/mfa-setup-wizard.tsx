/**
 * MFA Setup Wizard Component
 * 
 * Multi-step wizard for setting up multi-factor authentication.
 */

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Smartphone, 
  Key, 
  QrCode, 
  Phone, 
  CheckCircle,
  Copy,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Radio } from '@/components/ui/radio'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Form, FormField, FormActions } from '@/components/ui/form'
import { useSetupMfa, useVerifyMfaSetup } from '@/hooks/use-api'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { mfaSetupSchema, mfaVerificationSchema } from '@/lib/validation'
import { toast } from '@/components/ui/toast'

interface MfaSetupWizardProps {
  onSuccess: () => void
  onCancel: () => void
}

export const MfaSetupWizard: React.FC<MfaSetupWizardProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [setupData, setSetupData] = useState<any>(null)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const { copyToClipboard } = useCopyToClipboard()

  const setupMfaMutation = useSetupMfa()
  const verifyMfaSetupMutation = useVerifyMfaSetup()

  // Step 1: Device Type Selection
  const {
    register: registerSetup,
    handleSubmit: handleSetupSubmit,
    watch: watchSetup,
    formState: { errors: setupErrors, isSubmitting: isSetupSubmitting },
  } = useForm({
    resolver: zodResolver(mfaSetupSchema),
    defaultValues: {
      device_type: 'totp',
      device_name: 'Authenticator App',
      phone_number: '',
    },
  })

  // Step 2: Verification
  const {
    register: registerVerify,
    handleSubmit: handleVerifySubmit,
    formState: { errors: verifyErrors, isSubmitting: isVerifySubmitting },
  } = useForm({
    resolver: zodResolver(mfaVerificationSchema),
    defaultValues: {
      otp_code: '',
    },
  })

  const deviceType = watchSetup('device_type')

  const handleSetupMfa = async (data: any) => {
    try {
      const response = await setupMfaMutation.mutateAsync(data)
      setSetupData(response)
      setCurrentStep(2)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to setup MFA')
    }
  }

  const handleVerifyMfa = async (data: any) => {
    try {
      const response = await verifyMfaSetupMutation.mutateAsync({
        token: data.otp_code,
      })
      
      if (response.backup_codes) {
        setBackupCodes(response.backup_codes)
        setCurrentStep(3)
      } else {
        onSuccess()
      }
    } catch (error: any) {
      toast.error(error?.message || 'Invalid verification code')
    }
  }

  const deviceTypeOptions = [
    {
      value: 'totp',
      label: 'Authenticator App',
      description: 'Use an app like Google Authenticator or Authy',
    },
    {
      value: 'sms',
      label: 'SMS',
      description: 'Receive codes via text message',
    },
  ]

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Form onSubmit={handleSetupSubmit(handleSetupMfa)}>
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-6 w-6 text-accent-blue" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Choose Authentication Method
                </h3>
                <p className="text-neutral-600">
                  Select how you'd like to receive your authentication codes
                </p>
              </div>

              <FormField>
                <Radio
                  options={deviceTypeOptions}
                  value={deviceType}
                  onChange={(value) => setValue('device_type', value)}
                  error={setupErrors.device_type?.message}
                />
              </FormField>

              <FormField>
                <Input
                  {...registerSetup('device_name')}
                  label="Device Name"
                  placeholder="My Authenticator"
                  leftIcon={<Key className="h-4 w-4" />}
                  error={setupErrors.device_name?.message}
                />
              </FormField>

              {deviceType === 'sms' && (
                <FormField>
                  <Input
                    {...registerSetup('phone_number')}
                    type="tel"
                    label="Phone Number"
                    placeholder="+1 (555) 123-4567"
                    leftIcon={<Phone className="h-4 w-4" />}
                    error={setupErrors.phone_number?.message}
                  />
                </FormField>
              )}

              <FormActions align="center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSetupSubmitting}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  loading={isSetupSubmitting}
                  disabled={isSetupSubmitting}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Continue
                </Button>
              </FormActions>
            </div>
          </Form>
        )

      case 2:
        return (
          <Form onSubmit={handleVerifySubmit(handleVerifyMfa)}>
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {deviceType === 'totp' ? (
                    <QrCode className="h-6 w-6 text-accent-blue" />
                  ) : (
                    <Phone className="h-6 w-6 text-accent-blue" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {deviceType === 'totp' ? 'Scan QR Code' : 'Enter SMS Code'}
                </h3>
                <p className="text-neutral-600">
                  {deviceType === 'totp' 
                    ? 'Scan this QR code with your authenticator app'
                    : 'Enter the code sent to your phone'
                  }
                </p>
              </div>

              {deviceType === 'totp' && setupData?.qr_code && (
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-white rounded-lg border border-primary-200">
                    <img 
                      src={setupData.qr_code} 
                      alt="MFA QR Code" 
                      className="w-48 h-48"
                    />
                  </div>
                  
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-neutral-900 mb-2">
                      Can't scan? Enter this code manually:
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <code className="bg-neutral-100 px-3 py-2 rounded text-sm font-mono">
                        {setupData.manual_entry_key}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(setupData.manual_entry_key)}
                        leftIcon={<Copy className="h-4 w-4" />}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <FormField>
                <Input
                  {...registerVerify('otp_code')}
                  label="Verification Code"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  error={verifyErrors.otp_code?.message}
                  autoFocus
                />
              </FormField>

              <FormActions align="center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  disabled={isVerifySubmitting}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back
                </Button>
                
                <Button
                  type="submit"
                  loading={isVerifySubmitting}
                  disabled={isVerifySubmitting}
                >
                  Verify & Enable MFA
                </Button>
              </FormActions>
            </div>
          </Form>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-success-500" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                MFA Enabled Successfully!
              </h3>
              <p className="text-neutral-600">
                Save these backup codes in a safe place
              </p>
            </div>

            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important: Save Your Backup Codes</AlertTitle>
              <AlertDescription>
                These codes can be used to access your account if you lose your authenticator device. 
                Each code can only be used once.
              </AlertDescription>
            </Alert>

            <div className="bg-neutral-50 border border-primary-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <div key={index} className="bg-white border border-primary-200 rounded p-2 text-center">
                    <code className="text-sm font-mono">{code}</code>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(backupCodes.join('\n'))}
                  leftIcon={<Copy className="h-4 w-4" />}
                >
                  Copy All Codes
                </Button>
              </div>
            </div>

            <FormActions align="center">
              <Button
                onClick={onSuccess}
                leftIcon={<CheckCircle className="h-4 w-4" />}
              >
                Complete Setup
              </Button>
            </FormActions>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-2 mb-8">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep
                ? 'bg-accent-blue text-white'
                : step < currentStep
                ? 'bg-success-500 text-white'
                : 'bg-primary-200 text-neutral-600'
            }`}
          >
            {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
          </div>
        ))}
      </div>

      {renderStep()}
    </div>
  )
}