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

/**
 * Filters upcoming events (events with start date in the future)
 */
export const filterUpcomingEvents = (events: Event[]): Event[] => {
  const now = new Date();
  return events.filter(event => {
    // If no start_date, include the event
    if (!event.start_date) return true;
    
    // Convert to Date object if it's a string
    const eventDate = typeof event.start_date === 'string' 
      ? new Date(event.start_date) 
      : event.start_date;
      
    // Keep events that are today or in the future
    return eventDate >= startOfDay(now);
  });
};

/**
 * Filters past events (events with start date in the past)
 */
export const filterPastEvents = (events: Event[]): Event[] => {
  const now = new Date();
  return events.filter(event => {
    // If no start_date, exclude the event
    if (!event.start_date) return false;
    
    // Convert to Date object if it's a string
    const eventDate = typeof event.start_date === 'string' 
      ? new Date(event.start_date) 
      : event.start_date;
      
    // Keep events that are in the past
    return eventDate < startOfDay(now);
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
 * Filters events by date criteria
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
    
    return events.filter(event => {
      if (!event.start_date) return false;
      
      const eventDate = typeof event.start_date === 'string' 
        ? new Date(event.start_date) 
        : event.start_date;
        
      return isWithinInterval(eventDate, { start: from, end: to });
    });
  }
  
  // If predefined date filter is selected
  switch (dateFilter.toLowerCase()) {
    case 'today':
      return events.filter(event => {
        if (!event.start_date) return false;
        const eventDate = typeof event.start_date === 'string' 
          ? new Date(event.start_date) 
          : event.start_date;
        return isSameDay(eventDate, now);
      });
      
    case 'tomorrow':
      return events.filter(event => {
        if (!event.start_date) return false;
        const eventDate = typeof event.start_date === 'string' 
          ? new Date(event.start_date) 
          : event.start_date;
        return isSameDay(eventDate, addDays(now, 1));
      });
      
    case 'this week':
      return events.filter(event => {
        if (!event.start_date) return false;
        const eventDate = typeof event.start_date === 'string' 
          ? new Date(event.start_date) 
          : event.start_date;
        const weekStart = startOfWeek(now);
        const weekEnd = endOfWeek(now);
        return isWithinInterval(eventDate, { start: weekStart, end: weekEnd });
      });
      
    case 'this weekend':
      return events.filter(event => {
        if (!event.start_date) return false;
        const eventDate = typeof event.start_date === 'string' 
          ? new Date(event.start_date) 
          : event.start_date;
        // Define weekend as Saturday and Sunday
        const saturday = addDays(startOfWeek(now), 5);
        const sunday = addDays(startOfWeek(now), 6);
        return isSameDay(eventDate, saturday) || isSameDay(eventDate, sunday);
      });
      
    case 'next week':
      return events.filter(event => {
        if (!event.start_date) return false;
        const eventDate = typeof event.start_date === 'string' 
          ? new Date(event.start_date) 
          : event.start_date;
        const nextWeekStart = addDays(startOfWeek(now), 7);
        const nextWeekEnd = addDays(endOfWeek(now), 7);
        return isWithinInterval(eventDate, { start: nextWeekStart, end: nextWeekEnd });
      });
      
    case 'later':
      return events.filter(event => {
        if (!event.start_date) return false;
        const eventDate = typeof event.start_date === 'string' 
          ? new Date(event.start_date) 
          : event.start_date;
        const twoWeeksFromNow = addDays(now, 14);
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
  
  // For a single event
  if (!event.start_date) return false;
  
  const eventDate = typeof event.start_date === 'string' 
    ? new Date(event.start_date) 
    : event.start_date;
  
  // If custom date range is selected
  if (dateRange?.from) {
    const from = startOfDay(dateRange.from);
    const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
    
    return isWithinInterval(eventDate, { start: from, end: to });
  }
  
  // If predefined date filter is selected
  switch (dateFilter.toLowerCase()) {
    case 'today':
      return isSameDay(eventDate, now);
      
    case 'tomorrow':
      return isSameDay(eventDate, addDays(now, 1));
      
    case 'this week':
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);
      return isWithinInterval(eventDate, { start: weekStart, end: weekEnd });
      
    case 'this weekend':
      // Define weekend as Saturday and Sunday
      const saturday = addDays(startOfWeek(now), 5);
      const sunday = addDays(startOfWeek(now), 6);
      return isSameDay(eventDate, saturday) || isSameDay(eventDate, sunday);
      
    case 'next week':
      const nextWeekStart = addDays(startOfWeek(now), 7);
      const nextWeekEnd = addDays(endOfWeek(now), 7);
      return isWithinInterval(eventDate, { start: nextWeekStart, end: nextWeekEnd });
      
    case 'later':
      const twoWeeksFromNow = addDays(now, 14);
      return eventDate > twoWeeksFromNow;
      
    default:
      return true;
  }
};
