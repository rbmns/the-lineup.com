
import { formatInTimeZone } from 'date-fns-tz';
import { parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { formatEventDateTime } from './timezone-utils';

export const getWeekRange = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 }); // Sunday
  return { start, end };
};

export const getEventDateTime = (event: any): Date | null => {
  try {
    if (event.start_datetime) {
      return parseISO(event.start_datetime);
    }
    if (event.start_date && event.start_time) {
      return parseISO(`${event.start_date}T${event.start_time}`);
    }
    if (event.start_date) {
      return parseISO(`${event.start_date}T12:00:00`);
    }
    return null;
  } catch (error) {
    console.error('Error parsing event datetime:', error);
    return null;
  }
};

export const getEventEndDateTime = (event: any): Date | null => {
  try {
    if (event.end_datetime) {
      return parseISO(event.end_datetime);
    }
    if (event.start_date && event.end_time) {
      return parseISO(`${event.start_date}T${event.end_time}`);
    }
    return null;
  } catch (error) {
    console.error('Error parsing event end datetime:', error);
    return null;
  }
};

export const combineDateAndTime = (date: string, time: string): string => {
  return `${date}T${time}`;
};

export const getMultiDayDateRange = (startDate: string, endDate: string): string => {
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const startFormatted = formatInTimeZone(start, 'Europe/Amsterdam', 'MMM d');
    const endFormatted = formatInTimeZone(end, 'Europe/Amsterdam', 'MMM d');
    return `${startFormatted} - ${endFormatted}`;
  } catch (error) {
    console.error('Error formatting multi-day range:', error);
    return `${startDate} - ${endDate}`;
  }
};

export const isDateInEventRange = (date: Date, event: any): boolean => {
  const eventStart = getEventDateTime(event);
  const eventEnd = getEventEndDateTime(event);
  
  if (!eventStart) return false;
  
  if (eventEnd) {
    return date >= eventStart && date <= eventEnd;
  }
  
  // Single day event - check if same day
  return date.toDateString() === eventStart.toDateString();
};
