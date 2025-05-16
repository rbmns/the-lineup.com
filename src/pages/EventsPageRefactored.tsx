import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useEnhancedRsvp } from '@/hooks/events/useEnhancedRsvp';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { LazyEventsList } from '@/components/events/LazyEventsList';
import { EventFilterBar } from '@/components/events/filters/EventFilterBar';
import { useCategoryFilterSelection } from '@/hooks/events/useCategoryFilterSelection';
import { useEventPageMeta } from '@/components/events/EventsPageMeta';

const EventsPageRefactored = () => {
  useEventPageMeta();
  
  const { user } = useAuth();
  const { data: events = [], isLoading: eventsLoading } = useEvents(user?.id);
  
  // Get all unique event types from events
  const allEventTypes = React.useMemo(() => {
    const types = events.map(event => event.event_type).filter(Boolean);
    return [...new Set(types)];
  }, [events]);
  
  // Filter events by selected event types
  const {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    reset
  } = useCategoryFilterSelection(allEventTypes);
  
  // Filter events based on selected categories
  const filteredEvents = React.useMemo(() => {
    // If no categories are selected, show no events (empty array)
    if (selectedCategories.length === 0) {
      return [];
    }
    
    // If all categories are selected, show all events
    if (selectedCategories.length === allEventTypes.length) {
      return events;
    }
    
    // Otherwise, filter events by selected categories
    return events.filter(event => 
      event.event_type && selectedCategories.includes(event.event_type)
    );
  }, [events, selectedCategories, allEventTypes.length]);
  
  const { 
    handleRsvp: enhancedHandleRsvp, 
    loadingEventId
  } = useEnhancedRsvp(user?.id);
  
  return (
    <div className="w-full px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="What's Happening?" />
        
        {/* Add the filter bar */}
        <div className="mt-6 mb-8">
          <EventFilterBar
            allEventTypes={allEventTypes}
            selectedEventTypes={selectedCategories}
            onToggleEventType={toggleCategory}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onReset={reset}
            hasActiveFilters={selectedCategories.length > 0 && selectedCategories.length < allEventTypes.length}
            onClearAllFilters={reset}
            className="bg-white rounded-lg shadow-sm p-4"
          />
        </div>
        
        <div className="space-y-8 mt-8">
          <LazyEventsList 
            mainEvents={filteredEvents}
            relatedEvents={[]} 
            isLoading={eventsLoading}
            onRsvp={user ? enhancedHandleRsvp : undefined}
            showRsvpButtons={!!user}
            hasActiveFilters={selectedCategories.length > 0 && selectedCategories.length < allEventTypes.length}
            loadingEventId={loadingEventId}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsPageRefactored;
