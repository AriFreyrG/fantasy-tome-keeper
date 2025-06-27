import { createClient } from './supabase/client'
import type { AuthUser, UserProfile } from '@/types'

// Client-side auth utilities
export const authClient = {
  // Sign up with email and password
  async signUp(email: string, password: string, displayName?: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName ?? email.split('@')[0]
        }
      }
    })
    
    return { data, error }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    return { data, error }
  },

  // Sign out
  async signOut() {
    const supabase = createClient()
    
    const { error } = await supabase.auth.signOut()
    
    return { error }
  },

  // Get current session
  async getSession() {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.getSession()
    
    return { data, error }
  },

  // Get current user
  async getUser() {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.getUser()
    
    return { data, error }
  },

  // Reset password
  async resetPassword(email: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
    })
    
    return { data, error }
  },

  // Update password
  async updatePassword(password: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    
    return { data, error }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = createClient()
    
    return supabase.auth.onAuthStateChange(callback)
  }
}

// User profile utilities
export const userProfileService = {
  // Get user profile
  async getProfile(userId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  },

  // Create user profile
  async createProfile(userId: string, profile: Partial<UserProfile>) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        ...profile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .single()
    
    return { data, error }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .single()
    
    return { data, error }
  },

  // Delete user profile
  async deleteProfile(userId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId)
    
    return { data, error }
  }
}

// Auth guards and helpers
export const authHelpers = {
  // Check if user is authenticated
  isAuthenticated(user: AuthUser | null): user is AuthUser {
    return user !== null
  },

  // Redirect to login if not authenticated
  requireAuth(user: AuthUser | null): AuthUser {
    if (!this.isAuthenticated(user)) {
      throw new Error('Authentication required')
    }
    return user
  },

  // Get user initials for avatar
  getUserInitials(displayName?: string, email?: string): string {
    if (displayName) {
      return displayName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    
    if (email) {
      return email.charAt(0).toUpperCase()
    }
    
    return 'U'
  },

  // Format user display name
  getDisplayName(profile?: UserProfile, user?: AuthUser): string {
    if (profile?.display_name) {
      return profile.display_name
    }
    
    if (user?.email) {
      return user.email.split('@')[0]
    }
    
    return 'User'
  }
}
