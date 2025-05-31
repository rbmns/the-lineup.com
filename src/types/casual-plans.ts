
export interface CasualPlan {
  id: string;
  title: string;
  description?: string;
  location: string;
  location_coordinates?: string;
  date: string;
  time: string;
  vibe: string;
  max_attendees?: number;
  creator_id: string;
  created_at: string;
  updated_at: string;
  
  // Enhanced fields
  creator_profile?: {
    id: string;
    username: string;
    avatar_url?: string[];
  };
  attendee_count?: number;
  interested_count?: number;
  user_attending?: boolean;
  user_interested?: boolean;
}

export interface CreateCasualPlanData {
  title: string;
  description?: string;
  location: string;
  location_coordinates?: string;
  date: string;
  time: string;
  vibe: string;
  max_attendees?: number;
}
