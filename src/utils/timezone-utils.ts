
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { parseISO } from 'date-fns';

/**
 * Get the user's browser timezone
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
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
    
    // Create ISO datetime string in event's timezone
    const eventDateTime = `${dateStr}T${timeStr}:00`;
    
    // Parse as a date and treat it as being in the event timezone
    const eventDate = parseISO(eventDateTime);
    
    // Convert from event timezone to viewer timezone and format
    const zonedEventTime = toZonedTime(eventDate, eventTimezone);
    return formatInTimeZone(zonedEventTime, viewerTimezone, 'HH:mm', { timeZone: eventTimezone });
  } catch (error) {
    console.error('Error formatting event time:', error);
    return timeStr.substring(0, 5); // Fallback to original time
  }
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
