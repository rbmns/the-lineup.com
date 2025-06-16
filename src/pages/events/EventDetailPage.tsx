
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useAuth } from '@/contexts/AuthContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { EventSidePanel } from '@/components/events/EventSidePanel';

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  
  // Automatically scroll to top when navigating to event detail page
  useScrollToTop();
  
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
