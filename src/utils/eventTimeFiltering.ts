import { Event } from '@/types';

/**
 * Determines if an event should be visible based on its timing rules
 * - Fixed start time events: hidden after start time + 30 minutes
 * - Flexible events: hidden after end time (or start time + 4 hours if no end time)
 */
export const shouldShowEvent = (event: Event): boolean => {
  const now = new Date();
  
  // If no start_date or start_time, keep the event visible
  if (!event.start_date || !event.start_time) return true;
  
  // Create the event start datetime
  const eventStartDateTime = new Date(`${event.start_date}T${event.start_time}`);
  
  // Handle fixed start time events (yoga, classes, etc.)
  if (event.fixed_start_time) {
    // Hide fixed start time events 30 minutes after they start
    const cutoffTime = new Date(eventStartDateTime.getTime() + 30 * 60 * 1000);
    return now < cutoffTime;
  }
  
  // Handle flexible events (festivals, markets, etc.)
  // Show until end time, or if no end time, show until start + 4 hours
  let eventEndDateTime: Date;
  
  if (event.end_date && event.end_time) {
    eventEndDateTime = new Date(`${event.end_date}T${event.end_time}`);
  } else {
    // Default to 4 hours after start time if no end time specified
    eventEndDateTime = new Date(eventStartDateTime.getTime() + 4 * 60 * 60 * 1000);
  }
  
  return now < eventEndDateTime;
};

/**
 * Filters an array of events based on their timing rules
 */
export const filterEventsByTime = (events: Event[]): Event[] => {
  return events.filter(shouldShowEvent);
};
