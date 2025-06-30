
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
 * Format event time in viewer's timezone (or specified display timezone)
 */
export const formatEventTime = (
  dateStr: string,
  timeStr: string,
  eventTimezone: string = 'Europe/Amsterdam',
  displayTimezone?: string
): string => {
  try {
    const viewerTimezone = displayTimezone || getUserTimezone();
    
    // Create a proper datetime string for the event timezone
    const eventDateTime = `${dateStr}T${timeStr}:00`;
    
    // Parse the datetime as if it's in the event's timezone
    const utcTime = new Date(eventDateTime + (eventTimezone === 'UTC' ? 'Z' : ''));
    
    // If the event timezone is not UTC, we need to adjust
    if (eventTimezone !== 'UTC') {
      // Create a temporary date to get the offset
      const tempDate = new Date(eventDateTime);
      const eventOffset = getTimezoneOffsetMinutes(eventTimezone, tempDate);
      const adjustedTime = new Date(tempDate.getTime() - (eventOffset * 60000));
      
      // Format in viewer's timezone
      return formatInTimeZone(adjustedTime, viewerTimezone, 'HH:mm');
    }
    
    // Format in viewer's timezone
    return formatInTimeZone(utcTime, viewerTimezone, 'HH:mm');
  } catch (error) {
    console.error('Error formatting event time:', error);
    return timeStr.substring(0, 5); // Fallback to original time
  }
};

/**
 * Get timezone offset in minutes for a given timezone at a specific date
 */
const getTimezoneOffsetMinutes = (timezone: string, date: Date): number => {
  const utcTime = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const timezoneTime = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  return (timezoneTime.getTime() - utcTime.getTime()) / (1000 * 60);
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
    const date = new Date(dateStr);
    
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
