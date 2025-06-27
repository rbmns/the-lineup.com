
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
  
  console.log('EventDetailPage - eventId from params:', eventId);
  
  // Automatically scroll to top when navigating to event detail page
  useScrollToTop();
  
  // Ensure we have fresh event data when navigating to detail page
  useEffect(() => {
    if (eventId && user?.id) {
      console.log('Refetching event data for:', eventId);
      // Refetch event data to ensure we have the latest RSVP status
      queryClient.refetchQueries({ queryKey: ['event', eventId] });
    }
  }, [eventId, user?.id, queryClient]);
  
  if (!eventId) {
    console.error('No eventId found in URL params');
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Event URL</h1>
            <p className="text-gray-600 mb-6">The event URL is missing required information.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <EventSidePanel
        eventId={eventId}
        isOpen={true}
        onClose={() => window.history.back()}
      />
    </div>
  );
};

export default EventDetailPage;
