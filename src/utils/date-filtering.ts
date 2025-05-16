import { addDays, isSameDay, isAfter, isBefore, startOfDay, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { Event } from '@/types';

/**
 * Filter events by dates that are upcoming (today or in the future)
 */
export const filterUpcomingEvents = (events: Event[]): Event[] => {
  const today = startOfDay(new Date());
  
  return events.filter(event => {
    // Try to get a valid date from the event
    const eventDate = getEventDate(event);
    if (!eventDate) return false;
    
    // Keep the event if it's today or in the future
    return isSameDay(eventDate, today) || isAfter(eventDate, today);
  });
};

/**
 * Filter events that happened in the past
 */
export const filterPastEvents = (events: Event[]): Event[] => {
  const today = startOfDay(new Date());
  
  return events.filter(event => {
    // Try to get a valid date from the event
    const eventDate = getEventDate(event);
    if (!eventDate) return false;
    
    // Keep the event if it's in the past
    return isAfter(today, eventDate) && !isSameDay(eventDate, today);
  });
};

/**
 * Sort events by date (ascending)
 */
export const sortEventsByDate = (events: Event[]): Event[] => {
  return [...events].sort((a, b) => {
    const dateA = getEventDate(a);
    const dateB = getEventDate(b);
    
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    return dateA.getTime() - dateB.getTime();
  });
};

/**
 * Helper to extract the date from an event object
 */
export const getEventDate = (event: Event): Date | null => {
  try {
    // Try start_date first (preferred format)
    if (event.start_date) {
      return new Date(event.start_date);
    }
    // Fall back to start_time if available
    if (event.start_time) {
      return new Date(event.start_time);
    }
    return null;
  } catch (error) {
    console.error('Error parsing event date:', error, event);
    return null;
  }
};

/**
 * Filter events for the "today" quick filter
 */
export const filterEventsForToday = (events: Event[]): Event[] => {
  const today = startOfDay(new Date());
  
  return events.filter(event => {
    const eventDate = getEventDate(event);
    if (!eventDate) return false;
    
    return isSameDay(eventDate, today);
  });
};

/**
 * Filter events for the "this week" quick filter
 */
export const filterEventsForThisWeek = (events: Event[]): Event[] => {
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
  const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
  
  return events.filter(event => {
    const eventDate = getEventDate(event);
    if (!eventDate) return false;
    
    return isAfter(eventDate, startOfCurrentWeek) && isBefore(eventDate, endOfCurrentWeek);
  });
};

/**
 * Filter events for the "this weekend" quick filter
 */
export const filterEventsForThisWeekend = (events: Event[]): Event[] => {
  const today = new Date();
  const saturday = startOfDay(addDays(startOfWeek(today, { weekStartsOn: 1 }), 5)); // Saturday
  const sunday = startOfDay(addDays(saturday, 1)); // Sunday
  
  return events.filter(event => {
    const eventDate = getEventDate(event);
    if (!eventDate) return false;
    
    return isSameDay(eventDate, saturday) || isSameDay(eventDate, sunday);
  });
};

/**
 * Filter events by a custom date filter
 */
export const filterEventsByDateFilter = (events: Event[], filter: string): Event[] => {
  switch (filter.toLowerCase()) {
    case 'today':
      return filterEventsForToday(events);
    case 'tomorrow':
      const tomorrow = addDays(startOfDay(new Date()), 1);
      return events.filter(event => {
        const eventDate = getEventDate(event);
        return eventDate ? isSameDay(eventDate, tomorrow) : false;
      });
    case 'this week':
      return filterEventsForThisWeek(events);
    case 'this weekend':
      return filterEventsForThisWeekend(events);
    case 'next week':
      const nextWeekStart = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 7);
      const nextWeekEnd = addDays(nextWeekStart, 6);
      return events.filter(event => {
        const eventDate = getEventDate(event);
        return eventDate ? 
          isAfter(eventDate, nextWeekStart) && isBefore(eventDate, nextWeekEnd) : 
          false;
      });
    case 'later':
      const twoWeeksFromNow = addDays(startOfDay(new Date()), 14);
      return events.filter(event => {
        const eventDate = getEventDate(event);
        return eventDate ? isAfter(eventDate, twoWeeksFromNow) : false;
      });
    default:
      return events;
  }
};

/**
 * Filter events by date range or date filter
 * This function is used by components that need to filter events by date
 */
export const filterEventsByDate = (events: Event[], dateFilter?: string, dateRange?: any): Event[] => {
  // If there's a specific filter string like 'today', 'this week', etc., use that first
  if (dateFilter) {
    return filterEventsByDateFilter(events, dateFilter);
  }
  
  // If there's a date range, filter by that
  if (dateRange?.from) {
    const startDate = startOfDay(dateRange.from);
    const endDate = dateRange.to ? startOfDay(dateRange.to) : null;
    
    return events.filter(event => {
      const eventDate = getEventDate(event);
      if (!eventDate) return false;
      
      const eventDay = startOfDay(eventDate);
      
      if (endDate) {
        return isAfter(eventDay, startDate) && isBefore(eventDay, endDate) || 
               isSameDay(eventDay, startDate) || 
               isSameDay(eventDay, endDate);
      } else {
        return isSameDay(eventDay, startDate);
      }
    });
  }
  
  // If no filters are provided, return all events
  return events;
};
