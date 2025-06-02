
export interface CasualPlan {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  vibe: string;
  location: string;
  location_coordinates?: string;
  date: string;
  time: string;
  max_attendees?: number;
  created_at: string;
  updated_at: string;
  creator_profile?: {
    id: string;
    username: string;
    avatar_url?: string[];
  };
  attendees?: CasualPlanAttendee[];
  attendee_count?: number;
  user_attending?: boolean;
  // New RSVP fields to match events pattern
  rsvp_status?: 'Going' | 'Interested' | null;
  going_count?: number;
  interested_count?: number;
}

export interface CasualPlanAttendee {
  id: string;
  plan_id: string;
  user_id: string;
  created_at: string;
  user_profile?: {
    id: string;
    username: string;
    avatar_url?: string[];
  };
}

export interface CasualPlanRsvp {
  id: string;
  plan_id: string;
  user_id: string;
  status: 'Going' | 'Interested' | null;
  created_at: string;
  updated_at?: string;
}

export interface CreateCasualPlanData {
  title: string;
  description?: string;
  vibe: string;
  location: string;
  location_coordinates?: string;
  date: string;
  time: string;
  max_attendees?: number;
}

export const CASUAL_PLAN_VIBES = [
  'surf', 'party', 'chill', 'music', 'yoga', 'coffee', 'food', 'explore', 'beach', 'work'
] as const;

export type CasualPlanVibe = typeof CASUAL_PLAN_VIBES[number];
