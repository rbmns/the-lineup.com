
import { Event } from '@/types';
import { EVENT_CATEGORIES, EVENT_VIBES } from '@/utils/categorySystem';

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
  event_category?: string; // Updated from event_type
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

export const EVENT_TYPES = EVENT_CATEGORIES; // For backwards compatibility

export { EVENT_CATEGORIES, EVENT_VIBES };
