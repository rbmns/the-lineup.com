
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEventMetaTags } from '@/hooks/useEventMetaTags';
import { EventDetailLoadingState } from '@/components/events/EventDetailLoadingState';
import { EventDetailErrorState } from '@/components/events/EventDetailErrorState';
import { EventDetailContent } from '@/components/events/EventDetailContent';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { data: event, error, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Event ID is required');
      }

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues!events_venue_id_fkey (
            id,
            name,
            city,
            street,
            postal_code
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }

      return data;
    },
  });

  // Set meta tags for this specific event
  useEventMetaTags(event);

  const handleBackToEvents = () => {
    navigate('/events');
  };

  if (isLoading) {
    return <EventDetailLoadingState />;
  }

  if (error) {
    return <EventDetailErrorState error={error} onBackToEvents={handleBackToEvents} />;
  }

  if (!event) {
    return <EventDetailErrorState error={null} onBackToEvents={handleBackToEvents} notFound={true} />;
  }

  return (
    <EventDetailContent event={event} />
  );
};

export default EventDetail;
