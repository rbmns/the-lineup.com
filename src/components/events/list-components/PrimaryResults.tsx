
import React from 'react';
import { Event } from '@/types';
import { EventsList } from './EventsList';
import { Button } from '@/components/ui/button';

export interface PrimaryResultsProps {
  events: Event[];
  isLoading: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  showRsvpButtons: boolean;
  loadingEventId?: string | null;
  visibleCount: number;
  hasMore: boolean;
  onLoadMore: () => void;
  renderTeaserAfterRow?: number | false;
  showTeaser?: boolean;
  teaser?: React.ReactNode;
  searchQuery?: string;
}

export const PrimaryResults: React.FC<PrimaryResultsProps> = ({
  events,
  isLoading,
  onRsvp,
  showRsvpButtons,
  loadingEventId,
  visibleCount,
  hasMore,
  onLoadMore,
  renderTeaserAfterRow,
  showTeaser,
  teaser,
  searchQuery
}) => {
  // If we have no events, don't render anything
  if (events.length === 0) return null;

  // Get the visible events
  const visibleEvents = events.slice(0, visibleCount);

  // If we have a teaser to render after a specific row
  let firstBatch, secondBatch;
  if (renderTeaserAfterRow && showTeaser && teaser && visibleEvents.length > 0) {
    const rowSize = 3; // Assuming 3 items per row
    const breakpoint = Math.min(renderTeaserAfterRow * rowSize, visibleEvents.length);
    firstBatch = visibleEvents.slice(0, breakpoint);
    secondBatch = visibleEvents.slice(breakpoint);
  }

  return (
    <div className="space-y-8">
      {renderTeaserAfterRow && showTeaser && teaser ? (
        <>
          <EventsList
            events={firstBatch || []}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            loadingEventId={loadingEventId}
          />
          
          {teaser}
          
          {secondBatch && secondBatch.length > 0 && (
            <EventsList
              events={secondBatch}
              onRsvp={onRsvp}
              showRsvpButtons={showRsvpButtons}
              loadingEventId={loadingEventId}
            />
          )}
        </>
      ) : (
        <EventsList
          events={visibleEvents}
          onRsvp={onRsvp}
          showRsvpButtons={showRsvpButtons}
          loadingEventId={loadingEventId}
        />
      )}

      {hasMore && (
        <div className="text-center mt-6">
          <Button
            onClick={onLoadMore}
            variant="outline"
            className="mx-auto"
          >
            Load more events
          </Button>
        </div>
      )}
    </div>
  );
};

export default PrimaryResults;
