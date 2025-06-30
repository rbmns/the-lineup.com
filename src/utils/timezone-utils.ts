
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
 * UNIFIED DATETIME FORMATTING - Use this for all event datetime display
 * Handles both legacy (date/time fields) and new (timestamptz) formats
 */
export const formatEventDateTime = (
  event: {
    start_datetime?: string;
    start_date?: string;
    start_time?: string;
    timezone?: string;
  },
  displayTimezone?: string
): {
  date: string;
  time: string;
  dateTime: string;
} => {
  const viewerTimezone = displayTimezone || getUserTimezone();
  
  try {
    let eventDateTime: Date;
    
    // Use new timestamptz field if available
    if (event.start_datetime) {
      eventDateTime = new Date(event.start_datetime);
    } 
    // Fallback to legacy date/time fields
    else if (event.start_date && event.start_time) {
      const eventTimezone = event.timezone || 'Europe/Amsterdam';
      const dateTimeStr = `${event.start_date}T${event.start_time}`;
      const parsedDateTime = parseISO(dateTimeStr);
      eventDateTime = toZonedTime(parsedDateTime, eventTimezone);
    }
    else {
      throw new Error('No valid datetime information');
    }
    
    // Format all components in viewer timezone
    const date = formatInTimeZone(eventDateTime, viewerTimezone, 'EEE, d MMM yyyy');
    const time = formatInTimeZone(eventDateTime, viewerTimezone, 'HH:mm');
    const dateTime = `${date}, ${time}`;
    
    return { date, time, dateTime };
  } catch (error) {
    console.error('Error formatting event datetime:', error);
    return {
      date: 'Date not available',
      time: 'Time not available', 
      dateTime: 'Date and time not available'
    };
  }
};

/**
 * Format event end datetime
 */
export const formatEventEndDateTime = (
  event: {
    end_datetime?: string;
    start_datetime?: string;
    start_date?: string;
    end_time?: string;
    timezone?: string;
  },
  displayTimezone?: string
): string => {
  const viewerTimezone = displayTimezone || getUserTimezone();
  
  try {
    let endDateTime: Date;
    
    // Use new timestamptz field if available
    if (event.end_datetime) {
      endDateTime = new Date(event.end_datetime);
    }
    // Fallback to legacy fields with end_time
    else if (event.start_date && event.end_time) {
      const eventTimezone = event.timezone || 'Europe/Amsterdam';
      const dateTimeStr = `${event.start_date}T${event.end_time}`;
      const parsedDateTime = parseISO(dateTimeStr);
      endDateTime = toZonedTime(parsedDateTime, eventTimezone);
    }
    else {
      return '';
    }
    
    return formatInTimeZone(endDateTime, viewerTimezone, 'HH:mm');
  } catch (error) {
    console.error('Error formatting event end datetime:', error);
    return '';
  }
};

/**
 * Legacy function - kept for backward compatibility but now uses unified approach
 */
export const formatEventTime = (
  dateStr: string,
  timeStr: string,
  eventTimezone: string = 'Europe/Amsterdam',
  displayTimezone?: string
): string => {
  const result = formatEventDateTime({
    start_date: dateStr,
    start_time: timeStr,
    timezone: eventTimezone
  }, displayTimezone);
  
  return result.time;
};

/**
 * Legacy function - kept for backward compatibility
 */
export const formatEventDate = (
  dateStr: string,
  eventTimezone: string = 'Europe/Amsterdam',
  displayTimezone?: string
): string => {
  const result = formatEventDateTime({
    start_date: dateStr,
    start_time: '12:00:00', // Dummy time for date formatting
    timezone: eventTimezone
  }, displayTimezone);
  
  return result.date;
};

/**
 * Format for event cards - uses unified approach
 */
export const formatEventCardDateTime = (
  event: {
    start_datetime?: string;
    start_date?: string;
    start_time?: string;
    end_date?: string;
    timezone?: string;
  },
  displayTimezone?: string
): string => {
  // Check if it's a multi-day event
  if (event.end_date && event.start_date && event.end_date !== event.start_date) {
    const startResult = formatEventDateTime(event, displayTimezone);
    const endResult = formatEventDateTime({
      start_date: event.end_date,
      start_time: event.start_time,
      timezone: event.timezone
    }, displayTimezone);
    return `${startResult.date} - ${endResult.date}`;
  }
  
  const result = formatEventDateTime(event, displayTimezone);
  return result.dateTime;
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
 * Legacy function - kept for backward compatibility
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
