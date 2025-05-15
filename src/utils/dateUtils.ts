import { format, parseISO, isPast, isFuture, isToday, addDays, startOfWeek, endOfWeek, startOfDay, isSameDay, isFriday, isSaturday, isSunday, nextFriday, nextMonday, addWeeks, isWithinInterval, compareAsc, subMinutes } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { Event } from '@/types';

// Amsterdam/Netherlands timezone
export const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

/**
 * Combine date and time parts into a single Date object
 */
export const combineDateAndTime = (
  dateStr: string | null | undefined, 
  timeStr: string | null | undefined
): Date | null => {
  try {
    if (!dateStr || !timeStr) return null;
    
    // Parse the date string (assumed format 'YYYY-MM-DD')
    const [year, month, day] = dateStr.split('-').map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    
    // Parse the time string (assumed format 'HH:MM:SS')
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    
    // Create a new Date object with the combined parts
    const combinedDate = new Date(year, month - 1, day, hours, minutes, seconds || 0);
    
    if (isNaN(combinedDate.getTime())) return null;
    return combinedDate;
  } catch (error) {
    console.error('Error combining date and time:', error);
    return null;
  }
};

/**
 * Get the combined date-time string from an event in ISO format
 */
export const getEventDateTime = (event: any): string | null => {
  try {
    if (event.start_time && typeof event.start_time === 'string' && event.start_time.includes('T')) {
      // Legacy format - already a full ISO datetime string
      return event.start_time;
    } else if (event.start_date && event.start_time) {
      // New format - separate date and time fields
      const combined = combineDateAndTime(event.start_date, event.start_time);
      return combined ? combined.toISOString() : null;
    }
    return null;
  } catch (error) {
    console.error('Error getting event datetime:', error, event);
    return null;
  }
};

/**
 * Get the combined end date-time string from an event in ISO format
 */
export const getEventEndDateTime = (event: any): string | null => {
  try {
    if (event.end_time && typeof event.end_time === 'string' && event.end_time.includes('T')) {
      // Legacy format - already a full ISO datetime string
      return event.end_time;
    } else if (event.start_date && event.end_time) {
      // New format - use start_date with end_time
      const combined = combineDateAndTime(event.start_date, event.end_time);
      return combined ? combined.toISOString() : null;
    }
    return null;
  } catch (error) {
    console.error('Error getting event end datetime:', error, event);
    return null;
  }
};

// Function to sort events by date (ascending)
export const sortEventsByDate = <T extends { start_date?: string | null; start_time?: string | null }>(events: T[]): T[] => {
  return [...events].sort((a, b) => {
    // Handle null or undefined date/time
    const dateTimeA = getEventDateTime(a);
    const dateTimeB = getEventDateTime(b);
    
    if (!dateTimeA) return 1;
    if (!dateTimeB) return -1;
    
    // Compare dates (ascending order - soonest first)
    return compareAsc(new Date(dateTimeA), new Date(dateTimeB));
  });
};

/**
 * Format a date string to display format (e.g., "Monday, 1 January 2024")
 */
export const formatDate = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    return formatInTimeZone(date, AMSTERDAM_TIMEZONE, 'EEEE, d MMMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
};

/**
 * Format a time string using Amsterdam timezone in 24-hour format (e.g., "13:30")
 */
export const formatTime = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    // Use 24-hour format for the Netherlands
    return formatInTimeZone(date, AMSTERDAM_TIMEZONE, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error);
    return dateStr;
  }
};

/**
 * Format the relative date of an event (e.g., "Today", "Tomorrow", "In 3 days")
 */
export const formatRelativeDate = (dateTimeStr: string | null): string => {
  try {
    if (!dateTimeStr) return 'Date not set';
    
    const date = new Date(dateTimeStr);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    
    return formatInTimeZone(date, AMSTERDAM_TIMEZONE, 'd MMM yyyy');
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return dateTimeStr || 'Date not set';
  }
};

/**
 * Format event time from start to end time (e.g., "13:30 - 15:00")
 */
export const formatEventTime = (startTimeStr: string | null, endTimeStr?: string | null): string => {
  try {
    if (!startTimeStr) return 'Time not set';
    
    const startFormatted = formatTime(startTimeStr);
    
    if (endTimeStr) {
      const endFormatted = formatTime(endTimeStr);
      return `${startFormatted} - ${endFormatted}`;
    }
    
    return startFormatted;
  } catch (error) {
    console.error('Error formatting event time:', error);
    return startTimeStr || 'Time not set';
  }
};

/**
 * Filter events based on date filter and/or date range
 */
export const filterEventsByDate = <T extends { start_date?: string | null }>(
  events: T[],
  dateFilter: string,
  dateRange?: any
): T[] => {
  if (!dateFilter && !dateRange) return events;
  
  return events.filter(event => filterEventsByDateRange(event, dateFilter, dateRange));
};

/**
 * Check if an event falls within the specified date range or filter
 */
export const filterEventsByDateRange = <T extends { start_date?: string | null; start_time?: string | null }>(
  event: T, 
  dateFilter: string,
  dateRange?: any
): boolean => {
  // If no filters are applied, include the event
  if (!dateFilter && !dateRange) return true;
  
  const dateTimeStr = getEventDateTime(event);
  if (!dateTimeStr) return false;
  
  const eventDate = startOfDay(new Date(dateTimeStr));
  const today = startOfDay(new Date());
  
  // Skip events in the past
  if (isPast(eventDate) && !isToday(eventDate)) return false;
  
  // If a date range is specified, check if the event falls within it
  if (dateRange?.from) {
    const rangeStart = startOfDay(dateRange.from);
    if (dateRange.to) {
      const rangeEnd = startOfDay(dateRange.to);
      return eventDate >= rangeStart && eventDate <= rangeEnd;
    }
    return eventDate >= rangeStart;
  }
  
  // If a date filter is specified, apply it
  if (dateFilter) {
    switch (dateFilter.toLowerCase()) {
      case 'today':
        return isToday(eventDate);
        
      case 'tomorrow':
        const tomorrow = addDays(today, 1);
        return isSameDay(eventDate, tomorrow);
        
      case 'this week':
        const endOfCurrentWeek = addDays(today, 7);
        return eventDate >= today && eventDate < endOfCurrentWeek;
        
      case 'this weekend':
        // Get the next weekend (Fri, Sat, Sun) from today
        const fridayDate = isFriday(today) ? today : nextFriday(today);
        const saturdayDate = addDays(fridayDate, 1);
        const sundayDate = addDays(fridayDate, 2);
        
        return isSameDay(eventDate, fridayDate) || 
               isSameDay(eventDate, saturdayDate) || 
               isSameDay(eventDate, sundayDate);
        
      case 'next week':
        // Next Monday to Sunday
        const nextMondayDate = nextMonday(today);
        const endOfNextWeek = addDays(nextMondayDate, 7);
        return eventDate >= nextMondayDate && eventDate < endOfNextWeek;
        
      case 'later':
        const twoWeeksLater = addWeeks(today, 2);
        return eventDate >= twoWeeksLater;
        
      default:
        return true;
    }
  }
  
  // If we get here, include the event by default
  return true;
};

/**
 * Filter events based on date filter
 */
export const filterEventsByDateFilter = <T extends { start_date?: string | null; start_time?: string | null }>(
  events: T[], 
  dateFilter: string
): T[] => {
  if (!dateFilter) return events;
  
  const today = startOfDay(new Date());
  
  return events.filter(event => {
    const dateTimeStr = getEventDateTime(event);
    if (!dateTimeStr) return false;
    
    const eventDate = startOfDay(new Date(dateTimeStr));
    
    // Skip events in the past
    if (isPast(eventDate) && !isToday(eventDate)) return false;
    
    switch (dateFilter.toLowerCase()) {
      case 'today':
        return isSameDay(eventDate, today);
        
      case 'tomorrow':
        const tomorrow = addDays(today, 1);
        return isSameDay(eventDate, tomorrow);
        
      case 'this week':
        const endOfCurrentWeek = addDays(today, 7);
        return eventDate >= today && eventDate < endOfCurrentWeek;
        
      case 'this weekend':
        // Get the next weekend (Fri, Sat, Sun) from today
        const fridayDate = isFriday(today) ? today : nextFriday(today);
        const saturdayDate = addDays(fridayDate, 1);
        const sundayDate = addDays(fridayDate, 2);
        
        return isSameDay(eventDate, fridayDate) || 
               isSameDay(eventDate, saturdayDate) || 
               isSameDay(eventDate, sundayDate);
        
      case 'next week':
        // Next Monday to Sunday
        const nextMondayDate = nextMonday(today);
        const endOfNextWeek = addDays(nextMondayDate, 7);
        return eventDate >= nextMondayDate && eventDate < endOfNextWeek;
        
      case 'later':
        const twoWeeksLater = addWeeks(today, 2);
        return eventDate >= twoWeeksLater;
        
      default:
        return true;
    }
  });
};

/**
 * Filter events to get only upcoming events (including those that started less than 30 minutes ago)
 */
export const filterUpcomingEvents = <T extends { start_date?: string | null; start_time?: string | null }>(events: T[]): T[] => {
  const now = new Date();
  const thirtyMinutesBeforeNow = subMinutes(now, 30);
  
  const filtered = events.filter(event => {
    const dateTimeStr = getEventDateTime(event);
    if (!dateTimeStr) return false; // Skip events with no start time
    
    const startDate = new Date(dateTimeStr);
    
    // Include events that start in the future OR started less than 30 minutes ago
    return startDate > thirtyMinutesBeforeNow;
  });
  
  // Sort by date (ascending - soonest first)
  return sortEventsByDate(filtered);
};

/**
 * Filter events to get only past events (those that started more than 30 minutes ago)
 */
export const filterPastEvents = <T extends { start_date?: string | null; start_time?: string | null }>(events: T[]): T[] => {
  const now = new Date();
  const thirtyMinutesBeforeNow = subMinutes(now, 30);
  
  const filtered = events.filter(event => {
    const dateTimeStr = getEventDateTime(event);
    if (!dateTimeStr) return false; // Skip events with no start time
    
    const startDate = new Date(dateTimeStr);
    
    // Include events that started more than 30 minutes ago
    return startDate <= thirtyMinutesBeforeNow;
  });
  
  // Sort by date (descending - most recent first)
  return [...filtered].sort((a, b) => {
    if (!a.start_date || !b.start_date) return 0;
    const dateA = new Date(getEventDateTime(a) || '');
    const dateB = new Date(getEventDateTime(b) || '');
    return compareAsc(dateB, dateA); // Reverse order for past events
  });
};

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 */
export const getRelativeTime = (dateStr: string): string => {
  try {
    const date = toZonedTime(parseISO(dateStr), AMSTERDAM_TIMEZONE);
    const now = toZonedTime(new Date(), AMSTERDAM_TIMEZONE);
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    
    return formatInTimeZone(date, AMSTERDAM_TIMEZONE, 'd MMM yyyy');
  } catch (error) {
    console.error('Error getting relative time:', error);
    return dateStr;
  }
};

/**
 * Get a week range from a given date
 */
export const getWeekRange = (date: Date): Date[] => {
  const result = [];
  const currentDay = startOfDay(date);
  
  // Add today and the next 6 days
  for (let i = 0; i < 7; i++) {
    result.push(addDays(currentDay, i));
  }
  
  return result;
};

/**
 * Format a date to display in weekly calendar
 */
export const formatWeekDay = (date: Date): string => {
  return format(date, 'EEE');
};

/**
 * Format a date to display in weekly calendar
 */
export const formatWeekDate = (date: Date): string => {
  return format(date, 'd');
};

/**
 * Get events for a specific date
 */
export const getEventsForDate = <T extends { start_date?: string | null }>(
  events: T[],
  date: Date
): T[] => {
  return events.filter(event => {
    if (!event.start_date) return false;
    const eventDate = startOfDay(new Date(event.start_date));
    return isSameDay(eventDate, date);
  });
};
