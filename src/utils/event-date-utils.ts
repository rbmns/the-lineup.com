
import { Event } from '@/types';
import { addDays, startOfWeek } from 'date-fns';

/**
 * Get the full week range array for calendar views
 */
export const getWeekRange = (date: Date): Date[] => {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
};

/**
 * Gets the event datetime from an event object
 */
export const getEventDateTime = (event: Event): string => {
  if (!event) return '';
  
  if (event.start_time && event.start_time.includes('T')) {
    return event.start_time;
  }
  
  if (event.start_date && event.start_time) {
    return combineDateAndTime(event.start_date, event.start_time);
  }
  
  return event.start_date || '';
};

/**
 * Gets the event end datetime from an event object
 */
export const getEventEndDateTime = (event: Event): string => {
  if (!event) return '';
  
  if (event.end_time && event.end_time.includes('T')) {
    return event.end_time;
  }
  
  if (event.start_date && event.end_time) {
    return combineDateAndTime(event.start_date, event.end_time);
  }
  
  return '';
};

/**
 * Combines a date string with a time string to produce an ISO datetime string
 */
export const combineDateAndTime = (dateStr: string, timeStr: string): string => {
  try {
    // Convert the date string to a Date object
    const date = new Date(dateStr);
    
    // Extract hours and minutes from the time string
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Set the hours and minutes on the date
    date.setHours(hours);
    date.setMinutes(minutes);
    
    // Return an ISO string
    return date.toISOString();
  } catch (error) {
    console.error('Error combining date and time:', error);
    return '';
  }
};

/**
 * Checks if an event is a multi-day event
 */
export const isMultiDayEvent = (event: Event): boolean => {
  if (!event.start_date || !event.end_date) return false;
  
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  
  // Compare dates without time
  const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  
  return endDateOnly > startDateOnly;
};

/**
 * Gets a formatted date range for multi-day events
 */
export const getMultiDayDateRange = (event: Event): string => {
  if (!isMultiDayEvent(event)) return '';
  
  const startDate = new Date(event.start_date!);
  const endDate = new Date(event.end_date!);
  
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: startDate.getFullYear() !== endDate.getFullYear() ? 'numeric' : undefined
  };
  
  const startFormatted = startDate.toLocaleDateString('en-US', options);
  const endFormatted = endDate.toLocaleDateString('en-US', options);
  
  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Checks if a given date falls within a multi-day event's range
 */
export const isDateInEventRange = (date: Date, event: Event): boolean => {
  if (!isMultiDayEvent(event)) {
    // For single-day events, check if it matches the start date
    if (!event.start_date) return false;
    const eventDate = new Date(event.start_date);
    return date.toDateString() === eventDate.toDateString();
  }
  
  const startDate = new Date(event.start_date!);
  const endDate = new Date(event.end_date!);
  
  // Remove time components for date comparison
  const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  
  return checkDate >= startDateOnly && checkDate <= endDateOnly;
};
