
import { Event } from '@/types';

export type FormValues = {
  title: string;
  description: string;
  event_category: string;
  start_date: Date;
  start_time: string;
  end_date: Date;
  end_time: string;
  venue_id: string;
  organizer_link: string;
  fee: string;
  booking_link: string;
  extra_info: string;
  tags: string;
  vibe?: string;
};

export type SafeEventData = {
  id?: string;
  title?: string;
  description?: string;
  event_category?: string; // Changed from event_type to event_category
  start_time?: string;
  end_time?: string;
  start_date?: string;
  venue_id?: string;
  organizer_link?: string;
  fee?: number;
  booking_link?: string;
  extra_info?: string;
  tags?: string[] | string;
  created_by?: string;
  slug?: string;
  vibe?: string;
};

export interface EventFormProps {
  eventId?: string;
  isEditMode?: boolean;
}

export const EVENT_CATEGORIES = [
  'festival', 'wellness', 'kite', 'beach', 'game', 'other',
  'sports', 'surf', 'party', 'yoga', 'community', 'music',
  'food', 'market', 'art'
];

export const EVENT_VIBES = [
  'party', 'chill', 'wellness', 'active', 'social', 'creative'
];
