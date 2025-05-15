
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

  // Query for related events
  const { data: relatedEvents, isLoading, error } = useQuery({
    queryKey: ['related-events', eventId, eventType, startDate, tags, vibe],
    queryFn: async () => {
      // Extract the date part only from startDate for date-based matching
      const eventDate = startDate ? new Date(startDate) : null;
      const startOfDay = eventDate ? new Date(eventDate.setHours(0, 0, 0, 0)).toISOString() : null;
      const endOfDay = eventDate ? new Date(eventDate.setHours(23, 59, 59, 999)).toISOString() : null;
      
      // First try: same event type, same day
      if (eventType && startOfDay && endOfDay) {
        const { data: sameTypeAndDay } = await supabase
          .from('events')
          .select('*')
          .neq('id', eventId)
          .eq('event_type', eventType)
          .gte('start_date', startOfDay)
          .lte('start_date', endOfDay)
          .limit(3);
          
        if (sameTypeAndDay && sameTypeAndDay.length >= 3) {
          console.log('Found related events with same type and day:', sameTypeAndDay.length);
          return sameTypeAndDay;
        }
      }
      
      // Second try: same event type, any day
      if (eventType) {
        const { data: sameType } = await supabase
          .from('events')
          .select('*')
          .neq('id', eventId)
          .eq('event_type', eventType)
          .order('start_date')
          .limit(5);
          
        if (sameType && sameType.length >= 3) {
          console.log('Found related events with same type:', sameType.length);
          return sameType;
        }
      }
      
      // Third try: matching tags (if available)
      if (eventTags.length > 0) {
        // For each tag, try to find matching events
        let tagMatches: Event[] = [];
        
        // Try to find events matching at least one tag
        for (const tag of eventTags) {
          const { data: matchingTag } = await supabase
            .from('events')
            .select('*')
            .neq('id', eventId)
            .ilike('tags', `%${tag}%`)
            .limit(5);
            
          if (matchingTag && matchingTag.length > 0) {
            tagMatches = [...tagMatches, ...matchingTag];
          }
        }
        
        // Remove duplicates and limit to 5
        const uniqueTagMatches = Array.from(new Map(tagMatches.map(event => [event.id, event])).values());
        
        if (uniqueTagMatches.length >= 3) {
          console.log('Found related events with matching tags:', uniqueTagMatches.length);
          return uniqueTagMatches.slice(0, 5);
        }
      }
      
      // Final fallback: any events, regardless of type or tags
      const { data: anyEvents } = await supabase
        .from('events')
        .select('*')
        .neq('id', eventId)
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
