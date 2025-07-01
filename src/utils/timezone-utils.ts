
import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

/**
 * Format event date for card display (e.g., "Wed, 2 Jul")
 */
export function formatEventDateForCard(dateTimeString: string, timezone: string = 'Europe/Amsterdam'): string {
  try {
    if (!dateTimeString) return 'Date TBD';
    
    const date = parseISO(dateTimeString);
    return formatInTimeZone(date, timezone, 'EEE, d MMM');
  } catch (error) {
    console.error('Error formatting event date for card:', error);
    return 'Date TBD';
  }
}

/**
 * Format event time (e.g., "19:00" or "09:00")
 */
export function formatEventTime(dateTimeString: string, timezone: string = 'Europe/Amsterdam'): string {
  try {
    if (!dateTimeString) return 'Time TBD';
    
    const date = parseISO(dateTimeString);
    return formatInTimeZone(date, timezone, 'HH:mm');
  } catch (error) {
    console.error('Error formatting event time:', error);
    return 'Time TBD';
  }
}

/**
 * Format event datetime for display (e.g., "Wed, 2 Jul at 19:00")
 */
export function formatEventDateTime(dateTimeString: string, timezone: string = 'Europe/Amsterdam'): string {
  try {
    if (!dateTimeString) return 'Date & Time TBD';
    
    const date = parseISO(dateTimeString);
    return formatInTimeZone(date, timezone, 'EEE, d MMM \'at\' HH:mm');
  } catch (error) {
    console.error('Error formatting event datetime:', error);
    return 'Date & Time TBD';
  }
}

/**
 * Format event date for detail display (e.g., "Sunday, January 15, 2024")
 */
export function formatEventDate(dateTimeString: string, timezone: string = 'Europe/Amsterdam'): string {
  try {
    if (!dateTimeString) return 'Date TBD';
    
    const date = parseISO(dateTimeString);
    return formatInTimeZone(date, timezone, 'EEEE, MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting event date:', error);
    return 'Date TBD';
  }
}

/**
 * Format event time range (e.g., "19:00 - 21:00" or "19:00")
 */
export function formatEventTimeRange(startDateTime: string, endDateTime?: string, timezone: string = 'Europe/Amsterdam'): string {
  try {
    if (!startDateTime) return 'Time TBD';
    
    const startTime = formatEventTime(startDateTime, timezone);
    
    if (!endDateTime) {
      return startTime;
    }
    
    const endTime = formatEventTime(endDateTime, timezone);
    return `${startTime} – ${endTime}`;
  } catch (error) {
    console.error('Error formatting event time range:', error);
    return 'Time TBD';
  }
}

/**
 * Format event card datetime - for card displays with date and time
 */
export function formatEventCardDateTime(startDateTime: string, endDateTime?: string, timezone: string = 'Europe/Amsterdam'): string {
  try {
    if (!startDateTime) return 'Date & Time TBD';
    
    const startDate = parseISO(startDateTime);
    const endDate = endDateTime ? parseISO(endDateTime) : null;
    
    // Check if it's a multi-day event
    const isMultiDay = endDate && 
      format(startDate, 'yyyy-MM-dd') !== format(endDate, 'yyyy-MM-dd');
    
    if (isMultiDay) {
      // Multi-day event: show date range
      const startFormatted = formatEventDateForCard(startDateTime, timezone);
      const endFormatted = formatEventDateForCard(endDateTime!, timezone);
      return `${startFormatted} - ${endFormatted}`;
    } else {
      // Single day event: show date and time
      const dateFormatted = formatEventDateForCard(startDateTime, timezone);
      const timeRange = formatEventTimeRange(startDateTime, endDateTime, timezone);
      return `${dateFormatted}, ${timeRange}`;
    }
  } catch (error) {
    console.error('Error formatting event card datetime:', error);
    return 'Date & Time TBD';
  }
}

/**
 * Format full event date and time range
 */
export function formatEventDateTimeRange(
  startDateTime: string, 
  endDateTime?: string, 
  timezone: string = 'Europe/Amsterdam'
): string {
  try {
    if (!startDateTime) return 'Date & Time TBD';
    
    const startDate = parseISO(startDateTime);
    const startFormatted = formatInTimeZone(startDate, timezone, 'EEE, d MMM \'at\' HH:mm');
    
    if (!endDateTime) {
      return startFormatted;
    }
    
    const endDate = parseISO(endDateTime);
    const isSameDay = format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd');
    
    if (isSameDay) {
      // Same day: "Wed, 2 Jul at 19:00 - 21:00"
      const endTime = formatInTimeZone(endDate, timezone, 'HH:mm');
      return `${startFormatted} - ${endTime}`;
    } else {
      // Different days: "Wed, 2 Jul at 19:00 - Thu, 3 Jul at 21:00"
      const endFormatted = formatInTimeZone(endDate, timezone, 'EEE, d MMM \'at\' HH:mm');
      return `${startFormatted} - ${endFormatted}`;
    }
  } catch (error) {
    console.error('Error formatting event datetime range:', error);
    return 'Date & Time TBD';
  }
}

/**
 * Create a Date object from event datetime string
 */
export function createEventDateTime(dateTimeString: string): Date {
  try {
    if (!dateTimeString) throw new Error('No datetime string provided');
    return parseISO(dateTimeString);
  } catch (error) {
    console.error('Error creating event datetime:', error);
    throw error;
  }
}

/**
 * Get user's timezone
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error('Error getting user timezone:', error);
    return 'Europe/Amsterdam';
  }
}

/**
 * Get common timezones for selection
 */
export function getCommonTimezones(): { value: string; label: string }[] {
  return [
    { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
    { value: 'America/New_York', label: 'New York (EST/EDT)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
  ];
}

// Constants
export const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';
