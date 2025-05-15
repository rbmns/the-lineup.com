
import { useState, useCallback, useEffect } from 'react';
import { Event } from '@/types';
import { filterUpcomingEvents, filterEventsByDateFilter, isEventStillRelevant } from '@/utils/dateUtils';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { subMinutes } from 'date-fns';

export const useEventFiltersLogic = (
  events: Event[] | undefined = [],
  userId: string | undefined = undefined,
  selectedEventTypes: string[],
  selectedVenues: string[],
  dateRange: any,
  selectedDateFilter: string
) => {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Apply filters
  const applyFilters = useCallback(async () => {
    if (!events || events.length === 0) {
      setFilteredEvents([]);
      return;
    }

    setIsFilterLoading(true);
    
    try {
      // Create a map of event IDs to their RSVP statuses from the original events
      const rsvpStatusMap = new Map<string, 'Going' | 'Interested' | undefined>();
      events.forEach(event => {
        if (event.id && event.rsvp_status) {
          rsvpStatusMap.set(event.id, event.rsvp_status);
        }
      });
      
      console.log('RSVP status map before filtering:', Object.fromEntries(rsvpStatusMap));
      
      let query = supabase.from('events').select(`
        *,
        creator:profiles(id, username, avatar_url, email, location, status, tagline),
        venues:venue_id(*),
        event_rsvps(id, user_id, status)
      `);
      
      const hasFilters = selectedEventTypes.length > 0 || selectedVenues.length > 0 || 
                         dateRange?.from || selectedDateFilter;
      
      // Apply 30 minute cutoff filter
      const thirtyMinutesAgo = subMinutes(new Date(), 30);
      query = query.gte('start_time', thirtyMinutesAgo.toISOString());
      
      // Apply event type filter
      if (selectedEventTypes.length > 0) {
        query = query.in('event_type', selectedEventTypes);
      }
      
      // Apply venue filter
      if (selectedVenues.length > 0) {
        query = query.in('venue_id', selectedVenues);
      }
      
      // Apply date filter logic - enhanced for better range filtering
      if (dateRange?.from) {
        // For start date, we want events that start on or after this date
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0); // Beginning of the day
        
        query = query.gte('start_time', fromDate.toISOString());
        
        if (dateRange.to) {
          // For end date, we want events that start on or before this date
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999); // End of the day
          query = query.lte('start_time', toDate.toISOString());
        }
        
        console.log(`Applying date range filter: ${fromDate.toISOString()} to ${dateRange.to ? new Date(dateRange.to).toISOString() : 'none'}`);
      } else if (selectedDateFilter) {
        // If using predefined date filter like "today", "this week", etc.
        // We'll apply this later in memory since it requires more complex logic
        console.log(`Selected date filter: ${selectedDateFilter} - will be applied after database query`);
      }
      
      // Execute query
      const { data, error } = await query.order('start_time', { ascending: true });
      
      if (error) throw error;
      
      // If there are no filters, return all upcoming events with preserved RSVP status
      if (!hasFilters) {
        const upcomingEvents = filterUpcomingEvents(events).map(event => {
          if (event.id) {
            return {...event};
          }
          return event;
        });
        setFilteredEvents(upcomingEvents);
        setIsFilterLoading(false);
        return;
      }
      
      if (data && data.length > 0) {
        // Process data into Event objects
        const formatted = data.map(item => {
          const eventRsvps = item.event_rsvps || [];
          
          // Get the user's RSVP status for this event
          let userRsvpStatus: 'Going' | 'Interested' | undefined = undefined;
          
          // First check if we have it in our map from the original events
          if (item.id && rsvpStatusMap.has(item.id)) {
            userRsvpStatus = rsvpStatusMap.get(item.id);
          }
          
          // If not found in map, check if we have it in the current query results
          if (!userRsvpStatus && userId) {
            const userRsvp = eventRsvps.find((rsvp: any) => rsvp.user_id === userId);
            if (userRsvp) {
              userRsvpStatus = userRsvp.status as 'Going' | 'Interested';
            }
          }
          
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            start_time: item.start_time,
            end_time: item.end_time,
            created_at: item.created_at,
            updated_at: item.updated_at,
            venue_id: item.venue_id,
            venues: item.venues,
            event_type: item.event_type,
            creator: item.creator,
            image_urls: item.image_urls || [],
            fee: item.fee,
            tags: item.tags,
            rsvp_status: userRsvpStatus, // Preserve the user's RSVP status
            attendees: {
              going: eventRsvps.filter((rsvp: any) => rsvp.status === 'Going').length,
              interested: eventRsvps.filter((rsvp: any) => rsvp.status === 'Interested').length
            },
            isExactMatch: true // Mark these as exact matches since they match database queries
          } as Event;
        });
        
        // Apply additional date filter if using predefined filter
        let finalEvents = formatted;
        if (selectedDateFilter && !dateRange?.from) {
          console.log(`Applying client-side date filter: ${selectedDateFilter}`);
          finalEvents = filterEventsByDateFilter(finalEvents, selectedDateFilter);
          console.log(`After date filter: ${finalEvents.length} events remain`);
        }
        
        // Apply the 30-minute cutoff again as a safeguard (just in case)
        const relevantEvents = finalEvents.filter(event => {
          return event.start_time && isEventStillRelevant(event.start_time);
        });
        
        console.log(`Final filtered events: ${relevantEvents.length}`);
        console.log('RSVP statuses in filtered events:', relevantEvents.map(e => ({id: e.id, status: e.rsvp_status})));
        setFilteredEvents(relevantEvents);
      } else {
        // No matches found, return empty array
        setFilteredEvents([]);
      }
    } catch (err) {
      console.error('Error applying filters:', err);
      toast.error('Error filtering events');
      
      // Fall back to client-side filtering for basic functionality
      if (events.length > 0) {
        const upcomingEvents = filterUpcomingEvents(events);
        setFilteredEvents(upcomingEvents);
      } else {
        setFilteredEvents([]);
      }
    } finally {
      setIsFilterLoading(false);
    }
  }, [events, selectedEventTypes, selectedVenues, dateRange, selectedDateFilter, userId]);
  
  // Effect hook to apply filters when filter values change
  useEffect(() => {
    console.log("Filters changed. Applying filters with these parameters:", {
      eventTypesCount: selectedEventTypes.length,
      venuesCount: selectedVenues.length,
      dateRange: dateRange,
      dateFilter: selectedDateFilter
    });
    
    // Even if no filters are active, we want to show upcoming events
    applyFilters();
    
  }, [selectedEventTypes, selectedVenues, dateRange, selectedDateFilter, applyFilters]);

  return {
    filteredEvents,
    isFilterLoading
  };
};
