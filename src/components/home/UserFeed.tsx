
import React, { useState, useEffect } from 'react';
import { Event } from '@/types';
import EventCard from '@/components/events/EventCard';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedRsvp } from '@/hooks/events/useEnhancedRsvp';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';
import { EventCategoryFilters } from '@/components/events/filters/EventCategoryFilters';
import { useEventFilters } from '@/hooks/useEventFilters';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface UserFeedProps {
  events: Event[];
  isLoading?: boolean;
  showRsvpButtons?: boolean;
  showFilters?: boolean;
  className?: string;
  emptyStateMessage?: string;
  onClick?: (event: Event) => void;
}

export const UserFeed: React.FC<UserFeedProps> = ({
  events,
  isLoading = false,
  showRsvpButtons = true,
  showFilters = false,
  className,
  emptyStateMessage = "No events found",
  onClick
}) => {
  const { user } = useAuth();
  const { handleRsvp, loadingEventId } = useEnhancedRsvp(user?.id);
  const navigate = useNavigate();
  
  // Extract all unique event types from events
  const allEventTypes = [...new Set(events.map(event => event.event_type).filter(Boolean))].sort();
  
  // Use the event filters hook
  const {
    filters,
    activeFilters,
    toggleFilter,
    resetFilters,
    getActiveFilterIds
  } = useEventFilters(allEventTypes);
  
  // Filter events based on selected categories
  const activeFilterIds = getActiveFilterIds();
  const filteredEvents = activeFilterIds.length > 0
    ? events.filter(event => 
        event.event_type && 
        activeFilterIds.includes(event.event_type.toLowerCase().replace(/\s+/g, '-'))
      )
    : events;
  
  // Handle event click
  const handleEventClick = (event: Event) => {
    if (onClick) {
      onClick(event);
    } else {
      navigate(`/events/${event.id}`);
    }
  };
  
  // Handle event type selection
  const handleToggleEventType = (type: string) => {
    const filterId = type.toLowerCase().replace(/\s+/g, '-');
    toggleFilter(filterId);
  };
  
  // Select all event types
  const handleSelectAll = () => {
    resetFilters();
  };
  
  // Deselect all event types
  const handleDeselectAll = () => {
    resetFilters();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyStateMessage}</p>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {showFilters && allEventTypes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Filter by category</h3>
            {activeFilterIds.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="h-8 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear filters
              </Button>
            )}
          </div>
          
          <EventCategoryFilters
            allEventTypes={allEventTypes}
            selectedEventTypes={allEventTypes.filter(type => 
              activeFilters[type.toLowerCase().replace(/\s+/g, '-')]
            )}
            onToggleEventType={handleToggleEventType}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            className="pb-2"
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeFilterIds.length > 0 ? filteredEvents : events).map(event => (
          <EventCard 
            key={event.id}
            event={event}
            onRsvp={handleRsvp}
            showRsvpButtons={showRsvpButtons}
            loadingEventId={loadingEventId}
            onClick={handleEventClick}
          />
        ))}
      </div>
    </div>
  );
};
