
import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';
export const DEFAULT_TIMEZONE = AMSTERDAM_TIMEZONE;

// Get user's timezone, defaulting to Amsterdam
export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || AMSTERDAM_TIMEZONE;
  } catch {
    return AMSTERDAM_TIMEZONE;
  }
};

interface EventDateTimeParams {
  start_datetime?: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  timezone?: string;
}

// Unified function to format event date and time
export const formatEventDateTime = (
  event: EventDateTimeParams,
  viewerTimezone?: string
): { date: string; time: string; dateTime: string } => {
  const targetTimezone = viewerTimezone || getUserTimezone();
  
  try {
    let eventDateTime: Date;
    
    // Use new timestamptz field if available
    if (event.start_datetime) {
      eventDateTime = parseISO(event.start_datetime);
    } 
    // Fallback to legacy fields
    else if (event.start_date && event.start_time) {
      const eventTimezone = event.timezone || AMSTERDAM_TIMEZONE;
      const dateTimeStr = `${event.start_date}T${event.start_time}`;
      eventDateTime = new Date(dateTimeStr + (eventTimezone === AMSTERDAM_TIMEZONE ? '+01:00' : '+00:00'));
    }
    else if (event.start_date) {
      eventDateTime = parseISO(`${event.start_date}T12:00:00`);
    }
    else {
      return { date: 'Date TBD', time: 'Time TBD', dateTime: 'Date and time TBD' };
    }
    
    const date = formatInTimeZone(eventDateTime, targetTimezone, 'EEE, MMM d');
    const time = formatInTimeZone(eventDateTime, targetTimezone, 'HH:mm');
    const dateTime = `${date} at ${time}`;
    
    return { date, time, dateTime };
  } catch (error) {
    console.error('Error formatting event date/time:', error);
    return { date: 'Date error', time: 'Time error', dateTime: 'Date/time error' };
  }
};

// Format end time separately
export const formatEventEndDateTime = (
  event: EventDateTimeParams & { end_time?: string },
  viewerTimezone?: string
): string => {
  const targetTimezone = viewerTimezone || getUserTimezone();
  
  try {
    let endDateTime: Date;
    
    // Use new timestamptz field if available
    if (event.end_datetime) {
      endDateTime = parseISO(event.end_datetime);
    }
    // Fallback to legacy fields
    else if (event.start_date && event.end_time) {
      const eventTimezone = event.timezone || AMSTERDAM_TIMEZONE;
      const dateTimeStr = `${event.start_date}T${event.end_time}`;
      endDateTime = new Date(dateTimeStr + (eventTimezone === AMSTERDAM_TIMEZONE ? '+01:00' : '+00:00'));
    }
    else {
      return '';
    }
    
    return formatInTimeZone(endDateTime, targetTimezone, 'HH:mm');
  } catch (error) {
    console.error('Error formatting end time:', error);
    return '';
  }
};
