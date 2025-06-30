export interface Profile {
  id: string;
  username: string | null;
  avatar_url?: string[] | null;
  email?: string | null;
  location?: string | null;
  location_category?: string | null;
  location_coordinates?: string;
  location_lat?: number;
  location_long?: number;
  status?: string | null;
  status_details?: string | null;
  tagline?: string | null;
  created_at?: string;
  updated_at?: string;
  onboarded?: boolean | null;
  onboarding_data?: string | null;
  role?: string | null;
}

// Export UserProfile as an alias for Profile to maintain compatibility
export type UserProfile = Profile;

export interface Venue {
  id: string;
  name?: string;
  street?: string;
  postal_code?: string;
  city?: string;
  website?: string | null;
  google_maps?: string | null;
  slug?: string | null;
  created_at?: string;
  region?: string | null;
  tags?: string[] | null;
  creator_id?: string | null;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_date?: string | null;
  start_time?: string | null;
  end_date?: string | null;
  end_time?: string | null;
  location?: string;
  venue_id?: string;
  venues?: Venue | null;
  creator?: Profile | null;
  event_category?: string;
  tags?: string[] | string | null;
  image_urls?: string[];
  booking_link?: string | null;
  organizer_link?: string | null;
  fee?: number;
  vibe?: string | null;
  destination?: string;
  organiser_name?: string | null;
  status?: 'draft' | 'pending_approval' | 'published' | 'rejected';
  rsvp_status?: 'Going' | 'Interested' | null;
  rsvp_count?: number;
  going_count?: number;
  interested_count?: number;
  created_at?: string;
  updated_at?: string;
  fixed_start_time?: boolean;
  attendees?: {
    going: number;
    interested: number;
  };
  area?: string | null;
  google_maps?: string | null;
  extra_info?: string | null;
  slug?: string;
  recurring_count?: number;
  isQueryOnly?: boolean;
  coordinates?: [number, number];
  created_by?: string;
  formattedDate?: string;
  formattedTime?: string;
  timezone?: string | null;
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
