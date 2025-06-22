
import { formatInTimeZone } from 'date-fns-tz';

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
 * Helper to format event date in featured format (Sun, 25 May)
 */
export const formatFeaturedDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return formatInTimeZone(date, AMSTERDAM_TIMEZONE, "EEE, d MMM");
  } catch (error) {
    console.error('Error formatting featured date:', error);
    return dateString;
  }
};

/**
 * Helper to format event time in a consistent way - 24h format
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
 * Formats event date and time for cards, e.g. "Sun, 25 May, 20:30" or "May 31 - June 15" for multi-day events
 */
export const formatEventCardDateTime = (startDate: string, startTime?: string | null, endDate?: string | null): string => {
  if (!startDate) return '';
  
  // Check if it's a multi-day event - show date range without time for ongoing events
  if (isMultiDayEvent(startDate, endDate)) {
    return formatMultiDayRange(startDate, endDate!);
  }
  
  try {
    const date = new Date(startDate);
    const datePart = formatInTimeZone(date, AMSTERDAM_TIMEZONE, "EEE, d MMM");

    if (!startTime) {
      return datePart;
    }

    // Create a new date object with the time for correct timezone formatting
    // Handles both ISO date strings and simple time strings.
    const timeDate = new Date(startTime.includes('T') ? startTime : `${startDate.split('T')[0]}T${startTime}`);
    const timePart = formatInTimeZone(timeDate, AMSTERDAM_TIMEZONE, "HH:mm");
    
    return `${datePart}, ${timePart}`;
  } catch (error) {
    console.error('Error formatting event card date-time:', error);
    // Fallback to a simpler format
    const datePart = formatFeaturedDate(startDate);
    if (!startTime) return datePart;
    const timePart = formatTime(startTime).substring(0, 5); // Just get HH:mm
    return `${datePart}, ${timePart}`;
  }
};
