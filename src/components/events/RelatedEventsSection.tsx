
import React from 'react';
import { Event } from '@/types';
import { CardContent, Card } from '@/components/ui/card';
import EventCard from '@/components/EventCard';

export interface RelatedEventsSectionProps {
  events: Event[];
}

export const RelatedEventsSection: React.FC<RelatedEventsSectionProps> = ({ events }) => {
  if (!events || events.length === 0) return null;
  
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Related Events</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <EventCard 
            key={event.id} 
            event={event}
            showRsvpButtons={false}
          />
        ))}
      </div>
    </div>
  );
};
