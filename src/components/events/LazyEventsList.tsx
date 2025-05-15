
import React, { useState } from 'react';
import { Event } from '@/types';
import { EventsList } from '@/components/events/EventsList';
import { EventGrid } from '@/components/events/EventGrid';
import { RelatedEventsSection } from '@/components/events/RelatedEventsSection';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { SkeletonEventCard } from '@/components/events/SkeletonEventCard';
import { cn } from '@/lib/utils';
import { List as ListIcon, LayoutGrid } from 'lucide-react';

interface LazyEventsListProps {
  mainEvents: Event[];
  relatedEvents?: Event[];
  isLoading: boolean;
  isRsvpLoading?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  hasActiveFilters?: boolean;
  compact?: boolean;
  defaultView?: 'list' | 'grid';
}

export const LazyEventsList: React.FC<LazyEventsListProps> = ({
  mainEvents,
  relatedEvents = [],
  isLoading,
  isRsvpLoading = false,
  onRsvp,
  showRsvpButtons = true,
  hasActiveFilters = false,
  compact = false,
  defaultView = 'list'
}) => {
  // State for view mode - default based on prop
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(defaultView);
  
  // Loading skeleton cards
  const skeletonCards = Array.from({ length: 3 }, (_, i) => <SkeletonEventCard key={`skeleton-${i}`} />);

  // Determine if we should show the "no results" message
  const showNoResults = !isLoading && mainEvents.length === 0 && !hasActiveFilters;

  // Dummy resetFilters function for NoResultsFound component
  const resetFilters = () => {
    console.log("Reset filters clicked");
    // This would typically dispatch an action or call a prop function
    // But we're providing a stub implementation for now
  };

  return (
    <div className={cn('space-y-6', compact ? 'compact-view' : '')}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonCards}
        </div>
      )}

      {/* No Results Message */}
      {showNoResults && (
        <NoResultsFound resetFilters={resetFilters} />
      )}
      
      {/* Display options header */}
      {!isLoading && mainEvents.length > 0 && (
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm text-gray-500">
            {mainEvents.length} {mainEvents.length === 1 ? 'event' : 'events'} found
          </span>
          <div className="flex space-x-2">
            <button
              className={`p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-700' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List view"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              className={`p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-700' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Events */}
      {!isLoading && mainEvents.length > 0 && (
        viewMode === 'list' ? (
          <EventsList
            events={mainEvents}
            onRsvp={onRsvp}
            isRsvpLoading={isRsvpLoading}
            showRsvpButtons={showRsvpButtons}
            compact={compact}
            className="animate-fade-in"
            style={{ animationDuration: '100ms' }}
          />
        ) : (
          <EventGrid
            events={mainEvents}
            onRsvp={onRsvp}
            isRsvpLoading={isRsvpLoading}
            showRsvpButtons={showRsvpButtons}
            className="animate-fade-in"
            style={{ animationDuration: '100ms' }}
          />
        )
      )}

      {/* Related Events Section */}
      {relatedEvents && relatedEvents.length > 0 && (
        <RelatedEventsSection events={relatedEvents} />
      )}

      {/* No results message when filters are active */}
      {!isLoading && mainEvents.length === 0 && hasActiveFilters && (
        <NoResultsFound 
          message="No events found with the current filters."
          resetFilters={resetFilters}
        />
      )}
    </div>
  );
};
