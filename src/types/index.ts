
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string[] | null; // Must be string[] to match DB structure
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
  slug?: string; // Added missing property
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
  organiser_name?: string | null;
  booking_link?: string | null;
  creator?: UserProfile | null;
  venues?: Venue | null;
  venue_id?: string;
  fee?: number;
  extra_info?: string;
  tags?: string[];
  coordinates?: [number, number]; // Adding coordinates property
  created_by?: string; // Adding created_by property
  vibe?: string | null;
  unique_id?: string;
  slug?: string;
  destination?: string;
  recurring_count?: number;
  isExactMatch?: boolean;
  start_date?: string | null;
}

export interface FriendRequest {
  id: string;
  created_at: string;
  user_id: string;
  friend_id: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  profile?: UserProfile;
}
