/**
 * Authentication Type Definitions
 */

export interface AuthUser {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  is_organizer: boolean
  is_email_verified: boolean
  is_phone_verified: boolean
  is_mfa_enabled: boolean
  account_status: AccountStatus
  roles: Role[]
  profile: Profile
  last_login: string | null
  date_joined: string
}

export type AccountStatus = 
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'pending_verification'
  | 'password_expired'
  | 'password_expired_grace_period'

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  remember_me?: boolean
}

export interface RegisterData {
  email: string
  first_name: string
  last_name: string
  password: string
  password_confirm: string
  terms_accepted: boolean
}

export interface MFADevice {
  id: string
  device_type: 'totp' | 'sms' | 'backup'
  device_type_display: string
  name: string
  phone_number: string
  is_active: boolean
  is_primary: boolean
  last_used_at: string | null
  created_at: string
}

export interface MFASetupData {
  device_type: 'totp' | 'sms'
  device_name: string
  phone_number?: string
}

export interface MFAVerificationData {
  otp_code: string
  device_id?: string
}

export interface UserSession {
  id: string
  session_key: string
  ip_address: string
  country: string
  city: string
  location: string
  user_agent: string
  device_info: Record<string, any>
  created_at: string
  last_activity: string
  expires_at: string
  is_active: boolean
  is_current: boolean
  is_expired: boolean
}

export interface AuditLog {
  id: string
  user_email: string
  action: string
  action_display: string
  description: string
  ip_address: string
  user_agent: string
  metadata: Record<string, any>
  created_at: string
}

export interface Invitation {
  id: string
  invited_email: string
  role: string
  role_name: string
  message: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  invited_by_name: string
  created_at: string
  expires_at: string
}

export interface InvitationResponse {
  token: string
  action: 'accept' | 'decline'
  first_name?: string
  last_name?: string
  password?: string
  password_confirm?: string
}