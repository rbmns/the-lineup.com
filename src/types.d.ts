
export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string[] | null; // Changed to string[] to be consistent with types/index.ts
  email: string | null;
  location: string | null;
  location_category: string | null;
  status: string | null;
  status_details?: string | null; // Added to match other UserProfile
  tagline: string | null;
  created_at?: string; // Added to match other UserProfile
  updated_at?: string; // Added to match other UserProfile
  onboarded?: boolean | null;
  onboarding_data?: string | null;
  role?: string | null;
}

export interface Venue {
  id: string;
  name: string;
  street: string;
  postal_code: string;
  city: string;
  website?: string | null;
  google_maps?: string | null;
  region?: string | null;
  tags?: string[] | null;
  slug?: string | null;
}

// Update the Event type definition to include all required fields
export interface Event {
  id: string;
  title: string;
  description: string;
  location?: string;
  event_category?: string; // Changed from event_type to event_category
  start_time: string | null;
  end_time?: string | null;
  start_date?: string | null;
  end_date?: string | null; // Added end_date property for multi-day events
  created_at?: string;
  updated_at?: string;
  image_urls: string[];
  attendees: {
    going: number;
    interested: number;
  };
  rsvp_status?: 'Interested' | 'Going' | null;
  area?: string | null;
  google_maps?: string | null;
  organizer_link?: string | null;
  creator?: UserProfile | null;
  venues?: Venue | null;
  extra_info?: string | null;
  fee?: number;
  venue_id?: string;
  tags?: string[];
  destination?: string;
  slug?: string;
  recurring_count?: number;
  isQueryOnly?: boolean;
  booking_link?: string | null;
  organiser_name?: string | null;
  vibe?: string | null;
  coordinates?: [number, number]; 
  created_by?: string;
  going_count?: number;
  interested_count?: number;
  formattedDate?: string; // Add the missing property
  formattedTime?: string; // Add the missing property
}

export interface EventsResponse {
  data: Event[] | null;
  error: any;
}
