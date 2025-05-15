
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

// Define extended Event interface with formatting properties
export interface ExtendedEvent extends Event {
  formattedDate?: string;
  formattedTime?: string;
}

// We'll use the normal Event type from @/types, but our code will ensure
// that formattedDate and formattedTime properties are set before use
