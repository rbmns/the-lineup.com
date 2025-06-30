
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
 * Format event time in viewer's timezone
 * Takes a date string, time string, and event timezone, converts to viewer's timezone
 */
export const formatEventTime = (
  dateStr: string,
  timeStr: string,
  eventTimezone: string = 'Europe/Amsterdam',
  displayTimezone?: string
): string => {
  try {
    const viewerTimezone = displayTimezone || getUserTimezone();
    
    // If timezones are the same, no conversion needed
    if (eventTimezone === viewerTimezone) {
      return timeStr.substring(0, 5);
    }
    
    // Create a datetime string representing the event time in the event's timezone
    const eventDateTimeStr = `${dateStr}T${timeStr}`;
    
    // Use formatInTimeZone to directly convert from event timezone to viewer timezone
    // This is much simpler and more reliable than manual conversion
    const eventTime = parseISO(eventDateTimeStr);
    
    // Format the time in the viewer's timezone, treating the input as being in the event timezone
    return formatInTimeZone(eventTime, viewerTimezone, 'HH:mm', {
      timeZone: eventTimezone
    });
  } catch (error) {
    console.error('Error formatting event time:', error, { dateStr, timeStr, eventTimezone, displayTimezone });
    return timeStr.substring(0, 5); // Fallback to original time
  }
};

/**
 * Format event time with timezone abbreviation
 */
export const formatEventTimeWithTimezone = (
  dateStr: string,
  timeStr: string,
  eventTimezone: string = 'Europe/Amsterdam',
  displayTimezone?: string
): string => {
  const viewerTimezone = displayTimezone || getUserTimezone();
  const formattedTime = formatEventTime(dateStr, timeStr, eventTimezone, displayTimezone);
  const tzAbbr = getTimezoneAbbreviation(viewerTimezone);
  
  return `${formattedTime} ${tzAbbr}`;
};

/**
 * Format event date consistently across the app in viewer's timezone
 */
export const formatEventDate = (
  dateStr: string,
  eventTimezone: string = 'Europe/Amsterdam',
  displayTimezone?: string
): string => {
  try {
    const viewerTimezone = displayTimezone || getUserTimezone();
    const date = parseISO(dateStr);
    
    return formatInTimeZone(date, viewerTimezone, 'EEE, d MMM yyyy');
  } catch (error) {
    console.error('Error formatting event date:', error);
    return dateStr;
  }
};

/**
 * Format event date and time for display in cards, showing in viewer's timezone
 */
export const formatEventCardDateTime = (
  startDate: string,
  startTime?: string | null,
  endDate?: string | null,
  eventTimezone: string = 'Europe/Amsterdam',
  displayTimezone?: string
): string => {
  if (!startDate) return '';
  
  const viewerTimezone = displayTimezone || getUserTimezone();
  
  // Check if it's a multi-day event
  if (endDate && endDate !== startDate) {
    const startFormatted = formatEventDate(startDate, eventTimezone, viewerTimezone);
    const endFormatted = formatEventDate(endDate, eventTimezone, viewerTimezone);
    return `${startFormatted} - ${endFormatted}`;
  }
  
  try {
    const datePart = formatEventDate(startDate, eventTimezone, viewerTimezone);
    
    if (!startTime) {
      return datePart;
    }
    
    // Don't show timezone abbreviation - just the converted time
    const timePart = formatEventTime(startDate, startTime, eventTimezone, viewerTimezone);
    return `${datePart}, ${timePart}`;
  } catch (error) {
    console.error('Error formatting event card date-time:', error);
    return startDate;
  }
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
  
  const eventDateTime = `${dateStr}T${timeStr}:00`;
  const eventDate = parseISO(eventDateTime);
  
  // Convert to the event's timezone
  return toZonedTime(eventDate, eventTimezone);
};
