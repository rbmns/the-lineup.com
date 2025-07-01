
import { formatInTimeZone } from 'date-fns-tz';
import { formatEventTime, formatEventDate, formatEventCardDateTime } from './timezone-utils';

// Set timezone constant for Amsterdam/Netherlands (kept for backward compatibility)
export const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

/**
 * Helper to format event date in a consistent way - now timezone-aware
 */
export const formatDate = (dateString: string, timezone: string = AMSTERDAM_TIMEZONE): string => {
  return formatEventDate(dateString, timezone);
};

/**
 * Helper to format event date in featured format (Sun, 25 May) - now timezone-aware
 */
export const formatFeaturedDate = (dateString: string, timezone: string = AMSTERDAM_TIMEZONE): string => {
  try {
    const date = new Date(dateString);
    return formatInTimeZone(date, timezone, "EEE, d MMM");
  } catch (error) {
    console.error('Error formatting featured date:', error);
    return dateString;
  }
};

/**
 * Helper to format event time in a consistent way - now timezone-aware
 */
export const formatTime = (timeString: string, dateString?: string, timezone: string = AMSTERDAM_TIMEZONE): string => {
  try {
    // If it's a full ISO string
    if (timeString.includes('T')) {
      const time = new Date(timeString);
      return formatInTimeZone(time, timezone, "HH:mm");
    }
    
    // If it's just a time string (HH:MM:SS) and we have a date
    if (timeString.includes(':') && dateString) {
      return formatEventTime(dateString, timeString, timezone);
    }
    
    // Fallback for just time string
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
 * Format event time (handles start and end time) - now timezone-aware
 */
export const formatEventTimeRange = (
  startTime: string, 
  endTime?: string | null, 
  dateString?: string,
  timezone: string = AMSTERDAM_TIMEZONE
): string => {
  if (!startTime) return '';
  
  const formattedStartTime = formatTime(startTime, dateString, timezone);
  
  if (!endTime) return formattedStartTime;
  
  const formattedEndTime = formatTime(endTime, dateString, timezone);
  return `${formattedStartTime}-${formattedEndTime}`;
};

/**
 * Check if an event spans multiple days
 */
export const isMultiDayEvent = (startDate: string, endDate?: string | null): boolean => {
  if (!startDate || !endDate) return false;
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Compare dates without time components
    const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    
    return endDateOnly > startDateOnly;
  } catch (error) {
    console.error('Error checking multi-day event:', error);
    return false;
  }
};

/**
 * Format date range for multi-day events - improved for ongoing events
 */
export const formatMultiDayRange = (startDate: string, endDate: string): string => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // For ongoing events, use a cleaner format: "May 31 - June 15"
    const startFormatted = formatInTimeZone(start, AMSTERDAM_TIMEZONE, "MMM d");
    const endFormatted = formatInTimeZone(end, AMSTERDAM_TIMEZONE, "MMM d");
    
    return `${startFormatted} - ${endFormatted}`;
  } catch (error) {
    console.error('Error formatting multi-day range:', error);
    return '';
  }
};

/**
 * Formats event date and time for cards - updated to use timezone-aware function
 */
export { formatEventCardDateTime } from './timezone-utils';
