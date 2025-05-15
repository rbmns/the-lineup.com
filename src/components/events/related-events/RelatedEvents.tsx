
import React, { useEffect, useRef } from 'react';
import { useFetchRelatedEvents } from '@/hooks/events/useFetchRelatedEvents';
import RelatedEventsLoader from './RelatedEventsLoader';
import RelatedEventsGrid from './RelatedEventsGrid';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

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
  const { relatedEvents, loading } = useFetchRelatedEvents({
    eventType,
    currentEventId: eventId,
    userId: user?.id,
    tags,
    vibe,
    minResults: 2 // Always ensure at least 2 results
  });
  
  const navigate = useNavigate();
  const { navigateToDestinationEvents } = useEventNavigation();
  const isMobile = useIsMobile();

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
  
  // Always show the component even if we have no related events
  // The hook will try its best to find at least 2 events
  
  return (
    <div className="animate-fade-in space-y-4" style={{ animationDelay: '400ms' }}>
      <h2 className="text-xl font-semibold font-inter tracking-tight">
        Similar Events
      </h2>
      
      <div className="pb-2">
        <RelatedEventsGrid events={relatedEvents} />
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
