
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

// Get common timezones for form selection
export const getCommonTimezones = () => {
  return [
    { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
    { value: 'America/New_York', label: 'New York (EST/EDT)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  ];
};

interface EventDateTimeParams {
  start_datetime?: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_datetime?: string;
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
    
    const date = formatInTimeZone(eventDateTime, targetTimezone, 'EEE, d MMM');
    const time = formatInTimeZone(eventDateTime, targetTimezone, 'HH:mm');
    const dateTime = `${date}, ${time}`;
    
    return { date, time, dateTime };
  } catch (error) {
    console.error('Error formatting event date/time:', error);
    return { date: 'Date error', time: 'Time error', dateTime: 'Date/time error' };
  }
};

// Format end time separately
export const formatEventEndDateTime = (
  event: EventDateTimeParams & { end_time?: string; end_datetime?: string },
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

// Legacy function exports for backward compatibility
export const formatEventTime = (dateString: string, timeString: string, timezone: string = AMSTERDAM_TIMEZONE): string => {
  try {
    const dateTimeStr = `${dateString}T${timeString}`;
    const eventDateTime = new Date(dateTimeStr + (timezone === AMSTERDAM_TIMEZONE ? '+01:00' : '+00:00'));
    return formatInTimeZone(eventDateTime, timezone, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString.split(':').slice(0, 2).join(':'); // fallback to HH:MM
  }
};

export const formatEventDate = (dateString: string, timezone: string = AMSTERDAM_TIMEZONE): string => {
  try {
    const date = parseISO(dateString);
    return formatInTimeZone(date, timezone, 'EEE, d MMM, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const formatEventCardDateTime = (
  startDate: string, 
  startTime?: string, 
  endDate?: string, 
  timezone: string = AMSTERDAM_TIMEZONE
): string => {
  try {
    if (endDate && startDate !== endDate) {
      // Multi-day event
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const startFormatted = formatInTimeZone(start, timezone, 'MMM d');
      const endFormatted = formatInTimeZone(end, timezone, 'MMM d');
      return `${startFormatted} - ${endFormatted}`;
    } else {
      // Single day event
      const date = parseISO(startDate);
      const dateFormatted = formatInTimeZone(date, timezone, 'EEE, d MMM');
      if (startTime) {
        const timeFormatted = formatEventTime(startDate, startTime, timezone);
        return `${dateFormatted}, ${timeFormatted}`;
      }
      return dateFormatted;
    }
  } catch (error) {
    console.error('Error formatting card date time:', error);
    return startDate;
  }
};
