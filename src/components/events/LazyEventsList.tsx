
import React, { useState } from 'react';
import { Event } from '@/types';
import EventCard from '../EventCard';
import EventCardList from './EventCardList';
import { SkeletonCard } from '@/components/skeletons/SkeletonCard';
import { SkeletonCardList } from '@/components/skeletons/SkeletonCardList';
import { cn } from '@/lib/utils';
import { EventsEmptyState } from './list-components/EventsEmptyState';

interface LazyEventsListProps {
  mainEvents: Event[];
  relatedEvents?: Event[];
  isLoading: boolean;
  isRsvpLoading?: boolean;
  showRsvpButtons?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  hasActiveFilters?: boolean;
  compact?: boolean;
}

export const LazyEventsList: React.FC<LazyEventsListProps> = ({
  mainEvents = [],
  relatedEvents = [],
  isLoading = false,
  isRsvpLoading = false,
  showRsvpButtons = false,
  onRsvp,
  hasActiveFilters = false,
  compact = false
}) => {
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('list'); // Default to list view for compact display
  
  // Determine content to render based on loading state and data
  const renderContent = () => {
    // Loading state
    if (isLoading) {
      return displayMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCardList key={index} />
          ))}
        </div>
      );
    }
    
    // No events
    if (mainEvents.length === 0) {
      return (
        <EventsEmptyState 
          message={hasActiveFilters ? "No events match your filters" : "No events found"}
          subMessage={hasActiveFilters 
            ? "Try adjusting your filters or search criteria to find more events."
            : "Check back later for new events or try a different search."}
          resetFilters={hasActiveFilters ? () => {} : undefined}
        />
      );
    }
    
    // Display events in grid or list mode
    return displayMode === 'grid' ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mainEvents.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            compact={compact} 
            showRsvpButtons={showRsvpButtons}
            onRsvp={onRsvp}
          />
        ))}
      </div>
    ) : (
      <div className="space-y-3">
        {mainEvents.map((event) => (
          <EventCardList 
            key={event.id} 
            event={event} 
            showRsvpButtons={showRsvpButtons}
            onRsvp={onRsvp}
            compact={true}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Events</h2>
        
        <div className="flex items-center space-x-2">
          {/* Grid/List view toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <button 
              className={cn(
                "p-2", 
                displayMode === 'grid' ? "bg-gray-200" : "bg-white"
              )}
              onClick={() => setDisplayMode('grid')}
              aria-label="Grid view"
            >
              <div className="grid grid-cols-2 gap-0.5">
                <div className="h-1.5 w-1.5 bg-gray-600 rounded-sm"></div>
                <div className="h-1.5 w-1.5 bg-gray-600 rounded-sm"></div>
                <div className="h-1.5 w-1.5 bg-gray-600 rounded-sm"></div>
                <div className="h-1.5 w-1.5 bg-gray-600 rounded-sm"></div>
              </div>
            </button>
            <button 
              className={cn(
                "p-2", 
                displayMode === 'list' ? "bg-gray-200" : "bg-white"
              )}
              onClick={() => setDisplayMode('list')}
              aria-label="List view"
            >
              <div className="flex flex-col gap-0.5">
                <div className="h-1 w-4 bg-gray-600 rounded-sm"></div>
                <div className="h-1 w-4 bg-gray-600 rounded-sm"></div>
                <div className="h-1 w-4 bg-gray-600 rounded-sm"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {renderContent()}
      
      {/* Related events section - if there are any */}
      {relatedEvents && relatedEvents.length > 0 && !isLoading && (
        <div className="mt-8 pt-6 border-t">
          <h2 className="text-lg font-semibold mb-4">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedEvents.slice(0, 3).map((event) => (
              <EventCard 
                key={`related-${event.id}`} 
                event={event} 
                compact 
                showRsvpButtons={showRsvpButtons}
                onRsvp={onRsvp}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
