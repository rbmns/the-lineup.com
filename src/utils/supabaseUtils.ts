/**
 * Utility functions for working with Supabase
 */
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

// Type helper for safely handling Supabase query responses
export type SafeResponse<T> = T & { [key: string]: any };

/**
 * Safely converts a value to an array for use with Supabase's .in() method
 * @param value - The value to convert (string, array, or null/undefined)
 * @returns An array suitable for use with .in()
 */
export function toSupabaseArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

/**
 * Safely handle type errors when dealing with Supabase responses
 * @param responseData - The data from a Supabase operation
 * @returns The data safely typed
 */
export function safeData<T>(responseData: T | null): T[] {
  if (!responseData) return [] as unknown as T[];
  return Array.isArray(responseData) ? responseData : [responseData];
}

/**
 * Creates a type-safe filter for Supabase queries
 * @param column - The column name
 * @param value - The value to filter by
 * @returns The column and value as a type-safe object for Supabase
 */
export function createFilter<T extends string, V>(column: T, value: V) {
  return { column, value } as const;
}

/**
 * Handle data safely from Supabase response or return a default value
 */
export function ensureData<T>(data: any, defaultValue: T): T {
  if (!data) return defaultValue;
  return data as T;
}

/**
 * Safely check if a response has data before accessing its properties
 */
export function hasData(response: any): boolean {
  return response && !response.error && response.data !== null;
}

/**
 * Type-safe assertion for Supabase operations
 */
export const typeAssert = {
  /**
   * Assert a value as a specific type for update operations
   */
  forUpdate: <T>(data: any): T => data as T,
  
  /**
   * Assert a value as a specific type for insert operations
   */
  forInsert: <T>(data: any): T => data as T,
  
  /**
   * Assert the response from Supabase
   */
  response: <T>(response: any): T => {
    if (response?.error) {
      console.error('Supabase error:', response.error);
    }
    return (response?.data || []) as T;
  },
};

/**
 * Helper to safely handle friendship data
 */
export function processFriendshipData(data: any): any {
  if (!data) return [];
  
  // Make a safe copy to work with
  const safeData = Array.isArray(data) ? [...data] : [data];
  
  return safeData.map(item => {
    // Ensure the item exists
    if (!item) return null;
    
    // Return the item safely
    return {
      id: item.id || '',
      created_at: item.created_at || new Date().toISOString(),
      user_id: item.user_id || '',
      friend_id: item.friend_id || '',
      status: item.status || 'Pending'
    };
  }).filter(Boolean);
}

/**
 * Helper to safely handle RSVP data
 */
export function processRsvpData(data: any): any {
  if (!data) return {};
  
  // Handle array data
  if (Array.isArray(data)) {
    return data.reduce((acc, item) => {
      if (item && item.event_id && item.status) {
        acc[item.event_id] = item.status;
      }
      return acc;
    }, {} as Record<string, string>);
  }
  
  // Handle single item
  if (data.event_id && data.status) {
    return {
      [data.event_id]: data.status
    };
  }
  
  return {};
}

/**
 * Type-safe helper for handling Supabase responses
 * Ensures Supabase response data is properly typed and checked for errors
 */
export function handleSupabaseResponse<T>(response: { data: any, error: any }): T | null {
  if (response.error) {
    console.error("Supabase error:", response.error);
    return null;
  }
  
  return response.data as T;
}

/**
 * Safe type guard to check if a response is valid before using it
 */
export function isValidResponse<T>(data: any): data is T {
  return data !== null && typeof data === 'object' && !('error' in data);
}

/**
 * Safe converter for Supabase profiles data to UserProfile
 */
export function toUserProfile(data: any): UserProfile | null {
  if (!data) return null;
  
  try {
    return {
      id: data.id || '',
      username: data.username || '',
      email: data.email || '',
      avatar_url: data.avatar_url || null,
      location: data.location || null,
      status: data.status || null,
      tagline: data.tagline || null,
      status_details: data.status_details || null,
      created_at: data.created_at || '',
      updated_at: data.updated_at || '',
      location_category: data.location_category || null
    };
  } catch (e) {
    console.error('Error converting to UserProfile:', e);
    return null;
  }
}

/**
 * Convert array of response data to UserProfile array
 */
export function toUserProfiles(data: any[] | null): UserProfile[] {
  if (!data) return [];
  return data.map(toUserProfile).filter((item): item is UserProfile => item !== null);
}

/**
 * Type-safe eq filter for Supabase queries
 * Helps avoid type issues with the string parameters
 */
export function safeEq(supabaseQuery: any, column: string, value: any) {
  try {
    return supabaseQuery.eq(column, value);
  } catch (error) {
    console.error(`Error applying eq filter on column ${column}:`, error);
    return supabaseQuery; // Return original query if there's an error
  }
}

/**
 * Type-safe in filter for Supabase queries
 */
export function safeIn(supabaseQuery: any, column: string, values: any[]) {
  try {
    return supabaseQuery.in(column, values);
  } catch (error) {
    console.error(`Error applying in filter on column ${column}:`, error);
    return supabaseQuery; // Return original query if there's an error
  }
}

/**
 * Fix for row-level security policy issues with profiles
 */
export async function ensureUserProfileExists(userId: string, email: string, username: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking profile:", error);
      return false;
    }
    
    if (!data) {
      console.log("Creating profile for user:", userId);
      
      // Use proper typing and handle as a raw insert
      const profileData = {
        id: userId,
        username: username || email.split('@')[0],
        email: email,
        avatar_url: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert(profileData);
        
      if (insertError) {
        console.error("Error creating profile:", insertError);
        return false;
      }
      
      console.log("Profile created successfully");
      return true;
    }
    
    console.log("Profile already exists");
    return true;
  } catch (err) {
    console.error("Exception in ensureUserProfileExists:", err);
    return false;
  }
}

/**
 * Generate a default user profile object with safe defaults
 */
export function createDefaultUserProfile(userId: string, email?: string, username?: string): UserProfile {
  return {
    id: userId || '',
    username: username || (email ? email.split('@')[0] : 'User'),
    email: email || '',
    avatar_url: null,
    location: null,
    status: null,
    tagline: null,
    status_details: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    location_category: null
  };
}

/**
 * Safe type cast for Supabase query parameters
 */
export function asParam<T>(value: T): T {
  // This is just for documentation purposes
  return value;
}

/**
 * Safe handler for Supabase query responses
 */
export function safeFetchProfile(profileData: any): UserProfile | null {
  if (!profileData) return null;
  
  // Always ensure we handle potential errors and missing data safely
  try {
    return {
      id: profileData.id || '',
      username: profileData.username || '',
      email: profileData.email || '',
      avatar_url: profileData.avatar_url || null,
      location: profileData.location || null,
      status: profileData.status || null,
      tagline: profileData.tagline || null,
      status_details: profileData.status_details || null, // Include status_details
      created_at: profileData.created_at || '',
      updated_at: profileData.updated_at || '',
      location_category: profileData.location_category || null
    };
  } catch (e) {
    console.error('Error handling profile data:', e);
    return null;
  }
}
