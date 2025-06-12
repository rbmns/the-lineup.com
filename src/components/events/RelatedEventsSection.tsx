import React from 'react';
import { Event } from '@/types';
import { CardContent, Card } from '@/components/ui/card';
import { EventCard } from '@/components/EventCard';

export interface RelatedEventsSectionProps {
  events: Event[];
}

export const RelatedEventsSection: React.FC<RelatedEventsSectionProps> = ({ events }) => {
  if (!events || events.length === 0) return null;
  
  // Don't show duplicate events or the same event that's currently being viewed
  const currentPath = window.location.pathname;
  const currentEventId = currentPath.split('/').pop(); // Extract event ID from URL
  
  // Filter out current event and duplicates
  const uniqueEvents = Array.from(
    new Map(
      events
        .filter(event => event.id !== currentEventId) // Remove current event
        .map(event => [event.id, event])
    ).values()
  );
  
  // If we still don't have enough events after filtering, return null
  // The parent component will handle fetching more events
  if (uniqueEvents.length === 0) return null;
  
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Related Events</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {uniqueEvents.map(event => (
          <EventCard 
            key={event.id} 
            event={event}
            showRsvpButtons={false}
            compact={true} // Make sure all cards are compact
            // featured={false} // Removed, 'featured' prop does not exist on EventCard
            // loadingEventId can be passed here if available and needed for related event cards
          />
        ))}
      </div>
    </div>
  );
};
