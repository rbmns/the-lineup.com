
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { parseISO, format } from 'date-fns';

/**
 * Get the user's browser timezone
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Get timezone abbreviation for display
 */
export const getTimezoneAbbreviation = (timezone: string): string => {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    const parts = formatter.formatToParts(date);
    const timeZonePart = parts.find(part => part.type === 'timeZoneName');
    return timeZonePart?.value || timezone.split('/').pop() || timezone;
  } catch (error) {
    return timezone.split('/').pop() || timezone;
  }
};

/**
 * Get a human-readable location label for timezone display
 */
export const getTimezoneLocationLabel = (timezone: string, city?: string): string => {
  // If we have a city from the venue, use it
  if (city) {
    return `Local time (${city})`;
  }
  
  // Map common timezones to friendly location names
  const timezoneLocationMap: Record<string, string> = {
    'Europe/Amsterdam': 'Amsterdam time',
    'Europe/Lisbon': 'Lisbon time',
    'Europe/London': 'London time',
    'Europe/Berlin': 'Berlin time',
    'Europe/Paris': 'Paris time',
    'Europe/Madrid': 'Madrid time',
    'Europe/Rome': 'Rome time',
    'America/New_York': 'New York time',
    'America/Los_Angeles': 'Los Angeles time',
    'Asia/Tokyo': 'Tokyo time',
    'Australia/Sydney': 'Sydney time',
  };
  
  return timezoneLocationMap[timezone] || `Local time`;
};

/**
 * Format event time in the event's local timezone (not viewer's timezone)
 * Always shows the time as it appears locally at the event location
 */
export const formatEventTime = (
  dateStr: string,
  timeStr: string,
  eventTimezone: string = 'Europe/Amsterdam'
): string => {
  try {
    // Simply format the time as it would appear in the event's timezone
    const eventDateTimeStr = `${dateStr}T${timeStr}`;
    const eventDateTime = parseISO(eventDateTimeStr);
    
    // Format in the event's timezone (this is what locals would see)
    return formatInTimeZone(eventDateTime, eventTimezone, 'HH:mm');
  } catch (error) {
    console.error('Error formatting event time:', error, { dateStr, timeStr, eventTimezone });
    return timeStr.substring(0, 5); // Fallback to original time
  }
};

/**
 * Format event time with location-based label
 */
export const formatEventTimeWithLocation = (
  dateStr: string,
  timeStr: string,
  eventTimezone: string = 'Europe/Amsterdam',
  city?: string
): string => {
  const formattedTime = formatEventTime(dateStr, timeStr, eventTimezone);
  const locationLabel = getTimezoneLocationLabel(eventTimezone, city);
  
  return `${formattedTime} · ${locationLabel}`;
};

/**
 * Format event date consistently across the app in the event's timezone
 */
export const formatEventDate = (
  dateStr: string,
  eventTimezone: string = 'Europe/Amsterdam'
): string => {
  try {
    const date = parseISO(dateStr);
    return formatInTimeZone(date, eventTimezone, 'EEE, d MMM yyyy');
  } catch (error) {
    console.error('Error formatting event date:', error);
    return dateStr;
  }
};

/**
 * Format event date and time for display in cards, showing in event's local timezone
 */
export const formatEventCardDateTime = (
  startDate: string,
  startTime?: string | null,
  endDate?: string | null,
  eventTimezone: string = 'Europe/Amsterdam',
  city?: string
): string => {
  if (!startDate) return '';
  
  // Check if it's a multi-day event
  if (endDate && endDate !== startDate) {
    const startFormatted = formatEventDate(startDate, eventTimezone);
    const endFormatted = formatEventDate(endDate, eventTimezone);
    return `${startFormatted} - ${endFormatted}`;
  }
  
  try {
    const datePart = formatEventDate(startDate, eventTimezone);
    
    if (!startTime) {
      return datePart;
    }
    
    const timePart = formatEventTimeWithLocation(startDate, startTime, eventTimezone, city);
    return `${datePart}, ${timePart}`;
  } catch (error) {
    console.error('Error formatting event card date-time:', error);
    return startDate;
  }
};

/**
 * Format time range for event details (start - end time)
 */
export const formatEventTimeRange = (
  dateStr: string,
  startTime?: string | null,
  endTime?: string | null,
  eventTimezone: string = 'Europe/Amsterdam',
  city?: string
): string => {
  if (!startTime) return '';
  
  const startFormatted = formatEventTime(dateStr, startTime, eventTimezone);
  
  if (!endTime) {
    const locationLabel = getTimezoneLocationLabel(eventTimezone, city);
    return `${startFormatted} · ${locationLabel}`;
  }
  
  const endFormatted = formatEventTime(dateStr, endTime, eventTimezone);
  const locationLabel = getTimezoneLocationLabel(eventTimezone, city);
  
  return `${startFormatted} – ${endFormatted} · ${locationLabel}`;
};

/**
 * Get available timezones for event creation
 */
export const getCommonTimezones = () => [
  { value: 'Europe/Amsterdam', label: 'Amsterdam (Netherlands)' },
  { value: 'Europe/Lisbon', label: 'Lisbon (Portugal)' },
  { value: 'Europe/London', label: 'London (UK)' },
  { value: 'Europe/Berlin', label: 'Berlin (Germany)' },
  { value: 'Europe/Paris', label: 'Paris (France)' },
  { value: 'Europe/Madrid', label: 'Madrid (Spain)' },
  { value: 'Europe/Rome', label: 'Rome (Italy)' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (Japan)' },
  { value: 'Australia/Sydney', label: 'Sydney (Australia)' },
];

/**
 * Create a proper Date object from date and time strings in a specific timezone
 */
export const createEventDateTime = (
  dateStr: string, 
  timeStr: string, 
  eventTimezone: string = 'Europe/Amsterdam'
): Date => {
  if (!dateStr || !timeStr) {
    throw new Error('Date and time are required');
  }
  
  const eventDateTime = `${dateStr}T${timeStr}`;
  const eventDate = parseISO(eventDateTime);
  
  // Convert to the event's timezone
  return toZonedTime(eventDate, eventTimezone);
};
