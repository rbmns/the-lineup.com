
import { formatInTimeZone } from 'date-fns-tz';
import { parseISO } from 'date-fns';

export const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

/**
 * Format a datetime string in a specific timezone
 */
export function formatEventDate(dateTimeString: string, timezone: string = AMSTERDAM_TIMEZONE): string {
  try {
    const date = parseISO(dateTimeString);
    return formatInTimeZone(date, timezone, 'EEEE, MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateTimeString;
  }
}

/**
 * Format a datetime string for cards (no year) in a specific timezone
 */
export function formatEventDateForCard(dateTimeString: string, timezone: string = AMSTERDAM_TIMEZONE): string {
  try {
    const date = parseISO(dateTimeString);
    return formatInTimeZone(date, timezone, 'EEEE, MMMM d');
  } catch (error) {
    console.error('Error formatting date for card:', error);
    return dateTimeString;
  }
}

/**
 * Format a datetime string to show only time in a specific timezone
 */
export function formatEventTime(dateTimeString: string, timezone: string = AMSTERDAM_TIMEZONE): string {
  try {
    const date = parseISO(dateTimeString);
    return formatInTimeZone(date, timezone, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error);
    return dateTimeString;
  }
}

/**
 * Create a Date object from datetime string
 */
export function createEventDateTime(dateTimeString: string): Date {
  try {
    return parseISO(dateTimeString);
  } catch (error) {
    console.error('Error creating event datetime:', error);
    return new Date();
  }
}

/**
 * Format a complete event time range using start_datetime and end_datetime
 */
export function formatEventTimeRange(
  startDateTime: string, 
  endDateTime?: string | null, 
  timezone: string = AMSTERDAM_TIMEZONE,
  cityName?: string
): string {
  try {
    if (!startDateTime) return 'Time not specified';
    
    const startDate = parseISO(startDateTime);
    let timeRange = formatInTimeZone(startDate, timezone, 'HH:mm');
    
    if (endDateTime) {
      const endDate = parseISO(endDateTime);
      const endTimeFormatted = formatInTimeZone(endDate, timezone, 'HH:mm');
      timeRange += ` - ${endTimeFormatted}`;
    }
    
    // Add city context if provided (for detail pages)
    if (cityName && timezone !== AMSTERDAM_TIMEZONE) {
      timeRange += ` (${cityName} local time)`;
    }
    
    return timeRange;
  } catch (error) {
    console.error('Error formatting time range:', error);
    return 'Time not specified';
  }
}

/**
 * Format date and time for event cards using start_datetime (in event's local timezone, no location context)
 */
export function formatEventCardDateTime(
  startDateTime: string,
  endDateTime?: string | null,
  timezone: string = AMSTERDAM_TIMEZONE
): string {
  if (!startDateTime) return '';

  try {
    // Check if it's a multi-day event by comparing dates
    if (endDateTime) {
      const startDate = parseISO(startDateTime);
      const endDate = parseISO(endDateTime);
      
      const startDateOnly = formatInTimeZone(startDate, timezone, 'yyyy-MM-dd');
      const endDateOnly = formatInTimeZone(endDate, timezone, 'yyyy-MM-dd');
      
      if (startDateOnly !== endDateOnly) {
        // Multi-day event
        const startFormatted = formatEventDateForCard(startDateTime, timezone);
        const endFormatted = formatEventDateForCard(endDateTime, timezone);
        return `${startFormatted} - ${endFormatted}`;
      }
    }

    const datePart = formatEventDateForCard(startDateTime, timezone);
    const timePart = formatEventTime(startDateTime, timezone);
    
    return `${datePart}, ${timePart}`;
  } catch (error) {
    console.error('Error formatting event card date-time:', error);
    return startDateTime;
  }
}

/**
 * Format event time with location context (for detail pages)
 */
export function formatEventTimeWithLocation(
  dateTimeString: string,
  timezone: string = AMSTERDAM_TIMEZONE,
  cityName?: string
): string {
  try {
    const formattedTime = formatEventTime(dateTimeString, timezone);
    
    if (cityName && timezone !== AMSTERDAM_TIMEZONE) {
      return `${formattedTime} (${cityName} local time)`;
    }
    
    return formattedTime;
  } catch (error) {
    console.error('Error formatting time with location:', error);
    return dateTimeString;
  }
}

/**
 * Get timezone location label
 */
export function getTimezoneLocationLabel(timezone: string, cityName?: string): string {
  if (cityName && timezone !== AMSTERDAM_TIMEZONE) {
    return `${cityName} local time`;
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
