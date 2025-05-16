
import React, { useMemo } from 'react';
import { Event } from '@/types';
import { EventsList } from './EventsList';
import { useIsMobile } from '@/hooks/use-mobile';

interface PrimaryResultsProps {
  events: Event[];
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  loadingEventId?: string | null;
  renderTeaserAfterRow?: number | false;
  teaser?: React.ReactNode;
  showTeaser?: boolean;
}

export const PrimaryResults: React.FC<PrimaryResultsProps> = ({ 
  events, 
  onRsvp,
  showRsvpButtons,
  loadingEventId,
  renderTeaserAfterRow = false,
  teaser,
  showTeaser = false
}) => {
  const isMobile = useIsMobile();
  
  // Calculate events per row based on screen size
  const eventsPerRow = isMobile ? 1 : 3;
  
  // Split events if we need to insert a teaser
  const { eventsBeforeTeaser, eventsAfterTeaser } = useMemo(() => {
    if (!renderTeaserAfterRow || !showTeaser) {
      return { eventsBeforeTeaser: events, eventsAfterTeaser: [] };
    }
    
    const splitIndex = renderTeaserAfterRow * eventsPerRow;
    return {
      eventsBeforeTeaser: events.slice(0, splitIndex),
      eventsAfterTeaser: events.slice(splitIndex)
    };
  }, [events, renderTeaserAfterRow, showTeaser, eventsPerRow]);
  
  return (
    <div className="space-y-8">
      {eventsBeforeTeaser.length > 0 && (
        <EventsList 
          events={eventsBeforeTeaser}
          onRsvp={onRsvp}
          showRsvpButtons={showRsvpButtons}
          loadingEventId={loadingEventId}
        />
      )}
      
      {showTeaser && teaser && (
        <div className="my-8">
          {teaser}
        </div>
      )}
      
      {eventsAfterTeaser.length > 0 && (
        <EventsList 
          events={eventsAfterTeaser}
          onRsvp={onRsvp}
          showRsvpButtons={showRsvpButtons}
          loadingEventId={loadingEventId}
        />
      )}
    </div>
  );
};
