
import { formatInTimeZone } from 'date-fns-tz';

/**
 * Get the user's browser timezone
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Convert a time string and date to a proper Date object in the event's timezone
 */
export const createEventDateTime = (
  dateStr: string, 
  timeStr: string, 
  eventTimezone: string = 'Europe/Amsterdam'
): Date => {
  if (!dateStr || !timeStr) {
    throw new Error('Date and time are required');
  }
  
  // Create the datetime string in the event's timezone
  const datetimeStr = `${dateStr}T${timeStr}:00`;
  
  // Parse as if it's in the event's timezone
  // Note: This creates a Date object that represents the correct UTC time
  const date = new Date(datetimeStr);
  
  // Adjust for timezone offset difference
  const eventOffset = getTimezoneOffset(eventTimezone, date);
  const localOffset = date.getTimezoneOffset() * 60000; // Convert to milliseconds
  
  return new Date(date.getTime() - eventOffset + localOffset);
};

/**
 * Get timezone offset in milliseconds for a given timezone at a specific date
 */
const getTimezoneOffset = (timezone: string, date: Date): number => {
  const utc1 = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const utc2 = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  return utc2.getTime() - utc1.getTime();
};

/**
 * Format event time consistently across the app
 */
export const formatEventTime = (
  dateStr: string,
  timeStr: string,
  eventTimezone: string = 'Europe/Amsterdam',
  displayTimezone?: string
): string => {
  try {
    const eventDate = createEventDateTime(dateStr, timeStr, eventTimezone);
    const targetTimezone = displayTimezone || eventTimezone;
    
    return formatInTimeZone(eventDate, targetTimezone, 'HH:mm');
  } catch (error) {
    console.error('Error formatting event time:', error);
    return timeStr.substring(0, 5); // Fallback to original time
  }
};

/**
 * Format event date consistently across the app
 */
export const formatEventDate = (
  dateStr: string,
  eventTimezone: string = 'Europe/Amsterdam',
  displayTimezone?: string
): string => {
  try {
    const date = new Date(dateStr);
    const targetTimezone = displayTimezone || eventTimezone;
    
    return formatInTimeZone(date, targetTimezone, 'EEE, d MMM yyyy');
  } catch (error) {
    console.error('Error formatting event date:', error);
    return dateStr;
  }
};

/**
 * Format event date and time for display in cards
 */
export const formatEventCardDateTime = (
  startDate: string,
  startTime?: string | null,
  endDate?: string | null,
  eventTimezone: string = 'Europe/Amsterdam',
  displayTimezone?: string
): string => {
  if (!startDate) return '';
  
  // Check if it's a multi-day event
  if (endDate && endDate !== startDate) {
    const startFormatted = formatEventDate(startDate, eventTimezone, displayTimezone);
    const endFormatted = formatEventDate(endDate, eventTimezone, displayTimezone);
    return `${startFormatted} - ${endFormatted}`;
  }
  
  try {
    const datePart = formatEventDate(startDate, eventTimezone, displayTimezone);
    
    if (!startTime) {
      return datePart;
    }
    
    const timePart = formatEventTime(startDate, startTime, eventTimezone, displayTimezone);
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
