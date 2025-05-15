
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types';

export const useProfileData = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshProfile: authRefreshProfile } = useAuth();
  const navigate = useNavigate();

  const fetchProfile = useCallback(async (forceRefresh: boolean = false) => {
    if (!userId) {
      console.error('User ID is missing');
      setLoading(false);
      return;
    }

    // Skip if we already have the profile data and don't need to force refresh
    if (profile && profile.id === userId && !forceRefresh) {
      console.log('Using cached profile data');
      setLoading(false);
      return;
    }

    try {
      console.log(`Fetching profile data for user: ${userId}`);
      setLoading(true);
      setError(null);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        
        if (profileError.code === 'PGRST116') {
          // No rows returned, profile doesn't exist
          toast({
            title: "User not found",
            description: "This user profile does not exist",
            variant: "destructive"
          });
          
          if (window.location.pathname === '/profile') {
            // If on own profile page but profile doesn't exist, try refreshing the auth profile
            await authRefreshProfile();
          }
        }
        
        setError(profileError.message);
        setProfile(null);
        setLoading(false);
        return;
      }

      console.log('Profile data fetched successfully:', profileData?.username);
      setProfile(profileData);
      setError(null);
    } catch (error: any) {
      console.error('Exception fetching profile:', error);
      setError(error.message || 'Could not load user profile');
      setProfile(null);
      toast({
        title: "Error",
        description: "Could not load user profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, authRefreshProfile, profile]);

  // Fetch profile on mount or when userId changes
  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [fetchProfile, userId]);

  // Expose refreshProfile function so it can be called from outside
  const refreshProfile = useCallback((forceRefresh: boolean = true) => {
    console.log("Refreshing profile data...");
    return fetchProfile(forceRefresh);
  }, [fetchProfile]);

  // Function to update profile
  const updateProfile = useCallback(async (formData: any) => {
    if (!userId) {
      const errorMsg = "Cannot update: User ID is missing";
      setError(errorMsg);
      return { error: new Error(errorMsg) };
    }

    try {
      // Remove the location_category field if it exists in the form data
      const { location_category, ...dataToUpdate } = formData;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(dataToUpdate)
        .eq('id', userId);

      if (updateError) {
        setError(updateError.message);
        return { error: updateError };
      }

      // Refresh profile data after update
      await fetchProfile(true);
      return { error: null };
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
      return { error };
    }
  }, [userId, fetchProfile]);

  return { profile, loading, error, refreshProfile, updateProfile };
};
