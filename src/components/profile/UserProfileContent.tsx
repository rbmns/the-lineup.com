
import React from 'react';
import { UserProfile } from '@/types';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';

interface UserProfileContentProps {
  profile: UserProfile;
  pastEvents?: Event[];
  isLoading?: boolean;
}

export const UserProfileContent: React.FC<UserProfileContentProps> = ({ 
  profile, 
  pastEvents = [],
  isLoading = false
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Past Events</h2>
      
      {isLoading ? (
        <p>Loading events...</p>
      ) : pastEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastEvents.map(event => (
            <EventCard 
              key={event.id}
              event={event}
              compact
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No past events found.</p>
      )}
    </div>
  );
};
