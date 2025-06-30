import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

type UserProfileDB = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  onboarded: boolean | null;
  onboarding_data: string | null;
  role: string | null;
};

export const UserService = {
  /**
   * Get a user profile by ID
   */
  getUserProfile: async (userId: string): Promise<{ data: UserProfile | null, error: any }> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      // Transform the data to match the UserProfile interface
      const userProfile: UserProfile = {
        id: data.id,
        username: data.username,
        avatar_url: data.avatar_url ? [data.avatar_url] : null,
        email: null, // We don't have this in the profiles table
        location: null, // We don't have this in the profiles table
        location_category: null, // We don't have this in the profiles table
        status: null, // We don't have this in the profiles table
        tagline: null, // We don't have this in the profiles table
        status_details: null, // Set default value
        created_at: data.created_at,
        updated_at: data.updated_at,
        onboarded: data.onboarded,
        onboarding_data: data.onboarding_data,
        role: data.role
      };
      
      return { data: userProfile, error: null };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { data: null, error };
    }
  },
  
  /**
   * Update a user profile
   */
  updateUserProfile: async (userId: string, userData: Partial<UserProfile>): Promise<{ data: UserProfile | null, error: any }> => {
    try {
      // Transform the userData to match the database schema
      const dbUserData: Partial<UserProfileDB> = {
        ...userData,
        // Convert avatar_url from array to string if it exists
        avatar_url: userData.avatar_url && userData.avatar_url.length > 0 
          ? userData.avatar_url[0] 
          : null
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(dbUserData)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform back to UserProfile interface
      const userProfile: UserProfile = {
        id: data.id,
        username: data.username,
        avatar_url: data.avatar_url ? [data.avatar_url] : null,
        email: null,
        location: null,
        location_category: null,
        status: null,
        tagline: null,
        status_details: null, // Set default value
        created_at: data.created_at,
        updated_at: data.updated_at,
        onboarded: data.onboarded,
        onboarding_data: data.onboarding_data,
        role: data.role
      };
      
      return { data: userProfile, error: null };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { data: null, error };
    }
  },
  
  /**
   * Get user roles from the user_roles table
   */
  getUserRoles: async (userId: string): Promise<{ data: string[], error: any }> => {
    try {
      // Get roles from the user_roles table
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (error) throw error;

      // Map the array of objects to an array of strings
      const roles = data ? data.map(item => item.role) : [];
      
      return { 
        data: roles,
        error: null 
      };
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return { data: [], error };
    }
  },

  /**
   * Check if a user has a specific role using the has_role DB function
   */
  hasRole: async (userId: string, role: string): Promise<boolean> => {
    try {
      // Using the 'has_role' RPC function for an efficient check.
      const { data, error } = await supabase.rpc('has_role', {
        user_id: userId,
        role_name: role
      });

      if (error) {
        console.error('Error checking user role via rpc:', error);
        throw error;
      }
      
      return data || false;
    } catch (error) {
      console.error('Error in hasRole:', error);
      return false;
    }
  }
};
