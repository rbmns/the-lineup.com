
import { Database } from './supabase';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string[] | null;
  location: string | null;
  status: string | null;
  tagline: string | null;
  status_details: string | null;
  created_at: string;
  updated_at: string;
  location_category: string | null;
  location_coordinates?: string;
  location_lat?: number;
  location_long?: number;
  onboarded?: boolean | null;
  onboarding_data?: string | null;
  role?: string | null;
}

// Export UserProfile as an alias for Profile to maintain compatibility
export type UserProfile = Profile;

export interface Venue {
  id: string;
  created_at?: string;
  name: string | null;
  street: string | null;
  city: string | null;
  country: string | null;
  postal_code?: string | null;
  website?: string | null;
  google_maps?: string | null;
  slug?: string | null;
  region?: string | null;
  tags?: string[] | null;
  creator_id?: string | null;
  address?: string | null;
  coordinates?: [number, number] | null;
  latitude?: number | null;
  longitude?: number | null;
  google_place_id?: string | null;
}

export interface Event {
  id: string;
  title?: string | null;
  description?: string | null;
  start_date?: string | null;
  start_time?: string | null;
  end_date?: string | null;
  end_time?: string | null;
  start_datetime?: string | null;  // New timestamptz field
  end_datetime?: string | null;    // New timestamptz field
  timezone?: string;
  venue_id?: string | null;
  venues?: Venue | null;
  location?: string | null;
  creator?: Profile | null;
  created_at?: string | null;
  updated_at?: string | null;
  status?: string;
  event_category?: string | null;
  vibe?: string | null;
  image_urls?: string[] | null;
  booking_link?: string | null;
  organizer_link?: string | null;
  organiser_name?: string | null;
  fee?: number | string | null;
  tags?: string[] | string | null;
  extra_info?: string | null;
  rsvp_status?: 'Going' | 'Interested' | null;
  slug?: string | null;
  coordinates?: [number, number] | null;
  google_maps?: string | null;
  area?: string | null;
  destination?: string | null;
  recurring_count?: number | null;
  fixed_start_time?: boolean | null;
  organizer_email_internal?: string | null;
  created_by?: string | null;
  attendees?: {
    going: number;
    interested: number;
  };
  rsvp_count?: number;
  going_count?: number;
  interested_count?: number;
  isQueryOnly?: boolean;
  formattedDate?: string;
  formattedTime?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Vibe {
  id: number;
  name: string;
  slug: string;
}

export interface AdminNotification {
  id: string;
  created_at?: string;
  type: string | null;
  event_id: string | null;
  event?: Event | null;
  user_id: string | null;
  profile?: Profile | null;
  message: string | null;
  status: string | null;
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

export interface EventsResponse {
  data: Event[] | null;
  error: any;
}

export type EventType = Database['public']['Tables']['events']['Row']
export type VenueType = Database['public']['Tables']['venues']['Row']
export type ProfileType = Database['public']['Tables']['profiles']['Row']
