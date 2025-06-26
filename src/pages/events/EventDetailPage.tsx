
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useAuth } from '@/contexts/AuthContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { EventSidePanel } from '@/components/events/EventSidePanel';
import { useQueryClient } from '@tanstack/react-query';

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Automatically scroll to top when navigating to event detail page
  useScrollToTop();
  
  // Ensure we have fresh event data when navigating to detail page
  useEffect(() => {
    if (eventId && user?.id) {
      // Refetch event data to ensure we have the latest RSVP status
      queryClient.refetchQueries({ queryKey: ['event', eventId] });
    }
  }, [eventId, user?.id, queryClient]);
  
  return (
    <div className="min-h-screen">
      <EventSidePanel
        eventId={eventId || null}
        isOpen={true}
        onClose={() => window.history.back()}
      />
    </div>
  );
};

export default EventDetailPage;
