
import { UserProfile as UserProfileType } from './'; // Self-reference for aliasing

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string[];
  email?: string;
  location?: string;
  location_category?: string;
  location_coordinates?: string;
  location_lat?: number;
  location_long?: number;
  status?: string;
  status_details?: string;
  tagline?: string;
  created_at?: string;
  updated_at?: string;
}

// Export UserProfile as an alias for Profile to maintain compatibility
export type UserProfile = Profile;

export interface Venue {
  id: string;
  name?: string;
  street?: string;
  postal_code?: string;
  city?: string;
  website?: string;
  google_maps?: string;
  slug?: string;
  created_at?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  location?: string;
  venue_id?: string;
  venues?: Venue;
  creator?: Profile;
  event_category?: string;
  tags?: string;
  image_urls?: string[];
  booking_link?: string;
  organizer_link?: string;
  fee?: number;
  vibe?: string;
  destination?: string;
  organiser_name?: string;
  rsvp_status?: 'Going' | 'Interested' | null;
  rsvp_count?: number;
  going_count?: number;
  interested_count?: number;
  created_at?: string;
  updated_at?: string;
  fixed_start_time?: boolean;
}

export interface EventRsvp {
  id: string;
  event_id: string;
  user_id: string;
  status: 'Going' | 'Interested' | null;
  created_at?: string;
  updated_at?: string;
}

export interface SearchTracking {
  id: string;
  query: string;
  result_id: string | null;
  result_type: string | null;
  timestamp: string;
  user_id: string | null;
  clicked: boolean | null;
}
