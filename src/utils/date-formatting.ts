
// Re-export the new timezone-aware functions
export { 
  formatEventDate,
  formatEventDateForCard,
  formatEventTime,
  formatEventTimeWithLocation,
  formatEventTimeRange,
  getTimezoneLocationLabel
} from './timezone-utils';

// Set timezone constant for Amsterdam/Netherlands (kept for backward compatibility)
export const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

// Import the functions we need to use internally
import { formatEventDate, formatEventTime, formatEventDateForCard, formatEventCardDateTime as formatEventCardDateTimeFromUtils } from './timezone-utils';

/**
 * Helper to format event date in a consistent way - now timezone-aware
 */
export const formatDate = (dateString: string, timezone: string = AMSTERDAM_TIMEZONE): string => {
  return formatEventDate(dateString, timezone);
};

/**
 * Helper to format event time in a consistent way - now timezone-aware
 */
export const formatTime = (timeString: string, timezone: string = AMSTERDAM_TIMEZONE): string => {
  try {
    // If it's a full ISO string
    if (timeString.includes('T')) {
      return formatEventTime(timeString, timezone);
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
 * Format date for featured/preview cards (no year)
 */
export const formatFeaturedDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'short'
    });
  } catch (error) {
    console.error('Error formatting featured date:', error);
    return dateString;
  }
};

/**
 * Format date and time for event cards (using timezone-aware function from utils)
 */
export const formatEventCardDateTime = (
  startDate?: string | null,
  startTime?: string | null,
  endDate?: string | null,
  timezone: string = AMSTERDAM_TIMEZONE
): string => {
  if (!startDate) return '';
  
  // Create ISO datetime string from legacy fields
  const startDateTime = startTime ? `${startDate}T${startTime}` : startDate;
  const endDateTime = endDate && endDate !== startDate ? endDate : null;
  
  return formatEventCardDateTimeFromUtils(startDateTime, endDateTime, timezone);
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
 * Format date range for multi-day events
 */
export const formatMultiDayRange = (startDate: string, endDate: string, timezone: string = AMSTERDAM_TIMEZONE): string => {
  try {
    const startFormatted = formatEventDate(startDate, timezone);
    const endFormatted = formatEventDate(endDate, timezone);
    
    return `${startFormatted} - ${endFormatted}`;
  } catch (error) {
    console.error('Error formatting multi-day range:', error);
    return '';
  }
};
