
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
