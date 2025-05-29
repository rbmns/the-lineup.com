
import React from 'react';
import { Event } from '@/types';
import { EventMetaInfo } from './EventMetaInfo';
import { EventDescription } from './EventDescription';
import { EventLocationInfo } from './EventLocationInfo';
import { EventAdditionalInfo } from './EventAdditionalInfo';

interface MainEventContentProps {
  event: Event;
}

export const MainEventContent: React.FC<MainEventContentProps> = ({ event }) => {
  return (
    <div className="space-y-6">
      <EventMetaInfo event={event} />
      
      <EventDescription description={event.description || ''} isMobile={false} />
      
      <EventLocationInfo venue={event.venues} />
      
      <EventAdditionalInfo event={event} />
      
      {event.event_category && (
        <div className="pt-4 border-t">
          <span className="text-sm text-gray-500">Category: </span>
          <span className="text-sm font-medium capitalize">{event.event_category}</span>
        </div>
      )}
    </div>
  );
};
