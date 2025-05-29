
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useEventProcessor } from '@/hooks/useEventProcessor';
import { EventDetailLoadingState } from '@/components/events/EventDetailLoadingState';
import { EventDetailErrorState } from '@/components/events/EventDetailErrorState';
import { EventDetailHeader } from '@/components/events/EventDetailHeader';
import { EventDetailContent } from '@/components/events/EventDetailContent';
import { RelatedEventsSection } from '@/components/events/RelatedEventsSection';

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { processEvent } = useEventProcessor();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async (): Promise<Event | null> => {
      if (!eventId) return null;

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues:venue_id(*),
          creator:profiles(*),
          event_rsvps(*)
        `)
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }

      return processEvent(data, user?.id);
    },
    enabled: !!eventId,
  });

  useEffect(() => {
    if (!eventId) {
      navigate('/events');
    }
  }, [eventId, navigate]);

  if (isLoading) {
    return <EventDetailLoadingState />;
  }

  if (error || !event) {
    return (
      <EventDetailErrorState 
        error={error as Error | null}
        onBackToEvents={() => navigate('/events')}
        notFound={!event}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EventDetailHeader event={event} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventDetailContent event={event} />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Sidebar content can go here */}
            </div>
          </div>
        </div>
        
        <RelatedEventsSection event={event} />
      </div>
    </div>
  );
};

export default EventDetail;
