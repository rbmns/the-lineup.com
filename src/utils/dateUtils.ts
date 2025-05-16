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
  startOfMonth, 
  endOfMonth,
  format,
  isAfter,
  isBefore,
  parseISO,
  compareAsc
} from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

// Set timezone constant for Amsterdam/Netherlands
export const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

/**
 * Helper to format event date in a consistent way
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return formatInTimeZone(date, AMSTERDAM_TIMEZONE, "EEE, d MMM yyyy");
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Helper to format event time in a consistent way
 */
export const formatTime = (timeString: string): string => {
  try {
    // If it's a full ISO string
    if (timeString.includes('T')) {
      const time = new Date(timeString);
      return formatInTimeZone(time, AMSTERDAM_TIMEZONE, "HH:mm");
    }
    
    // If it's just a time string (HH:MM:SS)
    if (timeString.includes(':')) {
      const timeparts = timeString.split(':');
      return `${timeparts[0]}:${timeparts[1]}`; // Only keep hours and minutes
    }
    
    return timeString;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

/**
 * Format event time (handles start and end time)
 */
export const formatEventTime = (startTime: string, endTime?: string | null): string => {
  if (!startTime) return '';
  
  const formattedStartTime = formatTime(startTime);
  
  if (!endTime) return formattedStartTime;
  
  const formattedEndTime = formatTime(endTime);
  return `${formattedStartTime} - ${formattedEndTime}`;
};

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

/**
 * Get the full week range array for calendar views
 */
export const getWeekRange = (date: Date): Date[] => {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
};

/**
 * Gets the event datetime from an event object
 */
export const getEventDateTime = (event: Event): string => {
  if (!event) return '';
  
  if (event.start_time && event.start_time.includes('T')) {
    return event.start_time;
  }
  
  if (event.start_date && event.start_time) {
    return combineDateAndTime(event.start_date, event.start_time);
  }
  
  return event.start_date || '';
};

/**
 * Gets the event end datetime from an event object
 */
export const getEventEndDateTime = (event: Event): string => {
  if (!event) return '';
  
  if (event.end_time && event.end_time.includes('T')) {
    return event.end_time;
  }
  
  if (event.start_date && event.end_time) {
    return combineDateAndTime(event.start_date, event.end_time);
  }
  
  return '';
};

/**
 * Combines a date string with a time string to produce an ISO datetime string
 */
export const combineDateAndTime = (dateStr: string, timeStr: string): string => {
  try {
    // Convert the date string to a Date object
    const date = new Date(dateStr);
    
    // Extract hours and minutes from the time string
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Set the hours and minutes on the date
    date.setHours(hours);
    date.setMinutes(minutes);
    
    // Return an ISO string
    return date.toISOString();
  } catch (error) {
    console.error('Error combining date and time:', error);
    return '';
  }
};
