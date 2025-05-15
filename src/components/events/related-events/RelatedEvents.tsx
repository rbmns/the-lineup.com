
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
  eventType: string;
  currentEventId: string;
  tags?: string[];
  vibe?: string;
}

export const RelatedEvents: React.FC<RelatedEventsProps> = ({ 
  eventType, 
  currentEventId,
  tags,
  vibe
}) => {
  const { user } = useAuth(); // Get the current user to pass to the hook
  const hasFetchedRef = useRef(false);
  const { relatedEvents, loading } = useFetchRelatedEvents({
    eventType,
    currentEventId,
    userId: user?.id, // Pass the userId to fetch RSVP status
    tags,
    vibe,
    minResults: 2
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
  
  // If no related events found, return null (hide the component completely)
  if (relatedEvents.length === 0) {
    return null;
  }
  
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
