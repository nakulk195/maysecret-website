import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { User, Session } from '@supabase/supabase-js'
import { profileService } from '../services/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  profile: any | null
  signUp: (email: string, password: string, firstName: string, lastName: string, phone: string) => Promise<{ error: any; data: any }>
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any; data: any }>
  fetchProfile: (userId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        // Clear cart when user logs out to ensure clean state
        if (!session?.user) {
          localStorage.removeItem('guest_cart');
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone
          }
        }
      })

      // If signup is successful, create profile
      if (data.user && !error) {
        try {
          const fullName = `${firstName} ${lastName}`.trim();
          await profileService.createProfile(
            data.user.id,
            fullName,
            email,
            phone
          )
        } catch (profileError) {
          console.error('Error creating profile:', profileError)
          // Don't throw error here, let signup continue even if profile creation fails
        }
      }

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      // If login is successful, check if profile exists, create if not
      if (data.user && !error) {
        try {
          const existingProfile = await profileService.getProfile(data.user.id);
          if (!existingProfile) {
            // Create profile if it doesn't exist
            const fullName = data.user.user_metadata?.full_name || 
                           `${data.user.user_metadata?.first_name || ''} ${data.user.user_metadata?.last_name || ''}`.trim() ||
                           data.user.email?.split('@')[0] || 'User';
            
            await profileService.createProfile(
              data.user.id,
              fullName,
              data.user.email || '',
              data.user.user_metadata?.phone || ''
            );
          }
        } catch (profileError) {
          console.error('Error checking/creating profile on login:', profileError);
        }
      }

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update profile when user changes
  useEffect(() => {
    if (user) {
      // Load user profile
      const loadProfile = async () => {
        try {
          const profileData = await profileService.getProfile(user.id);
          setProfile(profileData);
        } catch (error) {
          console.error('Error loading profile:', error);
          // Don't set profile to null on error, keep existing state
        }
      };
      
      loadProfile();
    } else {
      setProfile(null);
    }
  }, [user])

  const fetchProfile = async (userId: string) => {
    try {
      const profileData = await profileService.getProfile(userId)
      setProfile(profileData)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    profile,
    signUp,
    signIn,
    signOut,
    resetPassword,
    fetchProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
