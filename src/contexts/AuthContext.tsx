import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { User, Session } from '@supabase/supabase-js'
import { profileService } from '../services/database'
import { getErrorMessage, withTimeout } from '../utils/safeAsync'
import { clearAuthRelatedStorage, isBrowser, safeRemoveItem } from '../utils/safeStorage'

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
  signInWithGoogle: () => Promise<{ data: any; error: any }>
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  const buildProfileFromUser = useCallback((authUser: User) => {
    const metadata = authUser.user_metadata || {}
    const fullName = metadata.full_name ||
      metadata.name ||
      `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() ||
      authUser.email?.split('@')[0] ||
      'User'

    return {
      fullName,
      email: authUser.email || '',
      phone: metadata.phone || metadata.phone_number || ''
    }
  }, [])

  const ensureUserProfile = useCallback(async (authUser: User) => {
    const fallback = buildProfileFromUser(authUser)
    try {
      const existingProfile = await profileService.getProfile(authUser.id)
      if (!existingProfile) {
        return await profileService.createProfile(
          authUser.id,
          fallback.fullName,
          fallback.email,
          fallback.phone
        )
      }

      const needsBackfill = !existingProfile.email || !existingProfile.full_name
      if (needsBackfill) {
        return await profileService.updateProfile(authUser.id, {
          full_name: existingProfile.full_name || fallback.fullName,
          email: existingProfile.email || fallback.email,
          phone: existingProfile.phone || fallback.phone
        })
      }

      return existingProfile
    } catch (error) {
      console.error('Error ensuring profile:', error)
      return null
    }
  }, [buildProfileFromUser])

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      setLoading(true)
      try {
        const { data: { session } } = await withTimeout(
          supabase.auth.getSession(),
          10000,
          'Auth check timed out'
        )
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          const ensuredProfile = await withTimeout(
            ensureUserProfile(session.user),
            10000,
            'Profile check timed out'
          )
          setProfile(ensuredProfile)
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error('Error loading auth session:', getErrorMessage(error))
        setSession(null)
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true)
        try {
          setSession(session)
          setUser(session?.user ?? null)
          if (session?.user) {
            const ensuredProfile = await withTimeout(
              ensureUserProfile(session.user),
              10000,
              'Profile check timed out'
            )
            setProfile(ensuredProfile)
          } else {
            setProfile(null)
          }
          // Clear cart when user logs out to ensure clean state
          if (!session?.user) {
            safeRemoveItem('guest_cart')
          }
        } catch (error) {
          console.error(`Error handling auth event ${event}:`, getErrorMessage(error))
          setProfile(null)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [ensureUserProfile])

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone: string) => {
    try {
      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              phone: phone
            }
          }
        }),
        10000,
        'Signup timed out'
      )

      // If signup is successful, create profile
      if (data.user && !error) {
        try {
          const fullName = `${firstName} ${lastName}`.trim();
          await withTimeout(
            profileService.createProfile(
              data.user.id,
              fullName,
              email,
              phone
            ),
            10000,
            'Profile create timed out'
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
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password
        }),
        10000,
        'Login timed out'
      )

      // If login is successful, check if profile exists, create if not
      if (data.user && !error) {
        try {
          const existingProfile = await withTimeout(
            profileService.getProfile(data.user.id),
            10000,
            'Profile check timed out'
          );
          if (!existingProfile) {
            // Create profile if it doesn't exist
            const fullName = data.user.user_metadata?.full_name || 
                           `${data.user.user_metadata?.first_name || ''} ${data.user.user_metadata?.last_name || ''}`.trim() ||
                           data.user.email?.split('@')[0] || 'User';
            
            await withTimeout(
              profileService.createProfile(
                data.user.id,
                fullName,
                data.user.email || '',
                data.user.user_metadata?.phone || ''
              ),
              10000,
              'Profile create timed out'
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
    setLoading(true)
    try {
      await withTimeout(supabase.auth.signOut(), 10000, 'Logout timed out')
    } catch (error) {
      console.error('Error signing out:', getErrorMessage(error))
    } finally {
      setSession(null)
      setUser(null)
      setProfile(null)
      clearAuthRelatedStorage()
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await withTimeout(
        supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${isBrowser() ? window.location.origin : ''}/` }
        }),
        10000,
        'Google login timed out'
      )

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await withTimeout(
        supabase.auth.resetPasswordForEmail(email),
        10000,
        'Password reset timed out'
      )
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
          const profileData = await withTimeout(
            profileService.getProfile(user.id),
            10000,
            'Profile load timed out'
          );
          setProfile(profileData);
        } catch (error) {
          console.error('Error loading profile:', getErrorMessage(error));
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
      const profileData = await withTimeout(
        profileService.getProfile(userId),
        10000,
        'Profile load timed out'
      )
      setProfile(profileData)
    } catch (error) {
      console.error('Error fetching profile:', getErrorMessage(error))
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
    signInWithGoogle,
    fetchProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
