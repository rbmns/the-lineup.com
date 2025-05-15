import { Event } from '@/types';

export interface UseFetchRelatedEventsProps {
  eventType: string;
  currentEventId: string;
  userId?: string;
  tags?: string[];
  vibe?: string;
  minResults?: number;
  startDate?: string;
}

export interface RelatedEventsState {
  relatedEvents: Event[];
  loading: boolean;
}

export interface EventRsvpMap {
  [eventId: string]: 'Going' | 'Interested';
}

// We now use the Event type from @/types that has formattedDate and formattedTime properties
