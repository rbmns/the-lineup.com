
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { RelatedEventsGrid } from './RelatedEventsGrid';
import { RelatedEventsLoader } from './RelatedEventsLoader';
import { Event } from '@/types';

interface RelatedEventsProps {
  eventId: string;
  eventType: string;
  startDate: string;
  tags?: string[] | string | null;
  vibe?: string | null;
}

export const RelatedEvents: React.FC<RelatedEventsProps> = ({ 
  eventId, 
  eventType, 
  startDate,
  tags,
  vibe
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    // Get the element to observe
    const elementToObserve = document.getElementById('related-events-section');
    if (elementToObserve) {
      observer.observe(elementToObserve);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Function to parse tags into array format
  const parseTags = (tagInput: string[] | string | null): string[] => {
    if (!tagInput) return [];
    if (Array.isArray(tagInput)) return tagInput.filter(Boolean);
    if (typeof tagInput === 'string') {
      return tagInput.split(',').map(tag => tag.trim()).filter(Boolean);
    }
    return [];
  };

  // Get the event tags as an array
  const eventTags = parseTags(tags);

  // Parse date for more intelligent date filtering
  const parseEventDate = (dateStr: string): Date | null => {
    try {
      return new Date(dateStr);
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  };

  const eventDate = parseEventDate(startDate);
  
  // Calculate date ranges for more intelligent similar event finding
  const getDateRanges = (): { sameDay: string, nextDay: string, nextWeek: string, prevDay: string } => {
    const today = eventDate || new Date();
    
    // Clone the date to avoid mutation
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    
    const prevDay = new Date(today);
    prevDay.setDate(today.getDate() - 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return {
      sameDay: today.toISOString().split('T')[0],
      nextDay: nextDay.toISOString().split('T')[0],
      prevDay: prevDay.toISOString().split('T')[0],
      nextWeek: nextWeek.toISOString().split('T')[0]
    };
  };

  const dateRanges = getDateRanges();

  // Query for related events
  const { data: relatedEvents, isLoading, error } = useQuery({
    queryKey: ['related-events', eventId, eventType, startDate, tags, vibe],
    queryFn: async () => {
      // First priority: Same event type, same day
      if (eventType && dateRanges.sameDay) {
        const { data: sameTypeAndDay } = await supabase
          .from('events')
          .select('*')
          .neq('id', eventId) // Exclude current event
          .eq('event_type', eventType)
          .eq('start_date', dateRanges.sameDay)
          .limit(4);
          
        if (sameTypeAndDay && sameTypeAndDay.length >= 3) {
          console.log('Found related events with same type and day:', sameTypeAndDay.length);
          return sameTypeAndDay;
        }
      }
      
      // Second priority: Same event type, next day
      if (eventType && dateRanges.nextDay) {
        const { data: sameTypeNextDay } = await supabase
          .from('events')
          .select('*')
          .neq('id', eventId) // Exclude current event
          .eq('event_type', eventType)
          .eq('start_date', dateRanges.nextDay)
          .limit(4);
          
        if (sameTypeNextDay && sameTypeNextDay.length >= 2) {
          console.log('Found related events with same type and next day:', sameTypeNextDay.length);
          return sameTypeNextDay;
        }
      }
      
      // Third priority: Same event type, previous day
      if (eventType && dateRanges.prevDay) {
        const { data: sameTypePrevDay } = await supabase
          .from('events')
          .select('*')
          .neq('id', eventId) // Exclude current event
          .eq('event_type', eventType)
          .eq('start_date', dateRanges.prevDay)
          .limit(4);
          
        if (sameTypePrevDay && sameTypePrevDay.length >= 2) {
          console.log('Found related events with same type and previous day:', sameTypePrevDay.length);
          return sameTypePrevDay;
        }
      }
      
      // Fourth priority: Same event type, within next week
      if (eventType && dateRanges.sameDay && dateRanges.nextWeek) {
        const { data: sameTypeNextWeek } = await supabase
          .from('events')
          .select('*')
          .neq('id', eventId) // Exclude current event
          .eq('event_type', eventType)
          .gte('start_date', dateRanges.sameDay)
          .lte('start_date', dateRanges.nextWeek)
          .limit(5);
          
        if (sameTypeNextWeek && sameTypeNextWeek.length >= 2) {
          console.log('Found related events with same type in next week:', sameTypeNextWeek.length);
          return sameTypeNextWeek;
        }
      }
      
      // Last priority: Same event type, any date
      if (eventType) {
        const { data: sameType } = await supabase
          .from('events')
          .select('*')
          .neq('id', eventId) // Exclude current event
          .eq('event_type', eventType)
          .order('start_date')
          .limit(6);
          
        if (sameType && sameType.length > 0) {
          console.log('Found related events with same type:', sameType.length);
          return sameType;
        }
      }
      
      // Fallback: Any events with matching tags
      if (eventTags.length > 0) {
        let tagMatches: Event[] = [];
        
        for (const tag of eventTags) {
          const { data: matchingTag } = await supabase
            .from('events')
            .select('*')
            .neq('id', eventId) // Exclude current event
            .ilike('tags', `%${tag}%`)
            .limit(5);
            
          if (matchingTag && matchingTag.length > 0) {
            tagMatches = [...tagMatches, ...matchingTag];
          }
        }
        
        // Remove duplicates
        const uniqueTagMatches = Array.from(new Map(tagMatches.map(event => [event.id, event])).values());
        
        if (uniqueTagMatches.length > 0) {
          console.log('Found related events with matching tags:', uniqueTagMatches.length);
          return uniqueTagMatches.slice(0, 5);
        }
      }
      
      // Very last resort: Any events, excluding current
      const { data: anyEvents } = await supabase
        .from('events')
        .select('*')
        .neq('id', eventId) // Exclude current event
        .order('start_date')
        .limit(5);
        
      console.log('Found fallback related events:', anyEvents?.length || 0);
      return anyEvents || [];
    },
    enabled: isVisible && !!eventId, // Only run when section is visible and eventId exists
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Render nothing if there was an error
  if (error) {
    console.error('Error loading related events:', error);
    return null;
  }

  // Render nothing if there are no related events yet
  if (!isLoading && (!relatedEvents || relatedEvents.length === 0)) {
    return null;
  }

  return (
    <div id="related-events-section" className="w-full">
      <h2 className="text-2xl font-bold mb-6">Similar Events</h2>
      
      {isLoading ? (
        <RelatedEventsLoader />
      ) : (
        <RelatedEventsGrid events={relatedEvents || []} />
      )}
    </div>
  );
};

export default RelatedEvents;
