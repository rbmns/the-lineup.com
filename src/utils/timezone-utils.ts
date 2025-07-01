
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
    console.log(`[DEBUG] formatEventTime - Input: ${dateTimeString}, Timezone: ${timezone}`);
    const date = parseISO(dateTimeString);
    console.log(`[DEBUG] formatEventTime - Parsed date object:`, date);
    console.log(`[DEBUG] formatEventTime - Date in UTC: ${date.toISOString()}`);
    
    const result = formatInTimeZone(date, timezone, 'HH:mm');
    console.log(`[DEBUG] formatEventTime - Output: ${result}`);
    
    // Additional debugging for Lisbon time specifically
    if (timezone === 'Europe/Lisbon') {
      const lisbonDate = formatInTimeZone(date, timezone, 'yyyy-MM-dd HH:mm:ss zzz');
      console.log(`[DEBUG] formatEventTime - Full Lisbon format: ${lisbonDate}`);
    }
    
    return result;
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
 * Convert local event time to proper UTC timestamp
 * This fixes the root cause of Portugal timezone issues
 */
export function createEventTimestamp(dateString: string, timeString: string, timezone: string = AMSTERDAM_TIMEZONE): string {
  try {
    console.log(`[DEBUG] createEventTimestamp - Date: ${dateString}, Time: ${timeString}, Timezone: ${timezone}`);
    
    // Create a date in the event's local timezone
    const localDateTimeString = `${dateString}T${timeString}`;
    console.log(`[DEBUG] createEventTimestamp - Local datetime string: ${localDateTimeString}`);
    
    // Parse as local time first
    const localDate = new Date(localDateTimeString);
    console.log(`[DEBUG] createEventTimestamp - Local date parsed: ${localDate.toISOString()}`);
    
    // Now we need to adjust for the timezone offset
    // Get the timezone offset for the specific date/time
    const tempUtcDate = new Date(localDateTimeString + 'Z'); // Treat as UTC temporarily
    const offsetInMs = getTimezoneOffset(tempUtcDate, timezone);
    
    // Apply the correct offset
    const correctUtcDate = new Date(localDate.getTime() - offsetInMs);
    
    console.log(`[DEBUG] createEventTimestamp - Final UTC timestamp: ${correctUtcDate.toISOString()}`);
    
    // Verify the result by converting back to local time
    const verification = formatInTimeZone(correctUtcDate, timezone, 'HH:mm');
    console.log(`[DEBUG] createEventTimestamp - Verification (should match input time ${timeString}): ${verification}`);
    
    return correctUtcDate.toISOString();
  } catch (error) {
    console.error('Error creating event timestamp:', error);
    // Fallback to simple concatenation
    return `${dateString}T${timeString}:00.000Z`;
  }
}

/**
 * Get timezone offset in milliseconds for a specific date and timezone
 */
function getTimezoneOffset(date: Date, timezone: string): number {
  try {
    // Use Intl.DateTimeFormat to get the actual offset
    const utcTime = date.getTime();
    const localTime = new Date(date.toLocaleString('en-US', { timeZone: timezone })).getTime();
    return localTime - utcTime;
  } catch (error) {
    console.error('Error getting timezone offset:', error);
    // Fallback to standard offsets
    switch (timezone) {
      case 'Europe/Lisbon':
        // Check if DST applies (rough approximation)
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const isDST = (month > 3 && month < 10) || 
                     (month === 3 && day >= 25) || 
                     (month === 10 && day < 25);
        return isDST ? -1 * 60 * 60 * 1000 : 0; // WEST = UTC+1, WET = UTC+0
      case 'Europe/Amsterdam':
        return -1 * 60 * 60 * 1000; // Generally UTC+1/+2
      default:
        return 0;
    }
  }
}

/**
 * Format a complete event time range using start_datetime and end_datetime
 */
export function formatEventTimeRange(
  startDateTime: string, 
  endDateTime?: string | null, 
  timezone: string = AMSTERDAM_TIMEZONE
): string {
  try {
    if (!startDateTime) return 'Time not specified';
    
    console.log(`[DEBUG] formatEventTimeRange - Start: ${startDateTime}, End: ${endDateTime}, Timezone: ${timezone}`);
    
    const startDate = parseISO(startDateTime);
    let timeRange = formatInTimeZone(startDate, timezone, 'HH:mm');
    
    if (endDateTime) {
      const endDate = parseISO(endDateTime);
      const endTimeFormatted = formatInTimeZone(endDate, timezone, 'HH:mm');
      timeRange += ` - ${endTimeFormatted}`;
    }
    
    console.log(`[DEBUG] formatEventTimeRange - Output: ${timeRange}`);
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
    console.log(`[DEBUG] formatEventCardDateTime - Start: ${startDateTime}, End: ${endDateTime}, Timezone: ${timezone}`);
    
    // Check if it's a multi-day event by comparing dates
    if (endDateTime) {
      const startDate = parseISO(startDateTime);
      const endDate = parseISO(endDateTime);
      
      const startDateOnly = formatInTimeZone(startDate, timezone, 'yyyy-MM-dd');
      const endDateOnly = formatInTimeZone(endDate, timezone, 'yyyy-MM-dd');
      
      console.log(`[DEBUG] formatEventCardDateTime - Start date: ${startDateOnly}, End date: ${endDateOnly}`);
      
      if (startDateOnly !== endDateOnly) {
        // Multi-day event
        const startFormatted = formatEventDateForCard(startDateTime, timezone);
        const endFormatted = formatEventDateForCard(endDateTime, timezone);
        return `${startFormatted} - ${endFormatted}`;
      }
    }

    const datePart = formatEventDateForCard(startDateTime, timezone);
    const timePart = formatEventTime(startDateTime, timezone);
    
    const result = `${datePart}, ${timePart}`;
    console.log(`[DEBUG] formatEventCardDateTime - Final result: ${result}`);
    return result;
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
