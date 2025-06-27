'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { userProfileService } from '@/lib/auth'
import type { UserProfile } from '@/types'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  const loadProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await userProfileService.getProfile(userId)
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading profile:', error)
        return
      }
      
      if (!data) {
        // Create a default profile if it doesn't exist
        const defaultProfile: Partial<UserProfile> = {
          display_name: user?.user_metadata?.display_name ?? user?.email?.split('@')[0],
          reading_goal: 0,
          theme_preference: 'auto',
          default_view: 'grid',
          show_spoilers: false,
          notifications_enabled: true
        }
        
        const { data: newProfile } = await userProfileService.createProfile(userId, defaultProfile)
        setProfile(newProfile)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error in loadProfile:', error)
    }
  }, [user?.user_metadata?.display_name, user?.email])

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }, [user, loadProfile])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }, [supabase.auth])

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (mounted) {
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadProfile(session.user.id)
        }
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [loadProfile, supabase.auth])

  const contextValue = useMemo(() => ({
    user,
    profile,
    loading,
    signOut,
    refreshProfile
  }), [user, profile, loading, signOut, refreshProfile])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
