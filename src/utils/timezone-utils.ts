
import { formatInTimeZone } from 'date-fns-tz';
import { parseISO } from 'date-fns';

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
 * Format a date string for cards (no year) in a specific timezone
 */
export function formatEventDateForCard(dateString: string, timezone: string = AMSTERDAM_TIMEZONE): string {
  try {
    const date = parseISO(dateString);
    return formatInTimeZone(date, timezone, 'EEEE, MMMM d');
  } catch (error) {
    console.error('Error formatting date for card:', error);
    return dateString;
  }
}

/**
 * Format a time string in a specific timezone
 */
export function formatEventTime(dateString: string, timeString: string, timezone: string = AMSTERDAM_TIMEZONE): string {
  try {
    // Create a proper ISO datetime string and parse it in the specified timezone
    const dateTime = parseISO(`${dateString}T${timeString}`);
    return formatInTimeZone(dateTime, timezone, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString.substring(0, 5); // Return just HH:MM as fallback
  }
}

/**
 * Create a Date object from date string, time string, and timezone
 */
export function createEventDateTime(dateString: string, timeString: string, timezone: string = AMSTERDAM_TIMEZONE): Date {
  try {
    const dateTime = parseISO(`${dateString}T${timeString}`);
    return dateTime;
  } catch (error) {
    console.error('Error creating event datetime:', error);
    return new Date();
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
    
    const startDateTime = parseISO(`${startDate}T${startTime}`);
    
    let timeRange = formatInTimeZone(startDateTime, timezone, 'HH:mm');
    
    if (endTime) {
      const endDateTime = parseISO(`${startDate}T${endTime}`);
      const endTimeFormatted = formatInTimeZone(endDateTime, timezone, 'HH:mm');
      timeRange += ` - ${endTimeFormatted}`;
    }
    
    // Add city context if provided and different from Amsterdam
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
 * Format date and time for event cards (no year, timezone-aware)
 */
export function formatEventCardDateTime(
  startDate: string,
  startTime?: string | null,
  endDate?: string | null,
  timezone: string = AMSTERDAM_TIMEZONE,
  cityName?: string
): string {
  if (!startDate) return '';

  try {
    // Check if it's a multi-day event
    if (endDate && endDate !== startDate) {
      const startFormatted = formatEventDateForCard(startDate, timezone);
      const endFormatted = formatEventDateForCard(endDate, timezone);
      return `${startFormatted} - ${endFormatted}`;
    }

    const datePart = formatEventDateForCard(startDate, timezone);
    
    if (!startTime) {
      return datePart;
    }
    
    const timePart = formatEventTime(startDate, startTime, timezone);
    return `${datePart}, ${timePart}`;
  } catch (error) {
    console.error('Error formatting event card date-time:', error);
    return startDate;
  }
}

/**
 * Format event time with location context
 */
export function formatEventTimeWithLocation(
  dateString: string,
  timeString: string,
  timezone: string = AMSTERDAM_TIMEZONE,
  cityName?: string
): string {
  try {
    const formattedTime = formatEventTime(dateString, timeString, timezone);
    
    if (cityName && timezone !== AMSTERDAM_TIMEZONE) {
      return `${formattedTime} (${cityName} time)`;
    }
    
    return formattedTime;
  } catch (error) {
    console.error('Error formatting time with location:', error);
    return timeString;
  }
}

/**
 * Get timezone location label
 */
export function getTimezoneLocationLabel(timezone: string, cityName?: string): string {
  if (cityName && timezone !== AMSTERDAM_TIMEZONE) {
    return `${cityName} time`;
  }
  return '';
}

/**
 * Get user's timezone
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error('Error getting user timezone:', error);
    return AMSTERDAM_TIMEZONE;
  }
}

/**
 * Get common timezones for dropdown
 */
export function getCommonTimezones(): Array<{ value: string; label: string }> {
  return [
    { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
    { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
    { value: 'Europe/Lisbon', label: 'Lisbon (WET/WEST)' },
    { value: 'America/New_York', label: 'New York (EST/EDT)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
    { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  ];
}
