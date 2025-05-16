
import { UserProfile } from '@/types';

/**
 * Converts a profile with string avatar_url to our UserProfile type with string[] avatar_url
 */
export function normalizeUserProfile(profile: any): UserProfile {
  if (!profile) return null as unknown as UserProfile;
  
  // Handle avatar_url conversion from string to string[]
  let avatarUrl = null;
  if (profile.avatar_url) {
    avatarUrl = Array.isArray(profile.avatar_url) 
      ? profile.avatar_url 
      : [profile.avatar_url];
  }
  
  return {
    ...profile,
    avatar_url: avatarUrl,
  } as UserProfile;
}

/**
 * Gets the initials from a name or username
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return name.substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Processes image URLs to ensure they are in the correct format
 */
export function processImageUrls(url: string | string[] | null): string[] {
  if (!url) return [];
  
  if (typeof url === 'string') {
    return [url];
  }
  
  return Array.isArray(url) ? url : [];
}
