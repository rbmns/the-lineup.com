
export interface UserProfile {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string[] | null; // Must be string[] to match DB structure
  location: string | null;
  status: string | null;
  tagline: string | null;
  status_details?: string | null;
  created_at?: string;
  updated_at?: string;
  location_category?: string | null; // Made optional with ? to match types.d.ts
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
  slug?: string | null; // Added missing property
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location?: string;  // Adding back the location property as optional
  event_type?: string;
  start_time: string | null;
  end_time?: string | null;
  created_at?: string;
  updated_at?: string;
  image_urls?: string[];
  attendees?: {
    going: number;
    interested: number;
  };
  rsvp_status?: 'Going' | 'Interested' | null;
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
  extra_info?: string | null;
  tags?: string[];
  coordinates?: [number, number]; 
  created_by?: string; 
  vibe?: string | null;
  unique_id?: string;
  slug?: string;
  destination?: string;
  recurring_count?: number;
  isExactMatch?: boolean;
  start_date?: string | null;
  cover_image?: string | null;
  share_image?: string | null;
  user_rsvp_status?: 'Going' | 'Interested' | null;
  
  // Adding the missing properties related to RSVP counts
  going_count?: number;
  interested_count?: number;
  
  // Add formatted date and time properties to the Event interface
  formattedDate?: string;
  formattedTime?: string;
}

export interface EventImage {
  id: string;
  url: string;
  alt?: string;
  type: 'cover' | 'gallery' | 'share';
}

export interface FriendRequest {
  id: string;
  created_at: string;
  user_id: string;
  friend_id: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  profile?: UserProfile;
}

// Adding a Profile type to fix the import issues
export type Profile = UserProfile;
