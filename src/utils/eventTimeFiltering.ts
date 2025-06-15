
import { Event } from '@/types';

/**
 * Determines if an event should be visible based on its timing rules
 * - Fixed start time events: hidden after start time + 30 minutes
 * - Flexible events: hidden after end time (or start time + 4 hours if no end time)
 */
export const shouldShowEvent = (event: Event): boolean => {
  const now = new Date();
  
  if (!event.start_date) {
    return true; // Keep events without a start date (e.g., drafts)
  }

  // If no start_time is provided, treat it as an all-day event for the given date(s).
  if (!event.start_time) {
    const eventEndDate = event.end_date ? new Date(event.end_date) : new Date(event.start_date);
    eventEndDate.setHours(23, 59, 59, 999); // Event is visible until the very end of its last day.
    return now <= eventEndDate;
  }
  
  const eventStartDateTime = new Date(`${event.start_date}T${event.start_time}`);
  
  // If parsing results in an invalid date, we can't filter by time. Fallback to date check.
  if (isNaN(eventStartDateTime.getTime())) {
    const eventEndDate = event.end_date ? new Date(event.end_date) : new Date(event.start_date);
    eventEndDate.setHours(23, 59, 59, 999);
    return now <= eventEndDate;
  }

  // Handle fixed start time events (e.g., classes)
  if (event.fixed_start_time) {
    // Hide these events 30 minutes after they start
    const cutoffTime = new Date(eventStartDateTime.getTime() + 30 * 60 * 1000);
    return now < cutoffTime;
  }
  
  // Handle flexible events (e.g., festivals, markets)
  let eventEndDateTime: Date;
  
  if (event.end_date && event.end_time) {
    eventEndDateTime = new Date(`${event.end_date}T${event.end_time}`);
  } else if (event.end_date) {
    // If there's an end_date but no end_time, assume it ends at the end of that day.
    eventEndDateTime = new Date(event.end_date);
    eventEndDateTime.setHours(23, 59, 59, 999);
  }
   else {
    // If no end date/time, default to 4 hours after start time
    eventEndDateTime = new Date(eventStartDateTime.getTime() + 4 * 60 * 60 * 1000);
  }

  // Fallback for invalid end datetime
  if (isNaN(eventEndDateTime.getTime())) {
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
