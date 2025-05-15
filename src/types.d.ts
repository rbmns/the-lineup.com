
export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  email: string | null;
  location: string | null;
  location_category: string | null;
  status: string | null;
  tagline: string | null;
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
  slug?: string | null; // Added missing property
}

// Add or update the Event type definition to include the new fields
export interface Event {
  id: string;
  title: string;
  description: string;
  location?: string;
  event_type: string;
  start_time: string | null;
  end_time?: string | null;
  start_date?: string | null;  // New field for the date portion
  created_at?: string;
  updated_at?: string;
  image_urls: string[];
  attendees: {
    going: number;
    interested: number;
  };
  rsvp_status?: 'Interested' | 'Going';
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
  booking_link?: string | null; // Added missing property
  organiser_name?: string | null; // Added missing property
  vibe?: string | null; // Added missing property
}

export interface EventsResponse {
  data: Event[] | null;
  error: any;
}
