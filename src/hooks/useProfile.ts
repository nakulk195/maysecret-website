import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/database';
import { Profile } from '../types';
import { getErrorMessage, withTimeout } from '../utils/safeAsync';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile when user changes
  useEffect(() => {
    let isActive = true;

    const load = async () => {
      if (!user) {
        if (isActive) {
          setProfile(null);
          setLoading(false);
          setError(null);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await withTimeout(
          profileService.getProfile(user.id),
          10000,
          'Profile load timed out'
        );
        if (isActive) setProfile(data);
      } catch (err: any) {
        if (isActive) {
          setError(getErrorMessage(err));
          setProfile(null);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [user]);

  const fetchProfile = async () => {
    if (user) {
      setLoading(true);
      setError(null);

      try {
        const data = await withTimeout(
          profileService.getProfile(user.id),
          10000,
          'Profile load timed out'
        );
        setProfile(data);
      } catch (err: any) {
        setError(getErrorMessage(err));
        setProfile(null);
      } finally {
        setLoading(false);
      }
    } else {
      setProfile(null);
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await withTimeout(
        profileService.updateProfile(user.id, updates),
        10000,
        'Profile update timed out'
      );
      setProfile(data);
      return data;
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (fullName: string, email: string, phone: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await withTimeout(
        profileService.createProfile(user.id, fullName, email, phone),
        10000,
        'Profile create timed out'
      );
      setProfile(data);
      return data;
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    createProfile
  };
};
