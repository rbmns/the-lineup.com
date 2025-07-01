
import { Event } from '@/types';

/**
 * Filter events to only show upcoming ones (starting from today)
 */
export function filterUpcomingEvents(events: Event[]): Event[] {
  const now = new Date();
  
  return events.filter(event => {
    if (!event.start_datetime) {
      return true; // Include events without start_datetime
    }
    
    try {
      const eventDateTime = new Date(event.start_datetime);
      return eventDateTime >= now;
    } catch (error) {
      console.error('Error parsing event start_datetime:', error);
      return true; // Include events with invalid dates to avoid hiding them
    }
  });
}

/**
 * Filter events based on a date range or predefined date filter
 */
export function filterEventsByDateRange(
  event: Event, 
  selectedDateFilter: string, 
  dateRange?: { from?: Date; to?: Date }
): boolean {
  if (!event.start_datetime) {
    return true; // Include events without start_datetime
  }

  try {
    const eventDateTime = new Date(event.start_datetime);
    
    // If custom date range is provided, use it
    if (dateRange?.from) {
      if (eventDateTime < dateRange.from) {
        return false;
      }
      if (dateRange.to && eventDateTime > dateRange.to) {
        return false;
      }
      return true;
    }
    
    // Handle predefined filters
    if (selectedDateFilter && selectedDateFilter !== 'anytime') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (selectedDateFilter) {
        case 'today':
          const todayEnd = new Date(today);
          todayEnd.setHours(23, 59, 59, 999);
          return eventDateTime >= today && eventDateTime <= todayEnd;
          
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowEnd = new Date(tomorrow);
          tomorrowEnd.setHours(23, 59, 59, 999);
          return eventDateTime >= tomorrow && eventDateTime <= tomorrowEnd;
          
        case 'this week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);
          return eventDateTime >= weekStart && eventDateTime <= weekEnd;
          
        case 'this weekend':
          const dayOfWeek = today.getDay();
          const daysUntilSaturday = (6 - dayOfWeek) % 7;
          const saturday = new Date(today);
          saturday.setDate(today.getDate() + daysUntilSaturday);
          const sunday = new Date(saturday);
          sunday.setDate(saturday.getDate() + 1);
          sunday.setHours(23, 59, 59, 999);
          return eventDateTime >= saturday && eventDateTime <= sunday;
          
        case 'next week':
          const nextWeekStart = new Date(today);
          nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
          const nextWeekEnd = new Date(nextWeekStart);
          nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
          nextWeekEnd.setHours(23, 59, 59, 999);
          return eventDateTime >= nextWeekStart && eventDateTime <= nextWeekEnd;
          
        default:
          return true;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error filtering event by date range:', error);
    return true; // Include events with invalid dates to avoid hiding them
  }
}
