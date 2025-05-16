
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

interface UseProfileDataResult {
  profile: UserProfile | null;
  loading: boolean;
  error: string;
  isNotFound: boolean;
  fetchProfileData: (forceRefetch?: boolean) => Promise<void>;
  refreshProfile: (forceRefresh?: boolean) => Promise<void>;
  updateProfile: (formData: any) => Promise<{ error: any }>;
}

export const useProfileData = (profileIdOrUsername?: string | null): UseProfileDataResult => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const fetchProfileData = async (forceRefetch = false) => {
    if (!profileIdOrUsername) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setIsNotFound(false);

    try {
      let query = supabase.from('profiles').select('*');
      
      // Check if the input is a UUID (Supabase user ID) or username
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(profileIdOrUsername);
      
      if (isUUID) {
        query = query.eq('id', profileIdOrUsername);
      } else {
        query = query.eq('username', profileIdOrUsername);
      }
      
      const { data, error: fetchError } = await query.single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // Code PGRST116 means no rows returned
          setIsNotFound(true);
          setError(`Profile not found for ${isUUID ? 'ID' : 'username'}: ${profileIdOrUsername}`);
        } else {
          setError(`Error fetching profile: ${fetchError.message}`);
        }
        setProfile(null);
      } else if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error: any) {
      console.error('Error in useProfileData:', error);
      setError(`Unexpected error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [profileIdOrUsername]);

  // Alias for fetchProfileData for compatibility
  const refreshProfile = fetchProfileData;

  const updateProfile = async (formData: any) => {
    try {
      if (!profile?.id) {
        throw new Error('No profile ID available for update');
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile.id);

      if (updateError) {
        return { error: updateError };
      }

      // Refresh the profile data after update
      await fetchProfileData(true);
      return { error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  return {
    profile,
    loading,
    error,
    isNotFound,
    fetchProfileData,
    refreshProfile,
    updateProfile
  };
};
