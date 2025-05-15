
import { Event } from '@/types';

export type FormValues = {
  title: string;
  description: string;
  event_type: string;
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
};

export type SafeEventData = {
  id?: string;
  title?: string;
  description?: string;
  event_type?: string;
  start_time?: string;
  end_time?: string;
  venue_id?: string;
  organizer_link?: string;
  fee?: number; // Changed from string | number to number to match Event type
  booking_link?: string;
  extra_info?: string;
  tags?: string[] | string;
  created_by?: string; // Added this property to match usage in EventFormUtils.ts
  slug?: string; // Added slug property to fix the TypeScript error
};

export interface EventFormProps {
  eventId?: string;
  isEditMode?: boolean;
}

export const EVENT_TYPES = [
  'music', 'art', 'food', 'tech', 'sports',
  'community', 'business', 'education', 'wellness',
  'outdoor', 'social', 'networking', 'other'
];
