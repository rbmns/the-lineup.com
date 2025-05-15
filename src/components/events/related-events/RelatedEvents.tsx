
import React, { useEffect, useRef, useState } from 'react';
import { useFetchRelatedEvents } from '@/hooks/events/useFetchRelatedEvents';
import RelatedEventsLoader from './RelatedEventsLoader';
import RelatedEventsGrid from './RelatedEventsGrid';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface RelatedEventsProps {
  eventId: string;
  eventType?: string;
  startDate?: string; // <-- updated from 'date'
  tags?: string[];
  vibe?: string;
}

export const RelatedEvents: React.FC<RelatedEventsProps> = ({ 
  eventId,
  eventType = '',
  startDate,
  tags,
  vibe
}) => {
  const { user } = useAuth();
  const hasFetchedRef = useRef(false);
  const [fallbackEvents, setFallbackEvents] = useState<Event[]>([]);

  // Fetch related events using type and date proximity (±2 days)
  const { relatedEvents, loading } = useFetchRelatedEvents({
    eventType,
    currentEventId: eventId,
    userId: user?.id,
    tags,
    vibe,
    minResults: 3,
    startDate, // <-- pass startDate for date-based matching
  });

  // If we don't have at least 2 related events, fetch some fallbacks
  useEffect(() => {
    const fetchFallbackEvents = async () => {
      if (!loading && relatedEvents.length < 2 && !hasFetchedRef.current) {
        hasFetchedRef.current = true;
        try {
          console.log('Fetching fallback events for event type:', eventType);
          let { data: typeEvents, error: typeError } = await supabase
            .from('events')
            .select('*, venues:venue_id(*), creator:profiles(*)')
            .neq('id', eventId)
            .eq('event_type', eventType)
            .gte('start_date', startDate || new Date().toISOString().split('T')[0])
            .order('start_date', { ascending: true })
            .limit(5);

          // Filter for events near the same date (±2 days)
          if (typeEvents && typeEvents.length > 0 && startDate) {
            const eventDate = new Date(startDate);
            typeEvents = typeEvents.filter(ev => {
              const evDate = ev.start_date ? new Date(ev.start_date) : null;
              if (!evDate) return false;
              const daysDiff = Math.abs((evDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
              return daysDiff <= 2;
            });
          }

          // Second try: If not enough, get any upcoming events
          if (!typeEvents || typeEvents.length < 2) {
            console.log('Not enough type-matched events, fetching any upcoming events');
            const { data: anyEvents, error: anyError } = await supabase
              .from('events')
              .select('*, venues:venue_id(*), creator:profiles(*)')
              .neq('id', eventId)
              .gte('start_date', new Date().toISOString().split('T')[0])
              .order('start_date', { ascending: true })
              .limit(5);

            if (anyEvents && anyEvents.length > 0) {
              setFallbackEvents(anyEvents);
            }
          } else {
            setFallbackEvents(typeEvents);
          }
        } catch (err) {
          console.error('Error fetching fallback events:', err);
        }
      }
    };
    fetchFallbackEvents();
  }, [eventId, eventType, loading, relatedEvents, startDate]);

  if (loading) {
    return <RelatedEventsLoader />;
  }

  // Combine related events with fallback events but remove duplicates
  const combinedEvents = [...relatedEvents];

  if (combinedEvents.length < 2) {
    fallbackEvents.forEach(fallbackEvent => {
      if (!combinedEvents.find(e => e.id === fallbackEvent.id) && fallbackEvent.id !== eventId) {
        combinedEvents.push(fallbackEvent);
      }
    });
  }

  if (combinedEvents.length === 0) {
    return null;
  }

  return (
    <div className="animate-fade-in space-y-4" style={{ animationDelay: '400ms' }}>
      <h2 className="text-xl font-semibold font-inter tracking-tight">
        Similar Events
      </h2>
      <div className="pb-2">
        <RelatedEventsGrid events={combinedEvents.slice(0, 3)} />
      </div>
    </div>
  );
};
