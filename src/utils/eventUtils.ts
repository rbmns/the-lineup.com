
import { Event } from '@/types';
import { DateRange } from 'react-day-picker';
import { addDays, isWithinInterval, parseISO, startOfDay, endOfDay, isSameDay, startOfWeek, endOfWeek, nextMonday, nextSunday } from 'date-fns';

/**
 * Filters events by venue IDs
 */
export const filterEventsByType = (events: Event[], eventTypes: string[]): Event[] => {
  if (!eventTypes.length) return events;
  
  return events.filter(event => 
    event.event_type && eventTypes.includes(event.event_type)
  );
};

/**
 * Filters events by venue IDs
 */
export const filterEventsByVenue = (events: Event[], venueIds: string[]): Event[] => {
  if (!venueIds.length) return events;
  
  return events.filter(event => 
    event.venue_id && venueIds.includes(event.venue_id)
  );
};

/**
 * Filters events by date range or predefined date filter
 */
export const filterEventsByDate = (
  events: Event[], 
  selectedDateFilter?: string,
  dateRange?: DateRange
): Event[] => {
  if (!selectedDateFilter && !dateRange) return events;
  
  const today = startOfDay(new Date());
  
  return events.filter(event => {
    if (!event.start_date) return false;
    
    const eventDate = parseISO(event.start_date);
    
    // Handle custom date range first
    if (dateRange && dateRange.from) {
      const fromDate = startOfDay(dateRange.from);
      let toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(fromDate);
      
      return isWithinInterval(eventDate, { start: fromDate, end: toDate });
    }
    
    // Handle predefined filters
    switch (selectedDateFilter) {
      case 'today':
        return isSameDay(eventDate, today);
        
      case 'tomorrow':
        return isSameDay(eventDate, addDays(today, 1));
        
      case 'this week': {
        const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
        return isWithinInterval(eventDate, { start: weekStart, end: weekEnd });
      }
        
      case 'this weekend': {
        // Weekend is Friday to Sunday
        const friday = addDays(today, (5 - today.getDay()) % 7);
        const sunday = addDays(friday, 2);
        return isWithinInterval(eventDate, { 
          start: startOfDay(friday), 
          end: endOfDay(sunday) 
        });
      }
        
      case 'next week': {
        const nextWeekMonday = nextMonday(today);
        const nextWeekSunday = nextSunday(nextWeekMonday);
        return isWithinInterval(eventDate, { 
          start: startOfDay(nextWeekMonday), 
          end: endOfDay(nextWeekSunday) 
        });
      }
        
      case 'later':
        const twoWeeksFromNow = addDays(today, 14);
        return eventDate >= twoWeeksFromNow;
        
      default:
        return true;
    }
  });
};
