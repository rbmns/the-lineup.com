
import React, { useEffect, useRef, useState } from 'react';
import { useFetchRelatedEvents } from '@/hooks/events/useFetchRelatedEvents';
import RelatedEventsLoader from './RelatedEventsLoader';
import RelatedEventsGrid from './RelatedEventsGrid';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';

interface RelatedEventsProps {
  eventId: string;
  venueId?: string;
  eventType?: string;
  tags?: string[];
  vibe?: string;
}

export const RelatedEvents: React.FC<RelatedEventsProps> = ({ 
  eventId,
  venueId,
  eventType = '',
  tags,
  vibe
}) => {
  const { user } = useAuth();
  const hasFetchedRef = useRef(false);
  const [fallbackEvents, setFallbackEvents] = useState<Event[]>([]);
  
  // Get related events based on primary criteria
  const { relatedEvents, loading } = useFetchRelatedEvents({
    eventType,
    currentEventId: eventId,
    userId: user?.id,
    tags,
    vibe,
    minResults: 3 // Increase minimum results to ensure we show something
  });
  
  const navigate = useNavigate();
  const { navigateToDestinationEvents } = useEventNavigation();
  const isMobile = useIsMobile();

  // If we don't have at least 2 related events, fetch some fallbacks
  useEffect(() => {
    const fetchFallbackEvents = async () => {
      if (!loading && relatedEvents.length < 2 && !hasFetchedRef.current) {
        hasFetchedRef.current = true;
        
        try {
          console.log('Fetching fallback events for event type:', eventType);
          
          // First try: Get upcoming events of the same type
          let { data: typeEvents, error: typeError } = await supabase
            .from('events')
            .select('*, venues:venue_id(*), creator:profiles(*)')
            .neq('id', eventId)
            .eq('event_type', eventType)
            .gte('start_time', new Date().toISOString())
            .order('start_time', { ascending: true })
            .limit(5);
            
          // Second try: If not enough, get any upcoming events
          if (!typeEvents || typeEvents.length < 2) {
            console.log('Not enough type-matched events, fetching any upcoming events');
            const { data: anyEvents, error: anyError } = await supabase
              .from('events')
              .select('*, venues:venue_id(*), creator:profiles(*)')
              .neq('id', eventId)
              .gte('start_time', new Date().toISOString())
              .order('start_time', { ascending: true })
              .limit(5);
              
            if (anyEvents && anyEvents.length > 0) {
              console.log('Found fallback events:', anyEvents.length);
              setFallbackEvents(anyEvents);
            }
          } else {
            console.log('Found type-matched events:', typeEvents.length);
            setFallbackEvents(typeEvents);
          }
        } catch (err) {
          console.error('Error fetching fallback events:', err);
        }
      }
    };
    
    fetchFallbackEvents();
  }, [eventId, eventType, loading, relatedEvents]);

  const handleBackToEvents = () => {
    navigate('/events', {
      state: { 
        fromEventDetail: true,
        timestamp: Date.now()
      }
    });
  };
  
  if (loading) {
    return <RelatedEventsLoader />;
  }
  
  // Combine related events with fallback events but remove duplicates
  const combinedEvents = [...relatedEvents];
  
  // Only add fallback events if we need more
  if (combinedEvents.length < 2) {
    fallbackEvents.forEach(fallbackEvent => {
      // Make sure the event isn't already in the list and isn't the current event
      if (!combinedEvents.find(e => e.id === fallbackEvent.id) && fallbackEvent.id !== eventId) {
        combinedEvents.push(fallbackEvent);
      }
    });
  }

  // Debug log to check if we have any events
  console.log('Combined events for display:', combinedEvents.length);
  
  return (
    <div className="animate-fade-in space-y-4" style={{ animationDelay: '400ms' }}>
      <h2 className="text-xl font-semibold font-inter tracking-tight">
        Similar Events
      </h2>
      
      <div className="pb-2">
        <RelatedEventsGrid events={combinedEvents.slice(0, 3)} />
      </div>
      
      {/* Back button shown only on mobile, placed below related events */}
      {isMobile && (
        <div className="pt-4 pb-20">
          <Button 
            variant="secondary" 
            onClick={handleBackToEvents}
            className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all w-full"
            size="lg"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Events</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default RelatedEvents;
