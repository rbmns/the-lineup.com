
import React from 'react';
import { Event } from '@/types';

export interface EventDetailContentProps {
  event: Event;
  handleEventTypeClick: (eventType: string) => void;
}

export const EventDetailContent: React.FC<EventDetailContentProps> = ({ 
  event,
  handleEventTypeClick
}) => {
  // Since the component depends on many components that we can't modify,
  // we'll create placeholder versions that match the expected props
  
  const DateTimeInfo = () => (
    <div className="flex items-center space-x-2 text-gray-600 mb-4">
      <span className="font-medium">Date & Time:</span>
      <span>{new Date(event.start_time).toLocaleString()}</span>
      {event.end_time && (
        <span> - {new Date(event.end_time).toLocaleString()}</span>
      )}
    </div>
  );
  
  const LocationInfo = () => (
    <div className="flex items-center space-x-2 text-gray-600 mb-4">
      <span className="font-medium">Location:</span>
      <span>{event.location || "No location specified"}</span>
    </div>
  );
  
  const VenueInfo = () => event.venues ? (
    <div className="border-t border-gray-200 pt-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Venue</h3>
      <p>{event.venues.name}</p>
      <p>{event.venues.street}</p>
      <p>{event.venues.city}, {event.venues.postal_code}</p>
      {event.venues.website && (
        <a 
          href={event.venues.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Visit website
        </a>
      )}
    </div>
  ) : null;
  
  const Description = () => (
    <div className="border-t border-gray-200 pt-4 mb-4">
      <h3 className="font-bold text-lg mb-2">About this event</h3>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: event.description }}></div>
    </div>
  );
  
  const CategoryPills = () => (
    <div className="border-t border-gray-200 pt-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <span 
          onClick={() => handleEventTypeClick(event.event_type)} 
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition"
        >
          {event.event_type}
        </span>
        {event.tags && event.tags.map(tag => (
          <span 
            key={tag}
            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
  
  const AttendeesList = () => (
    <div className="border-t border-gray-200 pt-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Who's going</h3>
      {event.attendees ? (
        <div>
          <p>{event.attendees.going} going · {event.attendees.interested} interested</p>
        </div>
      ) : (
        <p>No attendees yet</p>
      )}
    </div>
  );
  
  const AdditionalInfo = () => event.extra_info ? (
    <div className="border-t border-gray-200 pt-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Additional Information</h3>
      <p>{event.extra_info}</p>
    </div>
  ) : null;
  
  const OrganizerInfo = () => (
    <div className="border-t border-gray-200 pt-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Organizer</h3>
      {event.organiser_name ? (
        <p>{event.organiser_name}</p>
      ) : event.creator ? (
        <p>{event.creator.username || "Anonymous"}</p>
      ) : (
        <p>Unknown organizer</p>
      )}
      
      {event.organizer_link && (
        <a 
          href={event.organizer_link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Visit organizer's website
        </a>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <DateTimeInfo />
      <LocationInfo />
      <VenueInfo />
      <Description />
      <OrganizerInfo />
      <CategoryPills />
      <AdditionalInfo />
      <AttendeesList />
    </div>
  );
};
