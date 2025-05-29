
import React from 'react';
import { Event } from '@/types';
import { RelatedEventsGrid } from './RelatedEventsGrid';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useEventProcessor } from '@/hooks/useEventProcessor';
import { useAuth } from '@/contexts/AuthContext';

interface RelatedEventsProps {
  currentEvent: Event;
  limit?: number;
}

export const RelatedEvents: React.FC<RelatedEventsProps> = ({ 
  currentEvent, 
  limit = 4 
}) => {
  const { user } = useAuth();
  const { processEvent } = useEventProcessor();

  const { data: relatedEvents = [], isLoading } = useQuery({
    queryKey: ['related-events', currentEvent.id, currentEvent.event_category],
    queryFn: async () => {
      // Find events with same category or venue, excluding current event
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues:venue_id(*),
          creator:profiles(*),
          event_rsvps(*)
        `)
        .neq('id', currentEvent.id)
        .or(`event_category.eq.${currentEvent.event_category},venue_id.eq.${currentEvent.venue_id}`)
        .order('start_date', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching related events:', error);
        return [];
      }

      return data?.map((eventData: any) => processEvent(eventData, user?.id)) || [];
    },
    enabled: !!currentEvent.event_category || !!currentEvent.venue_id,
  });

  if (isLoading || relatedEvents.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-8 border-t">
      <h2 className="text-2xl font-semibold mb-6">Related Events</h2>
      <RelatedEventsGrid events={relatedEvents} />
    </div>
  );
};
