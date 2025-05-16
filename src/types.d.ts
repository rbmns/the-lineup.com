
export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null; // Changed from string[] to string
  email: string | null;
  location: string | null;
  location_category: string | null;
  status: string | null;
  status_details?: string | null;
  tagline: string | null;
  created_at?: string;
  updated_at?: string;
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

export interface Event {
  id: string;
  title: string;
  description: string;
  location?: string;
  event_type: string;
  start_time: string | null;
  end_time?: string | null;
  start_date?: string | null;
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
  formattedDate?: string;
  formattedTime?: string;
  user_rsvp_status?: 'Interested' | 'Going' | null;
}

export interface EventsResponse {
  data: Event[] | null;
  error: any;
}
