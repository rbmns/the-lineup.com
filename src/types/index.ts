
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string[] | null; // Using string[] to match DB structure
  location: string | null;
  status: string | null;
  tagline: string | null;
  status_details?: string | null;
  created_at?: string;
  updated_at?: string;
  location_category?: string | null;
}

export interface Venue {
  id: string;
  name: string;
  street: string;
  postal_code: string;
  city: string;
  website?: string;
  google_maps?: string;
  region?: string;
  tags?: string | null;
  slug?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location?: string;  // Adding back the location property as optional
  event_type?: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  image_urls?: string[];
  attendees?: {
    going: number;
    interested: number;
  };
  rsvp_status?: 'Going' | 'Interested';
  area?: {
    longitude: number;
    latitude: number;
  } | null;
  google_maps?: string | null;
  organizer_link?: string | null;
  organiser_name?: string | null; // Added new field for organiser name
  booking_link?: string | null;  // Adding booking_link property
  creator?: UserProfile | null;
  venues?: Venue | null;
  venue_id?: string;
  fee?: number;
  extra_info?: string;
  tags?: string[];
  coordinates?: [number, number]; // Adding coordinates property
  created_by?: string; // Adding created_by property
  vibe?: string | null; // Adding vibe property
  unique_id?: string; // Adding unique_id property to fix the error
  slug?: string; // Adding slug property to fix the error
  destination?: string; // Adding destination property for city-based URLs
  recurring_count?: number; // Adding recurring_count property to fix the error
  isExactMatch?: boolean; // Adding isExactMatch property for filtering
}

export interface FriendRequest {
  id: string;
  created_at: string;
  user_id: string;
  friend_id: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  profile?: UserProfile;
}
