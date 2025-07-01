
import { formatInTimeZone } from 'date-fns-tz';
import { format, parseISO } from 'date-fns';

export const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

/**
 * Format a date string in a specific timezone
 */
export function formatEventDate(dateString: string, timezone: string = AMSTERDAM_TIMEZONE): string {
  try {
    const date = parseISO(dateString);
    return formatInTimeZone(date, timezone, 'EEEE, MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Format a time string in a specific timezone
 */
export function formatEventTime(timeString: string, timezone: string = AMSTERDAM_TIMEZONE): string {
  try {
    // Create a date object with today's date and the provided time
    const today = new Date().toISOString().split('T')[0];
    const dateTime = parseISO(`${today}T${timeString}`);
    return formatInTimeZone(dateTime, timezone, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
}

/**
 * Format a complete event date and time range
 */
export function formatEventTimeRange(
  startDate: string, 
  startTime?: string | null, 
  endTime?: string | null, 
  timezone: string = AMSTERDAM_TIMEZONE,
  cityName?: string
): string {
  try {
    if (!startTime) return 'Time not specified';
    
    const today = new Date().toISOString().split('T')[0];
    const startDateTime = parseISO(`${startDate}T${startTime}`);
    
    let timeRange = formatInTimeZone(startDateTime, timezone, 'HH:mm');
    
    if (endTime) {
      const endDateTime = parseISO(`${startDate}T${endTime}`);
      const endTimeFormatted = formatInTimeZone(endDateTime, timezone, 'HH:mm');
      timeRange += ` - ${endTimeFormatted}`;
    }
    
    // Add city context if provided
    if (cityName && timezone !== AMSTERDAM_TIMEZONE) {
      timeRange += ` (${cityName} time)`;
    }
    
    return timeRange;
  } catch (error) {
    console.error('Error formatting time range:', error);
    return startTime || 'Time not specified';
  }
}

/**
 * Format date and time for event cards
 */
export function formatEventCardDateTime(
  startDate: string,
  startTime?: string | null,
  endDate?: string | null,
  timezone: string = AMSTERDAM_TIMEZONE,
  cityName?: string
): string {
  try {
    const formattedDate = formatEventDate(startDate, timezone);
    const timeRange = formatEventTimeRange(startDate, startTime, null, timezone, cityName);
    
    return `${formattedDate}, ${timeRange}`;
  } catch (error) {
    console.error('Error formatting card date time:', error);
    return startDate;
  }
}
