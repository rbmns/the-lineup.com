import { Event } from '@/types';
import { DateRange } from 'react-day-picker';
import { 
  addDays, 
  isSameDay, 
  isWithinInterval, 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek,
  compareAsc
} from 'date-fns';
import { isDateInEventRange } from '@/utils/event-date-utils';

/**
 * Checks if an event is upcoming or currently ongoing.
 */
export const isUpcomingEvent = (event: Event): boolean => {
  const now = new Date();
  const today = startOfDay(now);

  if (!event.start_date) {
    return true; // Keep events without a start date (e.g., drafts)
  }

  const eventStartDate = startOfDay(new Date(event.start_date));

  // For multi-day events, check if the event has already ended
  if (event.end_date) {
    const eventEndDate = endOfDay(new Date(event.end_date));
    return eventEndDate >= today;
  }
  
  // For single-day events, check if start date is not in the past
  return eventStartDate >= today;
};

/**
 * Filters upcoming events (events with start date in the future or ongoing multi-day events)
 */
export const filterUpcomingEvents = (events: Event[]): Event[] => {
  return events.filter(isUpcomingEvent);
};

/**
 * Filters past events (events with start date in the past and not ongoing)
 */
export const filterPastEvents = (events: Event[]): Event[] => {
  const now = new Date();
  const today = startOfDay(now);
  
  return events.filter(event => {
    // If no start_date, exclude the event
    if (!event.start_date) return false;
    
    // For multi-day events, check if the event has completely ended
    if (event.end_date) {
      const endDate = new Date(event.end_date);
      return endDate < today;
    }
    
    // Convert to Date object if it's a string
    const eventDate = typeof event.start_date === 'string' 
      ? new Date(event.start_date) 
      : event.start_date;
      
    // Keep events that are in the past
    return eventDate < today;
  });
};

/**
 * Sort events by date (ascending)
 */
export const sortEventsByDate = (events: Event[]): Event[] => {
  return [...events].sort((a, b) => {
    if (!a.start_date) return 1;
    if (!b.start_date) return -1;
    
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    
    return compareAsc(dateA, dateB);
  });
};

/**
 * Checks if an event matches a date filter (handles multi-day events)
 */
const eventMatchesDateFilter = (event: Event, targetDate: Date): boolean => {
  if (!event.start_date) return false;
  
  // For multi-day events, check if the target date falls within the range
  if (event.end_date) {
    return isDateInEventRange(targetDate, event);
  }
  
  // For single-day events, check exact match
  const eventDate = new Date(event.start_date);
  return isSameDay(eventDate, targetDate);
};

/**
 * Checks if an event falls within a date interval (handles multi-day events)
 */
const eventMatchesDateInterval = (event: Event, start: Date, end: Date): boolean => {
  if (!event.start_date) return false;
  
  const eventStart = new Date(event.start_date);
  const eventEnd = event.end_date ? new Date(event.end_date) : eventStart;
  
  // Check if there's any overlap between the event period and the target interval
  return eventStart <= end && eventEnd >= start;
};

/**
 * Filters events by date criteria (handles multi-day events)
 */
export const filterEventsByDate = (
  events: Event[], 
  dateFilter: string,
  dateRange?: DateRange
): Event[] => {
  if (!dateFilter && !dateRange) return events;
  
  const now = new Date();
  
  // If custom date range is selected
  if (dateRange?.from) {
    const from = startOfDay(dateRange.from);
    const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
    
    return events.filter(event => eventMatchesDateInterval(event, from, to));
  }
  
  // If predefined date filter is selected
  switch (dateFilter.toLowerCase()) {
    case 'today':
      return events.filter(event => eventMatchesDateFilter(event, now));
      
    case 'tomorrow':
      return events.filter(event => eventMatchesDateFilter(event, addDays(now, 1)));
      
    case 'this week':
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);
      return events.filter(event => eventMatchesDateInterval(event, weekStart, weekEnd));
      
    case 'this weekend':
      // Define weekend as Saturday and Sunday
      const saturday = addDays(startOfWeek(now), 5);
      const sunday = addDays(startOfWeek(now), 6);
      return events.filter(event => 
        eventMatchesDateFilter(event, saturday) || eventMatchesDateFilter(event, sunday)
      );
      
    case 'next week':
      const nextWeekStart = addDays(startOfWeek(now), 7);
      const nextWeekEnd = addDays(endOfWeek(now), 7);
      return events.filter(event => eventMatchesDateInterval(event, nextWeekStart, nextWeekEnd));
      
    case 'later':
      const twoWeeksFromNow = addDays(now, 14);
      return events.filter(event => {
        if (!event.start_date) return false;
        const eventDate = new Date(event.start_date);
        return eventDate > twoWeeksFromNow;
      });
      
    default:
      return events;
  }
};

// Alias for filterEventsByDate for backwards compatibility
export const filterEventsByDateFilter = filterEventsByDate;

export const filterEventsByDateRange = (event: Event, dateFilter: string, dateRange?: DateRange): boolean => {
  if (!dateFilter && !dateRange) return true;
  
  const now = new Date();
  
  // If custom date range is selected
  if (dateRange?.from) {
    const from = startOfDay(dateRange.from);
    const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
    
    return eventMatchesDateInterval(event, from, to);
  }
  
  // If predefined date filter is selected
  switch (dateFilter.toLowerCase()) {
    case 'today':
      return eventMatchesDateFilter(event, now);
      
    case 'tomorrow':
      return eventMatchesDateFilter(event, addDays(now, 1));
      
    case 'this week':
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);
      return eventMatchesDateInterval(event, weekStart, weekEnd);
      
    case 'this weekend':
      // Define weekend as Saturday and Sunday
      const saturday = addDays(startOfWeek(now), 5);
      const sunday = addDays(startOfWeek(now), 6);
      return eventMatchesDateFilter(event, saturday) || eventMatchesDateFilter(event, sunday);
      
    case 'next week':
      const nextWeekStart = addDays(startOfWeek(now), 7);
      const nextWeekEnd = addDays(endOfWeek(now), 7);
      return eventMatchesDateInterval(event, nextWeekStart, nextWeekEnd);
      
    case 'later':
      if (!event.start_date) return false;
      const eventDate = new Date(event.start_date);
      const twoWeeksFromNow = addDays(now, 14);
      return eventDate > twoWeeksFromNow;
      
    default:
      return true;
  }
};
